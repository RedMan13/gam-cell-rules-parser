let module = {}
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
    '!s': { type: 'stop' },
    "/l": { type: 'left direction' },
    "/r": { type: 'right direction' },
    "/u": { type: 'up direction' },
    "/d": { type: 'down direction' },
    "/m": { type: 'triger direction' },
    "/c": { type: 'clockwise rotation' },
    "/w": { type: 'counter-clockwise rotation' },
    "na": { type: 'nop' }
}
const trigerNames = {
    "l:": "pushLeft",
    "r:": "pushRight",
    "u:": "pushUp",
    "d:": "pushDown",
    "a:": "pushAnywhere",
    "c:": "rotated",
    "t:": "tick",
}
const commandValues = {
    'left direction': function(com, ret) { return 3 },
    'right direction': function(com, ret) { return 1 },
    'up direction': function(com, ret) { return 0 },
    'down direction': function(com, ret) { return 2 },
    'string/number': function(com, ret) { return com.value },
    'variable value getter': function(com, ret) { return ret[com.name] }
}

const parseCommand = (com) => {
    console.log(com)
    if (functionRegex.test(com)) {
        const command = com.split(functionRegex)
        return {
            type: 'function definition',
            name: command[1],
            inputs: command[2].replaceAll(/\\,/g, '<COMMA>').split(',').map(x => x.replaceAll('<COMMA>', ',')),
            code: command[3].replaceAll(/\\,/g, '<COMMA>').split(',').map(x => x.replaceAll('<COMMA>', ',')).map(parseCommand)
        }
    }

    if (trigers.test(com)) {
        const command = com.split(trigers)
        const input = parseCommand(command[2])
        input.get = true
        return {
            type: 'triger',
            variant: command[1],
            func: input
        }
    }
    
    if (functionRunner.test(com)) {
        const command = com.split(functionRunner)
        return {
            type: 'function runner',
            name: command[2],
            inputs: command[1].replaceAll(/\\,/g, '<COMMA>').split(',').map(x => x.replaceAll('<COMMA>', ',')).map(parseCommand)
        }
    }
    
    if (variable.test(com)) {
        const command = com.split(variable)
        const input = parseCommand(command[2])
        input.get = true
        return {
            type: 'variable definition',
            name: command[1],
            value: input
        }
    }
    
    if (variableGetter.test(com)) {
        const command = com.split(variableGetter)
        return {
            type: 'variable value getter',
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
            type: 'if else',
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
            type: 'action',
            variant: command[1],
            input: input
        }
    }
    
    if (data.test(com)) {
        const command = com.split(data)
        const input = parseCommand(command[2])
        input.get = true
        return {
            type: 'data reader',
            variant: command[1],
            input: input
        }
    }
    
    if (string.test(com)) {
        const command = com.split(string)
        return {
            type: 'string/number',
            value: command[1],
        }
    }
    
    return singles[com] ? singles[com] : Object.assign(singles['na'], { orignal: com })
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
    let retVal = {
        errors: [],
        vars: {
            cdir: 0,
            cnam: 'none'
        },
        funcs: {
            imp: {
                inputs: ['module'],
                commands: [
                    { 
                        type: 'call', 
                        func: 'importer', 
                        args: [
                            {
                                type: 'variable value getter',
                                name: 'module'
                            }
                        ] 
                    }
                ]
            },
            pos: {
                inputs: ['x', 'y'],
                commands: [
                    {
                        type: 'action',
                        variant: 't>',
                        input: { 
                            type: 'call', 
                            func: 'position callculator' ,
                            args: [
                                {
                                    type: 'variable value getter',
                                    name: 'x'
                                },
                                {
                                    type: 'variable value getter',
                                    name: 'y'
                                }
                            ] 
                        }
                    }
                ]
            },
            call: {
                inputs: ['function'],
                commands: [
                    {
                        type: 'action',
                        variant: 't>',
                        input: { 
                            type: 'call', 
                            func: {
                                type: 'variable value getter',
                                name: 'function'
                            },
                            args: [
                                {
                                    type: 'variable value getter',
                                    name: '[funcArgs]'
                                }
                            ]
                        }
                    }
                ]
            },
            newNeighbor: {
                inputs: ['location', 'type'],
                commands: [
                    { 
                        type: 'call', 
                        func: 'create new neighbor',
                        args: [
                            {
                                type: 'variable value getter',
                                name: 'location'
                            },
                            {
                                type: 'variable value getter',
                                name: 'type'
                            }
                        ]
                    }
                ]
            }
        },
        imports: [],
        trigers: {
            tick: [],
            pushUp: [],
            pushDown: [],
            pushLeft: [],
            pushRight: [],
            pushAnywhere: [],
            rotated: []
        },
        commands: []
    }
    retVal.commands = commands = commands.map(command => {
        command = parseCommand(command)
        if (command.type === 'triger') {
            retVal.trigers[trigerNames[command.variant]].push(command.func)
        }
        if (command.type === 'function definition') {
            retVal.funcs[command.name] = {
                inputs: command.inputs,
                commands: command.code
            }
        }
        if (command.type === 'variable definition') {
            if (!commandValues[command.value.type]) {
                retVal.errors.push(`cannot set the value of a variable to a command with no default return value\ncommand: ${JSON.parse(command)}\nvalue type: ${command.value.type}`)
                return singles['na']
            }
            retVal.vars[command.name] = commandValues[command.value.type](command, retVal)
        }
        if (command.type === 'nop' && command.orignal !== null) retVal.errors.push(`invalid command/command structure: ${command.orignal}`)
        if (command.type === 'function runner' && command.name === 'imp') {
            retVal.imports.push(command.inputs[0].value)
        }
        return command
    })

    return retVal
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
            color1: '#ffbb00',
            color2: '#ffaa00',
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
