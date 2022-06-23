import { isSameSock } from "./helperFunctions.js"
import { copySockArray } from "./helperFunctions.js"
export default function runSimpleDivideAndSweetAlgo(socksInput) {
    const socks = copySockArray(socksInput)
    const playBook = [];
    const pendingSocks = [];
    let i = 0;
    for (i; i < socks.length; i++) {
        let sockOne = socks[i];
        playBook.push({ type: 'appear', sock: sockOne })
        for (let u = 0; u < pendingSocks.length; u++) {
            if (!pendingSocks[u].used) {
                const sockTwo = pendingSocks[u].sock
                playBook.push({ type: 'selectAll', socks: [sockOne, sockTwo] })
                if (isSameSock(sockOne, sockTwo)) {
                    playBook.push({ type: 'move', from: 'start', to: 'compare', sock: sockOne, toBoxIndex: u })
                    playBook.push({ type: 'moveAll', from: 'compare', to: 'sorted', socks: [sockOne, sockTwo], fromBoxIndex: u })
                    sockOne = null;
                    pendingSocks[u].used = true;
                    break;
                }
            }
        }
        if (sockOne !== null) {
            playBook.push({ type: 'move', from: 'start', to: 'compare', sock: sockOne, toBoxIndex: pendingSocks.length })
            pendingSocks.push({ sock: sockOne, used: false })
        }
    }
    for (let i = 0; i < pendingSocks.length; i++) {
        if (!pendingSocks[i].used) playBook.push({ type: 'move', from: 'compare', to: 'start', sock: pendingSocks[i].sock })
    }
    playBook.push({ type: 'finish' })
    return playBook;
}