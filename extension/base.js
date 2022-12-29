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