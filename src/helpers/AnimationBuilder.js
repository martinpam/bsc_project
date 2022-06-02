import { getPos } from "./helperFunctions";
export function getAnimations(playBook, counters) {
    const animations = [];
    for (let i = 0; i < playBook.length; i++) {
        switch (playBook[i].type) {
            case 'move':
                addMoveAnimation(playBook[i], animations, counters)
                console.log(animations)
                break;
            case 'select':
                addSelectAnimation(playBook[i], animations, true, counters)
                break;
            case 'selectAll':
                addSelectAllAnimation(playBook[i], animations, true, counters)
                break;
            case 'moveAll':
                addMoveAllAnimation(playBook[i], animations, counters)
                break;
            case 'finish':
                addFinishedAnimation(playBook[i], animations)
                break;
            default:
                break;
        }
    }
    return animations;
}

function addMoveAnimation(step, animations, counters) {
    console.log(step)
    const sock = document.getElementById(step.sock.identifier)
    const toElem = document.getElementsByClassName(step.to)[step.toBoxIndex ? step.toBoxIndex : 0];
    const fadeOut = sock.animate([{ opacity: 0 }], { duration: 500, fill: 'forwards' });
    const fadeIn = sock.animate([{ opacity: 1 }], { duration: 300, fill: 'forwards' });
    const fillerEnd = sock.animate([{}], { duration: 0 });

    console.log(toElem, sock)
    fadeOut.onfinish = () => {
        const oldElement = sock.parentElement;
        toElem.appendChild(sock)
        adjustWidth(oldElement, step.from, step.divideAndSweep)
        fadeIn.play();
        if (step.to === 'sorted') {
            sock.style.marginRight = '-3.2rem';
        }
        if (step.to === 'sorted' && step.pairRight) {
            sock.style.marginRight = '-1.4rem';
        }

        adjustWidth(toElem, step.to, step.divideAndSweep)
        counters.moves++;
        fillerEnd.play()
    }
    animations.push({ animation: fadeOut, last: false }, { animation: fadeIn, last: false }, { animation: fillerEnd, last: true });


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
        fillerEnd.play()
    }
    animations.push({ animation: filler, last: false }, { animation: selection, last: false }, { animation: deselection, last: false }, { animation: fillerEnd, last: true })

    return animations

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

function addMoveAllAnimation(step, animations, counters) {
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
            adjustWidth(oldElement, step.from, step.divideAndSweep)
            fadeIns[u].play()
            console.log(step.to)
            if (step.to === 'sorted') {
                socktemp.style.marginRight = '-3.2rem';
            }
            if (step.to === 'sorted' && u === (fadeOuts.length - 1)) {
                socktemp.style.marginRight = '-1.4rem';
            }
            adjustWidth(toElem, step.to, step.divideAndSweep)
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


function adjustWidth(element, clazz, divideAndSweep) {
    if (clazz === 'compare-pattern' || clazz === 'compare-lineAmount' || clazz === 'compare-patternColor' || clazz === 'compare') {
        const sockAmount = element.children.length
        element.style.width = (divideAndSweep && sockAmount === 1) ? '90px' : sockAmount <= 2 ? '150px' : sockAmount <= 10 ? (10 + sockAmount * 70) + 'px' : '760px'
    } else if (clazz === 'start' || clazz === 'sorted') {
        const sockAmount = element.children.length
        element.style.height = sockAmount > 12 ? '230px' : '120px';
        element.style.width = '800px';
        if (clazz === 'start' && sockAmount === 0 && document.getElementsByClassName('start-box-sock').length > 14) element.style.height = '0px';
    }

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