import {
    isSameSock
} from "./helperFunctions.js"
import {
    copySockArray
} from "./helperFunctions.js"
export default function runSortOutAlgo(socksInput, order) {
    let orderCounter = 0;
    const socks = copySockArray(socksInput)
    const playBook = [];
    let random;
    let sockOne = null;
    //Does not support single socks
    while (socks.length > 0) {


        if (sockOne === null) {
            random = getRandomInt(socks.length)
            if (order) {
                const sockToFind = socksInput[2 * order[orderCounter++]]
                sockOne = socks.find(a => isSameSock(a, sockToFind))
            } else {
                sockOne = socks[random]
            }


            playBook.push({
                type: 'appear',
                sock: sockOne
            })
            playBook.push({
                type: 'move',
                from: 'start',
                to: 'compare',
                sock: sockOne
            })
        }
        if (socks.length === 1) {
            socks.splice(0, 1)
            break;
        }
        let random2 = getRandomInt(socks.length);
        while (random2 === random) {
            random2 = getRandomInt(socks.length)
        }

        let sockTwo;
        if (order) {
            const sockToFind = socksInput[2 * order[orderCounter++]]
            let skippedFirst = socks.filter(a => isSameSock(a, sockToFind)).length > 1 ? false : true;
            sockTwo = socks.find(a => {
                if (isSameSock(a, sockToFind)) {
                    if (!skippedFirst) {
                        skippedFirst = true;
                        return false;
                    }
                    return true;
                }

            })
        } else {
            sockTwo = socks[random2]
        }
        playBook.push({
            type: 'appear',
            sock: sockTwo
        })

        playBook.push({
            type: 'selectAll',
            socks: [sockOne, sockTwo]
        })


        if (order) {
            random = socks.indexOf(sockOne)
            random2 = socks.indexOf(sockTwo)
        }


        if (isSameSock(sockOne, sockTwo)) {
            playBook.push({
                type: 'move',
                from: 'start',
                to: 'compare',
                sock: sockTwo
            })
            playBook.push({
                type: 'moveAll',
                from: 'compare',
                to: 'sorted',
                socks: [sockOne, sockTwo]
            })

            socks.splice(random > random2 ? random : random2, 1)
            socks.splice(random > random2 ? random2 : random, 1)

            sockOne = null;
            random = null;
        } else {
            playBook.push({
                type: 'move',
                from: 'start',
                to: 'sorted-out',
                sock: sockTwo
            })
            playBook.push({
                type: 'disappear',
                sock: sockTwo
            })
            socks.splice(random2, 1)
            if (random > random2) random--;
            if (socks.length === 1) socks.splice(0, 1)
        }
    }




    playBook.push({
        type: 'finish'
    })
    return playBook;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}