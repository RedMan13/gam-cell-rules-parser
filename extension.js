let parser = new Function('rule')

fetch('https://raw.githubusercontent.com/RedMan13/gam-cell-rules-parser/main/decoder.js')
    .then(x => x.text()
        .then(code => 
            parser = code.replace('module.exports = function(rule) {', '').slice(0, -1)))

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