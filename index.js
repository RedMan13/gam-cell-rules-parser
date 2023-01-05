// for testing the decoder
const decoder = require('./decoder')
const expected = JSON.stringify(require('./expected.json'))
const prompt = require('prompt-sync')()
const fs = require('fs')

// check if the output of decoder is correct
const decoded = JSON.stringify(decoder("$(\"relative moveable vertically\")imp,tick$=(){u>/u,/u},t:$()tick"))
if (decoded !== expected) {
    console.error('Expected [2;32m"' + expected + '" [0mbut instead got [2;31m"' + decoded + '"[0m')
    const set = prompt('do you wish to set this as the expected output? ')
    if (set.toLowerCase().startsWith('y')) fs.writeFileSync('expected.json', decoded)
}

// if it is then compile it into the extension
require('./extension')