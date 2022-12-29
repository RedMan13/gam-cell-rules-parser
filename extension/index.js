const fs = require('fs')
let old__dirname = __dirname.slice(0, -10)
if (!__dirname.endsWith('extension')) {
    old__dirname = __dirname
    __dirname += '/extension'
}
const extFile = __dirname + '/extension.js'
const decoder = old__dirname + '/decoder.js'
const extBase = __dirname + '/base.js'

fs.readFile(extBase, (err, data) => {
    if (err) throw err;
    data = String(data)
    const parser = fs.readFileSync(decoder)
    const ext = Buffer.from('let module = {}\n' + parser + '\n\n\n' + data)
    fs.writeFileSync(extFile, ext)
    fs.readFile(extFile, (err, data) => {
        if (err) throw err
        fs.writeFileSync(extFile, '// data:text/javascript;base64,' + ext.toString('base64') + '\n\n' + String(data))
    })
})
