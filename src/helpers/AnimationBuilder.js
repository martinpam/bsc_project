import { getPos } from "./helperFunctions";
export function getAnimations(playBook, counters, updates) {
    const animations = [];
    for (let i = 0; i < playBook.length; i++) {
        switch (playBook[i].type) {
            case 'move':
                addMoveAnimation(playBook[i], animations, counters, updates)
                console.log(animations)
                break;
            case 'select':
                addSelectAnimation(playBook[i], animations, true, counters, updates)
                break;
            case 'selectAll':
                addSelectAllAnimation(playBook[i], animations, true, counters, updates)
                break;
            case 'moveAll':
                addMoveAllAnimation(playBook[i], animations, counters, updates)
                break;
            case 'finish':
                addFinishedAnimation(playBook[i], animations)
                break;
            case 'appear':
                addAppearAnimation(playBook[i], animations, true)
                break;
            case 'disappear':
                addAppearAnimation(playBook[i], animations, false)
                break;
            case 'transferSocks':
                addTransferSocksAnimation(playBook[i], animations, updates)
                break;
            default:
                break;
        }
    }
    return animations;
}

function addMoveAnimation(step, animations, counters, updates) {
    console.log(step)
    const sock = document.getElementById(step.sock.identifier)
    console.log(sock)
    let toElem = document.getElementsByClassName(step.to)[step.toBoxIndex ? step.toBoxIndex : 0];
    const fadeOut = sock.animate([{ opacity: 0 }], { duration: 500, fill: 'forwards' });
    const fadeIn = sock.animate([{ opacity: 1 }], { duration: 300, fill: 'forwards' });
    const fillerEnd = sock.animate([{}], { duration: 0 });
    const filler = sock.animate([{}], { duration: 0 });

    filler.onfinish = () => {
        sock.style.display = 'block';
        fadeOut.play()
    }
    console.log(toElem, sock)
    fadeOut.onfinish = () => {
        const oldElement = sock.parentElement;
        if (!toElem) toElem = document.getElementsByClassName(step.to)[step.toBoxIndex ? step.toBoxIndex : 0];
        console.log(oldElement)
        document.getElementsByClassName(step.to)[step.toBoxIndex ? step.toBoxIndex : 0].appendChild(sock)
        console.log('test', oldElement, toElem, document.getElementsByClassName(step.to), step.toBoxIndex, document.getElementsByClassName(step.to)[step.toBoxIndex])
        adjustWidth(oldElement, step.from, step.divideAndSweep, updates)
        fadeIn.play();
        if (step.to === 'sorted') {
            sock.style.marginRight = '-3.2rem';
        }
        if (step.to === 'sorted' && step.pairRight) {
            sock.style.marginRight = '-1.4rem';
        }
        console.log('test')
        adjustWidth(toElem, step.to, step.divideAndSweep, updates)
        counters.moves++;
        if (step.to === 'start') sock.style.display = 'none'
        fillerEnd.play()
    }
    animations.push({ animation: filler, last: false }, { animation: fadeOut, last: false }, { animation: fadeIn, last: false }, { animation: fillerEnd, last: true });


    return animations
}

function addSelectAnimation(step, animations) {
    const sock = document.getElementById(step.sock.identifier)
    const selection = sock.firstChild.animate([{ width: '114px', height: '114px' }], { duration: 350, fill: "forwards" });
    const deselection = sock.firstChild.animate([{ width: '100px', height: '100px' }], { duration: 350, fill: "forwards" });
    const filler = sock.animate([{}], { duration: 0 });
    const fillerEnd = sock.animate([{}], { duration: 0 });
    let fakeSock;

    filler.onfinish = () => {
        console.log(sock.parentElement.classList)
        sock.style.display = 'block';
        fakeSock = document.createElement('div');
        fakeSock.style.minWidth = '100px'
        fakeSock.style.marginRight = '-2.3rem';
        fakeSock.id = step.sock.identifier + '-fake'
        fakeSock.className = 'fake-sock'
        console.log(fakeSock)
        sock.parentElement.insertBefore(fakeSock, sock)

        sock.style.position = 'absolute';
        sock.style.top = getPos(fakeSock).y + 'px';
        sock.style.left = getPos(fakeSock).x + 'px';
        console.log(sock.style)
        selection.play()
    }
    selection.onfinish = () => {
        deselection.play();

    }

    deselection.onfinish = () => {
        fakeSock.parentElement.removeChild(fakeSock)
        sock.style.position = 'relative';
        sock.style.top = 0 + 'px';
        sock.style.left = 0 + 'px';
        if (sock.parentElement.classList[1] === 'start') sock.style.display = 'none';
        fillerEnd.play()
    }
    animations.push({ animation: filler, last: false }, { animation: selection, last: false }, { animation: deselection, last: false }, { animation: fillerEnd, last: true })
}

function addSelectAllAnimation(step, animations, select, counters) {
    console.log(step, step.socks[0])

    let prepSock = document.getElementById(step.socks[0].identifier)
        // if (!prepSock) return
    console.log(prepSock, step, select)
    let filler = prepSock.animate([{}], { duration: 0 });
    let fillerEnd = prepSock.animate([{}], { duration: 0 });
    const selections = [];
    const deselections = [];
    const fakeSocks = [];
    const socks = []
    for (let i = 0; i < step.socks.length; i++) {
        socks.push(document.getElementById(step.socks[i].identifier))
        selections.push(socks[i].firstChild.animate([{ width: '114px', height: '114px' }], { duration: 350, fill: "forwards" }));
        deselections.push(socks[i].firstChild.animate([{ width: '100px', height: '100px' }], { duration: 350, fill: "forwards" }));
    }
    filler.onfinish = () => {
        for (let u = 0; u < selections.length; u++) {
            socks[u].style.display = 'block';
            selections[u].play()
            const fakeSock = document.createElement('div');
            fakeSock.style.minWidth = '100px'
            fakeSock.style.marginRight = '-2.3rem';
            fakeSock.className = 'fake-sock'
            fakeSock.id = step.socks[u].identifier + '-fake'
            socks[u].parentElement.insertBefore(fakeSock, socks[u])
            socks[u].style.position = 'absolute';
            socks[u].style.top = getPos(fakeSock).y + 'px';
            socks[u].style.left = getPos(fakeSock).x + 'px';
            fakeSocks.push(fakeSock)
            selections[u].play()
        }
    }
    for (let u = 0; u < selections.length; u++) {
        selections[u].onfinish = () => {
            deselections[u].play();

        }
    }
    for (let x = 0; x < deselections.length; x++) {
        deselections[x].onfinish = () => {
            fakeSocks[x].parentElement.removeChild(fakeSocks[x])
            socks[x].style.position = 'relative';
            socks[x].style.top = 0 + 'px';
            socks[x].style.left = 0 + 'px';
            if (socks[x].parentElement.classList[1] === 'start') socks[x].style.display = 'none';
            if (x === (deselections.length - 1)) {
                counters.comparisons++;
                fillerEnd.play()
            }
        }
    }

    animations.push({ animation: filler, last: false })
    for (let z = 0; z < selections.length; z++) {
        animations.push({ animation: selections[z], last: false })
        animations.push({ animation: deselections[z], last: false })
    }
    animations.push({ animation: fillerEnd, last: true })

}

function addTransferSocksAnimation(step, animations, updates) {
    console.log(step)
    let fromElem = document.getElementsByClassName('basket-sorted-out')[0];
    let prepSock = document.getElementById(step.socks[0].identifier)
    let fillerEnd = prepSock.animate([{}], { duration: 0 });
    const toElem = document.getElementsByClassName(step.to)[0]
    const animationElem = document.getElementById('filler')
    let basketAnimation = animationElem.animate([{ width: '0px' }], { duration: 600, fill: 'forwards' })
    let basketAnimationRevert = animationElem.animate([{ width: '150px' }], { duration: 600, fill: 'forwards' })



    basketAnimation.onfinish = () => {
        for (let i = 0; i < step.socks.length; i++) {
            const sock = document.getElementById(step.socks[i].identifier)
            sock.parentElement.removeChild(sock);
            toElem.appendChild(sock);
        }
        console.log('test', updates)
        updates.basket = !updates.basket;
        console.log('test', updates)

        basketAnimationRevert.play();

    }
    basketAnimationRevert.onfinish = () => {
        fillerEnd.play()
    }

    animations.push({ animation: basketAnimation, last: false }, { animation: basketAnimationRevert, last: false }, { animation: fillerEnd, last: true })
}


function addMoveAllAnimation(step, animations, counters, updates) {
    const toElem = document.getElementsByClassName(step.to)[step.toBoxIndex ? step.toBoxIndex : 0];
    let prepSock = document.getElementById(step.socks[0].identifier)
    let filler = prepSock.animate([{}], { duration: 0 });
    let fillerEnd = prepSock.animate([{}], { duration: 0 });
    const fadeOuts = [];
    const fadeIns = [];

    for (let i = 0; i < step.socks.length; i++) {
        const sock = document.getElementById(step.socks[i].identifier)
        fadeOuts.push(sock.animate([{ opacity: 0 }], { duration: 500, fill: 'forwards' }));
        fadeIns.push(sock.animate([{ opacity: 1 }], { duration: 300, fill: 'forwards' }));
    }
    filler.onfinish = () => {
        for (let u = 0; u < fadeOuts.length; u++) {
            fadeOuts[u].play();
        }
    }
    for (let u = 0; u < fadeOuts.length; u++) {
        fadeOuts[u].onfinish = () => {
            let socktemp = document.getElementById(step.socks[u].identifier)
            const oldElement = socktemp.parentElement;
            toElem.appendChild(socktemp);
            console.log('test')
            adjustWidth(oldElement, step.from, step.divideAndSweep, updates)
            fadeIns[u].play()
            console.log(step.to)
            if (step.to === 'sorted') {
                socktemp.style.marginRight = '-3.2rem';
            }
            if (step.to === 'sorted' && u === (fadeOuts.length - 1)) {
                socktemp.style.marginRight = '-1.4rem';
            }
            console.log('test')
            adjustWidth(toElem, step.to, step.divideAndSweep, updates)
            counters.moves++;
        }
    }
    fadeIns[fadeIns.length - 1].onfinish = () => fillerEnd.play()
    animations.push({ animation: filler, last: false })
    for (let z = 0; z < step.socks.length; z++) {
        animations.push({ animation: fadeOuts[z], last: false })
        animations.push({ animation: fadeIns[z], last: false })
    }
    animations.push({ animation: fillerEnd, last: true })

}

function addAppearAnimation(step, animations, appear) {
    const sock = document.getElementById(step.sock.identifier)
    const animation = appear ?
        sock.animate([{ opacity: 1 }], { duration: 600, fill: 'forwards' }) :
        sock.animate([{ opacity: 0 }], { duration: 500, fill: 'forwards' });
    const filler = sock.animate([{}], { duration: 0 });
    const fillerEnd = sock.animate([{}], { duration: 0 });
    filler.onfinish = () => {
        sock.style.display = 'block'
        if (appear) {

            sock.style.opacity = 0;
        } else {
            sock.style.opacity = 1;
        }

        animation.play()
    }
    animation.onfinish = () => {
        fillerEnd.play()
        if (!appear) {
            sock.style.display = 'none'
        }
    }
    animations.push({ animation: filler, last: false }, { animation: animation, last: false }, { animation: fillerEnd, last: true })
}


function adjustWidth(element, clazz, divideAndSweep, updates) {
    console.log('test', element, clazz, divideAndSweep, updates)
    if (clazz === 'compare-pattern' || clazz === 'compare-lineAmount' || clazz === 'compare-patternColor' || clazz === 'compare') {
        const sockAmount = element.children.length
        element.style.width = (divideAndSweep && sockAmount === 1) ? '90px' : sockAmount <= 2 ? '150px' : sockAmount <= 10 ? (10 + sockAmount * 70) + 'px' : '760px'
    } else if (clazz === 'start' || clazz === 'sorted') {
        const sockAmount = element.children.length
        element.style.height = clazz === 'sorted' && sockAmount > 12 ? '240px' : '120px';


    }
    updates.basket = !updates.basket;


}

function addFinishedAnimation(step, animations) {
    const filler = document.getElementById('app').animate([{}], { duration: 0 });
    const fillerEnd = document.getElementById('app').animate([{}], { duration: 0 });
    filler.onfinish = () => {
        document.getElementById('pause-button').style.display = 'none'
        fillerEnd.play()
    }
    animations.push({ animation: filler, last: false }, { animation: fillerEnd, last: true })
}