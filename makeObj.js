function loopThru(cb, partStrt, seferStrt, perekStrt, pasukStrt, charStrt) {
    let partEnd = false, seferEnd = false, perekEnd = false, pasukEnd = false, charEnd = false
    
    for (let part = partEnd? 0 : partStrt; part < tenach.length; part++) {
        partEnd = true
        for (let sefer = seferEnd? 0 : seferStrt; sefer < tenach[part].length; sefer++) {
            seferEnd = true
            for (let perek = perekEnd? 0 : perekStrt; perek < tenach[part][sefer].length; perek++) {
                perekEnd = true
                for (let pasuk = pasukEnd? 0 : pasukStrt; pasuk < tenach[part][sefer][perek].length; pasuk++) {
                    pasukEnd = true
                    for (let char = charEnd? 0: charStrt; char < tenach[part][sefer][perek][pasuk].length; char++) {
                        charEnd = true
                        const curr = tenach[part][sefer][perek][pasuk][char]
                        const callback = cb(curr, part, sefer, perek, pasuk, char)
                        if (callback) return callback
                        if (callback === false) return false
                    }
                }
            }
        }
    }
}

function checkWord(word, jump, partStrt, seferStrt, perekStrt, pasukStrt, charStrt) {
    let jumps = 0
    let currWord = ''
    return loopThru((curr, part, sefer, perek, pasuk, char) => {
        if (jumps % jump === 0) currWord+= curr
        jumps++
        if (currWord === word) {
            return {
                start: {
                    part: partStrt,
                    sefer: seferStrt,
                    perek: perekStrt,
                    pasuk: pasukStrt,
                    char: charStrt
                },
                end: {
                    part,
                    sefer,
                    perek,
                    pasuk,
                    char
                },
                jump
            }
        } 
        if (word.slice(0, currWord.length) !== currWord || currWord.length > word.length) return false
    }, partStrt, seferStrt, perekStrt, pasukStrt, charStrt)
}

function findWord(word, jump) {
    const found = []
    loopThru((curr, part, sefer, perek, pasuk, char) => {
        const checkedWord = checkWord(word, jump, part, sefer, perek, pasuk, char)
        if (checkedWord) found.push(checkedWord)
    }, 0, 0, 0, 0, 0)
    return found
}

function searchThru(word, lower, upper) {
    const found = []
    for (let i = lower; i <= upper; i++) {
        const foundWord = findWord(word, i)
        if (foundWord.length) found.push(foundWord)
    }
    return found
}

function makeHebrewNumber(n) {
    const ones = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט']
    const tens = ['י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ']
    const hundreds = ['ק', 'ר', 'ש', 'ת']
    
    let hebrewNum = ''
    let hebHndrd = ''
    
    if (n % 100 === 15) {
        hebrewNum += 'וט'
        n -= 15
    }
    if (n % 100 === 16) {
        hebrewNum += 'זט'
        n -= 16
    }
    if (n % 10) {
      hebrewNum += ones[n % 10 - 1]
      n -= n % 10
    }
    if (n % 100) {
      hebrewNum += tens[(n % 100) / 10 - 1]
      n -= n % 100
    }
    n = n/100
    while(n) {
        if (n > 4) {
            hebHndrd += 'ת'
            n -= 4
        } else {
            hebHndrd += hundreds[n - 1]
            n = 0
        }
    }

    return hebHndrd + hebrewNum.split('').reverse().join('')
}

const parts = ['תורה', 'נביאים', 'כתובים']
const sefarim = [
    ['בראשית', 'שמות', 'ויקרא', 'במדבר', 'דברים'], 
    ['יהושע', 'שופטים', 'שמואל א', 'שמואל ב', 'מלכים א', 'מלכים ב', 'ישעיהו', 'ירמיהו', 'יחזקאל', 'הושע', 'יואל', 'עמוס', 'עובדיה', 'יונה', 'מיכה', 'נחום', 'חבקוק', 'צפניה', 'חגי', 'זכריה', 'מלאכי'],
    ['תהילים', 'איוב', 'משלי', 'שיר השירים', 'רות', 'איכה', 'קוהלת', 'אסתר', 'דניאל', 'עזרא', 'נחמיה', 'דברי הימים א', 'דברי הימים ב']
]

const hebLet = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת']

const obj = {}

for (let i = 0; i < hebLet.length; i++) {
    const found = findWord(hebLet[i], 1)
    for (let j = 0; j< found.length; j++) {
        found[j] = found[j].start
        found[j].jumps = []
    }
    obj[hebLet[i]] = found
}

for (let i = 0; i < hebLet.length; i++) {
    for (let j = 0; j < obj[hebLet[i]].length; j++) {
        const currLet = obj[hebLet[i]][j]
        for (let k = 1; k <= 100; k++) {
            let nextHndrd = ''
            let jumps = 0
            loopThru((curr, part, sefer, perek, pasuk, char) => {
                if (jumps % k === 0) nextHndrd += curr
                jumps++
                if (nextHndrd.length === 100) {
                    const currJump = {
                        part,
                        sefer,
                        perek,
                        pasuk,
                        char,
                        nextHndrd
                    }
                    currLet.jumps.push(currJump)
                    return false
                }
            }, currLet.part, currLet.sefer, currLet.perek, currLet.pasuk, currLet.char)
        }
    }
}

console.log(obj)