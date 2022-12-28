const fs = require('fs')
const path = require('path')
__dirname = path.resolve(__dirname, 'extensions')

fs.readFile(path.resolve('base.js'), (err, data) => {
    if (err) throw err;
    data = String(data)
    const parser = fs.readFileSync('./decoder.js')
    const ext = Buffer.from(parser + '\n\n\n' + data)
    fs.writeFileSync(path.resolve('extension.js'), ext)
    fs.readFile(path.resolve('extension.js'), (err, data) => {
        if (err) throw err
        fs.writeFileSync(path.resolve('extension.js'), '// data:text/javascript;base64,' + ext.toString('base64') + '\n\n' + String(data))
    })
})