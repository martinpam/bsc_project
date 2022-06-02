import { isSameSock } from "./helperFunctions.js"
import { copySockArray } from "./helperFunctions.js"
export default function runSimpleAlgo(socksInput) {
    const socks = copySockArray(socksInput)
    const playBook = [];
    const sortedSocks = [];
    let numberSingleSocks = 0;

    let i = 0;
    for (i; i < (socks.length - numberSingleSocks); i++) {
        let sockOne = socks[i];
        playBook.push({ type: 'select', sock: sockOne })
        playBook.push({ type: 'move', from: 'start', fromCell: i, to: 'compare', toCell: 0, sock: sockOne })
        socks.splice(i, 1)
        for (let u = 0; u < (socks.length - numberSingleSocks); u++) {
            let sockTwo = socks[u];
            playBook.push({ type: 'selectAll', socks: [sockOne, sockTwo] })

            if (isSameSock(sockOne, sockTwo)) {

                playBook.push({ type: 'move', from: 'start', fromCell: u, to: 'compare', toCell: 1, sock: sockTwo })
                    //  playBook.push({ type: 'unselect', sock: sockTwo })
                playBook.push({ type: 'moveAll', from: 'compare', to: 'sorted', socks: [sockOne, sockTwo] })
                sortedSocks.push(sockOne, sockTwo);
                socks.splice(u, 1)
                sockOne = null;
                i = -1;
                break;
            } else {
                //   playBook.push({ type: 'unselect', sock: sockTwo })
            }
        }
        if (sockOne !== null) {
            numberSingleSocks++;
            socks.push(sockOne)
                //  playBook.push({ type: 'unselect', sock: sockOne })
            playBook.push({ type: 'move', from: 'compare', fromCell: 0, to: 'start', toCell: 0, sock: sockOne })
            i = -1;
        }
    }
    playBook.push({ type: 'finish' })
    return playBook;
}