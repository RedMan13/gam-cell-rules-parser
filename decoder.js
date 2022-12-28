const actions = /(.>)(.*)/g
const string = /\"(.*)\"/g
const trigers = /(.:)(.*)/g
const data = /(\?.)(.*)/g
const functionRunner = /\$\((.*)\)(.*)/g
const functionRegex = /(.*)\$=\((.*)\){(.*)}/g
const variable = /(.*)\=(.*)/g
const variableGetter = /@(.*)/g
const ifelse = /(.*)\?(.*)\|(.*)/g

const singles = {
    '!s': { command: 'stop' },
    "/l": { command: 'left direction' },
    "/r": { command: 'right direction' },
    "/u": { command: 'up direction' },
    "/d": { command: 'down direction' },
    "/m": { command: 'triger direction' },
    "/c": { command: 'clockwise rotation' },
    "/w": { command: 'counter-clockwise rotation' },
    "na": { command: 'nop' }
}

const parseCommand = (com) => {
    if (functionRegex.test(com)) {
        const command = com.split(functionRegex)
        return {
            command: 'function definition',
            name: command[1],
            inputs: command[2].split(','),
            code: command[3].split(',').map(parseCommand)
        }
    }

    if (trigers.test(com)) {
        const command = com.split(trigers)
        const input = parseCommand(command[2])
        input.get = true
        return {
            command: 'triger',
            variant: command[1],
            func: input
        }
    }
    
    if (functionRunner.test(com)) {
        const command = com.split(functionRunner)
        return {
            command: 'function runner',
            name: command[2],
            inputs: command[1].split(',').map(parseCommand)
        }
    }
    
    if (variable.test(com)) {
        const command = com.split(variable)
        const input = parseCommand(command[2])
        input.get = true
        return {
            command: 'variable definition',
            name: command[1],
            value: input
        }
    }
    
    if (variableGetter.test(com)) {
        const command = com.split(variableGetter)
        return {
            command: 'variable value getter',
            name: command[1]
        }
    }
    
    if (ifelse.test(com)) {
        const command = com.split(ifelse)
        const input1 = parseCommand(command[1])
        input1.get = true
        const input2 = parseCommand(command[2])
        input2.get = true
        const input3 = parseCommand(command[3])
        input3.get = true
        return {
            command: 'if else',
            name: input1,
            true: input2,
            false: input3
        }
    }

    if (actions.test(com)) {
        const command = com.split(actions)
        const input = parseCommand(command[2])
        input.get = true
        return {
            command: 'action',
            variant: command[1],
            input: input
        }
    }
    
    if (data.test(com)) {
        const command = com.split(data)
        const input = parseCommand(command[2])
        input.get = true
        return {
            command: 'data reader',
            variant: command[1],
            input: input
        }
    }
    
    if (string.test(com)) {
        const command = com.split(string)
        return {
            command: 'string/number',
            value: command[1],
        }
    }
    
    return singles[com] ? singles[com] : singles['na']
}

const parser = function(rule) {
    rule = rule.replaceAll('\n', '')
    let inside = false
    let commands = ['']
    for (let idx = 0, char = ''; idx < rule.length + 1; char = rule[idx++]) {
        if (char === ',' && !inside) {
            commands.push('')
            continue
        }
        commands[commands.length-1] += char
        if (char === '"' || char === '(' || char === '{') {
            inside = true
            continue
        }
        if (char === '"' || char === ')' || char === '}') {
            inside = false
            continue
        }
    }
    return commands.map(parseCommand)
}

module.exports = parser

class cellParser {
    constructor (runtime) {
        // Extension stuff
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'cellparser',
            name: 'Gam Cell Rule Parser',
            color1: '#4576b4d',
            blocks: [
                {
                    opcode: 'parsetextcodeintojson',
                    blockType: "reporter",
                    text: "parse text code [text] into json data",
                    arguments: {
                        text: {
                            type: "string",
                            defaultValue: "$(\"relative moveable vertically\")imp,tick$=(){u>/u,/u},t:$()tick"
                        }
                    }
                }
            ]
        };
    };
    
    // Code for blocks go here
    
    parsetextcodeintojson({text}) {
        return JSON.stringify(parser(text))
    }
};

(function() {
    var extensionClass = cellParser;
    if (typeof window === "undefined" || !window.vm) {
        Scratch.extensions.register(new extensionClass());
    } else {
        var extensionInstance = new extensionClass(window.vm.extensionManager.runtime);
        var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance);
        window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName);
    };
})()