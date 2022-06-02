import { isSameSock, areSameSocks } from "./helperFunctions.js"
import { copySockArray } from "./helperFunctions.js"
export default function runDivideAndSweepAlgo(socksInput) {
    const socks = copySockArray(socksInput)
    const playBook = [];
    const socksByColor = [];
    for (let i = 0; i < socks.length; i++) {
        let sockOne = socks[i];
        for (let u = 0; u < socksByColor.length; u++) {
            const sockTwo = socksByColor[u].socks[0];
            playBook.push({ type: 'selectAll', socks: [sockOne, sockTwo], fromm: 13 })
            if (sockOne.color === sockTwo.color) {
                playBook.push({ type: 'move', from: 'start', to: 'compare', sock: sockOne, toBoxIndex: u, divideAndSweep: true })
                socksByColor[u].socks.push(sockOne);
                console.log('sanity', socksByColor)
                sockOne = null;
                break;
            }
        }
        if (sockOne !== null) { //if color of sock was not yet in a box, a new box is needed
            playBook.push({ type: 'move', from: 'start', to: 'compare', sock: sockOne, toBoxIndex: socksByColor.length, divideAndSweep: true })
            socksByColor.push({ color: sockOne.color, socks: [sockOne], used: false })
            console.log(socksByColor)
        }
    }
    //check for same socks
    for (let i = 0; i < socksByColor.length; i++) {
        playBook.push({ type: 'selectAll', socks: [...socksByColor[i].socks], fromm: 29 })
        if (socksByColor[i].socks.length === 1) {
            playBook.push({ type: 'move', from: 'compare', to: 'start', sock: socksByColor[i].socks[0], divideAndSweep: true })
            socksByColor.splice(i, 1);
            i--
        } else if (areSameSocks(socksByColor[i].socks)) {
            console.log(socksByColor[i])
            while (socksByColor[i].socks.length > 0) {
                playBook.push({ type: 'moveAll', from: 'compare', to: 'sorted', socks: [socksByColor[i].socks[0], socksByColor[i].socks[1]], divideAndSweep: true })
                console.log('splice', socksByColor[i].socks)
                socksByColor[i].socks.splice(0, 2);
                console.log('splice', socksByColor[i].socks)
                console.log(socksByColor[i])
                if (socksByColor[i].socks.length === 1) {
                    playBook.push({ type: 'move', from: 'compare', to: 'start', sock: socksByColor[i].socks[0], divideAndSweep: true })
                    socksByColor[i].socks.splice(0, 1);

                }
            }

        }
    }
    //sort for pattern
    const socksByColorAndPattern = []
    for (let i = 0; i < socksByColor.length; i++) {
        for (let u = 0; u < socksByColor[i].socks.length; u++) {
            let sockOne = socksByColor[i].socks[u];
            for (let z = 0; z < socksByColorAndPattern.length; z++) {
                let sockTwo = socksByColorAndPattern[z].socks[0];
                playBook.push({ type: 'selectAll', socks: [sockOne, sockTwo] })
                if (sockOne.color === sockTwo.color && sockOne.pattern === sockTwo.pattern) {
                    playBook.push({ type: 'move', from: 'compare', to: 'compare-pattern', sock: sockOne, toBoxIndex: z, divideAndSweep: true })
                    socksByColorAndPattern[z].socks.push(sockOne);
                    sockOne = null;
                    break;
                }
            }
            if (sockOne !== null) { //if color of sock was not yet in a box, a new box is needed
                playBook.push({ type: 'move', from: 'compare', to: 'compare-pattern', sock: sockOne, toBoxIndex: socksByColorAndPattern.length, divideAndSweep: true })
                socksByColorAndPattern.push({ color: sockOne.color, pattern: sockOne.pattern, socks: [sockOne], used: false })

            }
        }
    }

    //check for same socks
    for (let i = 0; i < socksByColorAndPattern.length; i++) {
        playBook.push({ type: 'selectAll', socks: [...socksByColorAndPattern[i].socks] })
        if (socksByColorAndPattern[i].socks.length === 1) {
            playBook.push({ type: 'move', from: 'compare-pattern', to: 'start', sock: socksByColorAndPattern[i].socks[0], divideAndSweep: true })
            socksByColorAndPattern.splice(i, 1);
            i--
        } else if (areSameSocks(socksByColorAndPattern[i].socks)) {
            while (socksByColorAndPattern[i].socks.length > 0) {
                playBook.push({ type: 'moveAll', from: 'compare-pattern', to: 'sorted', socks: [socksByColorAndPattern[i].socks[0], socksByColorAndPattern[i].socks[1]], divideAndSweep: true })
                socksByColorAndPattern[i].socks.splice(0, 2);
                if (socksByColorAndPattern[i].socks.length === 1) {
                    playBook.push({ type: 'move', from: 'compare-pattern', to: 'start', sock: socksByColorAndPattern[i].socks[0], divideAndSweep: true })
                    socksByColorAndPattern[i].socks.splice(0, 1);
                }
            }
            socksByColorAndPattern.splice(i, 1);
            i--;

        }
    }

    //sort for patternColor
    const socksByColorPatternPatternColor = []
    for (let i = 0; i < socksByColorAndPattern.length; i++) {
        for (let u = 0; u < socksByColorAndPattern[i].socks.length; u++) {
            let sockOne = socksByColorAndPattern[i].socks[u];
            for (let z = 0; z < socksByColorPatternPatternColor.length; z++) {
                let sockTwo = socksByColorPatternPatternColor[z].socks[0];
                playBook.push({ type: 'selectAll', socks: [sockOne, sockTwo] })
                if (sockOne.color === sockTwo.color && sockOne.pattern === sockTwo.pattern && sockOne.patternColor === sockTwo.patternColor) {
                    playBook.push({ type: 'move', from: 'compare-pattern', to: 'compare-patternColor', sock: sockOne, toBoxIndex: z, divideAndSweep: true })
                    socksByColorPatternPatternColor[z].socks.push(sockOne);
                    sockOne = null;
                    break;
                }
            }
            if (sockOne !== null) { //if color of sock was not yet in a box, a new box is needed
                playBook.push({ type: 'move', from: 'compare-pattern', to: 'compare-patternColor', sock: sockOne, toBoxIndex: socksByColorPatternPatternColor.length, divideAndSweep: true })
                socksByColorPatternPatternColor.push({ color: sockOne.color, pattern: sockOne.pattern, patternColor: sockOne.patternColor, socks: [sockOne], used: false })

            }
        }
    }

    //check for same socks
    for (let i = 0; i < socksByColorPatternPatternColor.length; i++) {
        playBook.push({ type: 'selectAll', socks: [...socksByColorPatternPatternColor[i].socks] })
        if (socksByColorPatternPatternColor[i].socks.length === 1) {
            playBook.push({ type: 'move', from: 'compare-patternColor', to: 'start', sock: socksByColorPatternPatternColor[i].socks[0], divideAndSweep: true })
            socksByColorPatternPatternColor.splice(i, 1);
            i--
        } else if (socksByColorPatternPatternColor[i].socks && areSameSocks(socksByColorPatternPatternColor[i].socks)) {
            while (socksByColorPatternPatternColor[i].socks.length > 0) {
                playBook.push({ type: 'moveAll', from: 'compare-patternColor', to: 'sorted', socks: [socksByColorPatternPatternColor[i].socks[0], socksByColorPatternPatternColor[i].socks[1]], divideAndSweep: true })
                socksByColorPatternPatternColor[i].socks.splice(0, 2);
                if (socksByColorPatternPatternColor[i].socks.length === 1) {
                    playBook.push({ type: 'move', from: 'compare-patternColor', to: 'start', sock: socksByColorPatternPatternColor[i].socks[0], divideAndSweep: true })
                    socksByColorPatternPatternColor[i].socks.splice(0, 1);
                }
            }
            socksByColorPatternPatternColor.splice(i, 1);
            i--;

        }
    }

    //sort for lineAmount
    const socksByAll = []
    for (let i = 0; i < socksByColorPatternPatternColor.length; i++) {
        for (let u = 0; u < socksByColorPatternPatternColor[i].socks.length; u++) {
            let sockOne = socksByColorPatternPatternColor[i].socks[u];
            for (let z = 0; z < socksByAll.length; z++) {
                let sockTwo = socksByAll[z].socks[0];
                playBook.push({ type: 'selectAll', socks: [sockOne, sockTwo] })
                if (sockOne.color === sockTwo.color && sockOne.pattern === sockTwo.pattern && sockOne.patternColor === sockTwo.patternColor && sockOne.lineAmount === sockTwo.lineAmount) {
                    playBook.push({ type: 'move', from: 'compare-patternColor', to: 'compare-lineAmount', sock: sockOne, toBoxIndex: z, divideAndSweep: true })
                    socksByAll[z].socks.push(sockOne);
                    sockOne = null;
                    break;
                }
            }
            if (sockOne !== null) { //if color of sock was not yet in a box, a new box is needed
                playBook.push({ type: 'move', from: 'compare-patternColor', to: 'compare-lineAmount', sock: sockOne, toBoxIndex: socksByAll.length, divideAndSweep: true })
                socksByAll.push({ color: sockOne.color, pattern: sockOne.pattern, patternColor: sockOne.patternColor, lineAmount: sockOne.lineAmount, socks: [sockOne], used: false })
            }
        }
    }
    //check for same socks
    for (let i = 0; i < socksByAll.length; i++) {
        playBook.push({ type: 'selectAll', socks: [...socksByAll[i].socks] })
        if (socksByAll[i].socks.length === 1) {
            playBook.push({ type: 'move', from: 'compare-lineAmount', to: 'start', sock: socksByAll[i].socks[0], divideAndSweep: true })
            socksByAll.splice(i, 1);
            i--
        } else if (socksByAll[i].socks && areSameSocks(socksByAll[i].socks)) {
            while (socksByAll[i].socks.length > 0) {
                playBook.push({ type: 'moveAll', from: 'compare-lineAmount', to: 'sorted', socks: [socksByAll[i].socks[0], socksByAll[i].socks[1]], divideAndSweep: true })
                socksByAll[i].socks.splice(0, 2);
                if (socksByAll[i].socks.length === 1) {
                    playBook.push({ type: 'move', from: 'compare-lineAmount', to: 'start', sock: socksByAll[i].socks[0], divideAndSweep: true })
                    socksByAll[i].socks.splice(0, 1);
                }
            }
            socksByAll.splice(i, 1);
            i--;
        }
    }
    playBook.push({ type: 'finish' })
    return playBook;
}