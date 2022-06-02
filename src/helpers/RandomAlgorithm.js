import { isSameSock } from "./helperFunctions.js"
import { copySockArray } from "./helperFunctions.js"
export default function runRandomAlgo(socksInput) {
    const socks = copySockArray(socksInput)
    const playBook = [];
    //Does not support single socks
    while (socks.length > 0) {
        const random = getRandomInt(socks.length)
        let sockOne = socks[random];
        playBook.push({ type: 'select', sock: sockOne })
        playBook.push({ type: 'move', from: 'start', to: 'compare', sock: sockOne })

        let random2 = getRandomInt(socks.length);
        while (random2 === random) {
            random2 = getRandomInt(socks.length)
        }
        let sockTwo = socks[random2];
        playBook.push({ type: 'select', sock: sockTwo })
        playBook.push({ type: 'move', from: 'start', to: 'compare', sock: sockTwo })

        playBook.push({ type: 'selectAll', socks: [sockOne, sockTwo] })
        if (isSameSock(sockOne, sockTwo)) {
            playBook.push({ type: 'moveAll', from: 'compare', to: 'sorted', socks: [sockOne, sockTwo] })
            socks.splice(random > random2 ? random : random2, 1)
            socks.splice(random > random2 ? random2 : random, 1)
        } else {
            playBook.push({ type: 'moveAll', from: 'compare', to: 'start', socks: [sockOne, sockTwo] })
        }
    }




    playBook.push({ type: 'finish' })
    return playBook;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}