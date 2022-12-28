const fs = require('fs')

fs.readFile('./extension/base.js', (err, data) => {
    if (err) throw err;
    data = String(data)
    const parser = fs.readFileSync('./decoder.js')
    const ext = Buffer.from(parser + '\n\n\n' + data)
    fs.writeFileSync('./extension/extension.js', ext)
    fs.readFile('./extension/extension.js', (err, data) => {
        if (err) throw err
        fs.writeFileSync('./extension/extension.js', '// data:text/javascript;base64,' + ext.toString('base64') + '\n' + ext.toString('utf-8'))
    })
})