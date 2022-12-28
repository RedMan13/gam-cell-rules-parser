// for testing the decoder
const decoder = require('./decoder')
const expected = JSON.stringify(require('./expected.json'))

// check if the output of decoder is correct
const decoded = JSON.stringify(decoder("$(\"relative moveable vertically\")imp,tick$=(){u>/u,/u},t:$()tick"))
if (decoded !== expected) throw new Error('Expected "' + expected + '" but instead got "' + decoded + '"')

// if it is then compile it into the extension
require('./extension')