import { store } from '../store.js'
export function isSameSock(sock1, sock2) {
    console.log(sock1, sock2)
    return (
        sock1.color === sock2.color &&
        sock1.lineAmount === sock2.lineAmount &&
        sock1.pattern === sock2.pattern &&
        (sock1.patternColor === sock2.patternColor || sock1.pattern === 'None' && sock2.pattern === 'None')
    );
}

export function areSameSocks(socks) {
    console.log('asdf', socks)
    for (let i = 0; i < socks.length; i++) {
        for (let u = i + 1; u < socks.length; u++) {
            if (!isSameSock(socks[i], socks[u])) return false;
        }
    }
    return true;
}

//Fisher-Yates shuffle
export function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    console.log(array)
    return array;
}

export function copySockArray(socksToCopy) {
    const socks = [];
    for (let i = 0; i < socksToCopy.length; i++) {
        socks.push({
            color: socksToCopy[i].color,
            pattern: socksToCopy[i].pattern,
            patternColor: socksToCopy[i].patternColor,
            lineAmount: socksToCopy[i].lineAmount,
            type: socksToCopy[i].type,
            identifier: 'sock-' + i,
        })
    }
    return socks;
}

export function getPos(obj) {
    return {
        x: obj.getBoundingClientRect().x,
        y: obj.getBoundingClientRect().y,
    };
}

export function t(word) {
    console.log(word)
    let dictionary = require('../../data/dictionary.json');
    return dictionary[word][store.language]

}


//cookie functions taken from https://www.w3schools.com/js/js_cookies.asp
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}