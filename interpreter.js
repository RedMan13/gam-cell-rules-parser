

class interpreter {
  variables = {}
  functions = {}
  
  run(code) {
    _getAllVars(code)
  }
  
  async _getAllVars(code) {
    code.forEach((com, idx) => {
      if (com.command === 'function definition') {
        functions[com.name] = com.code
        _getAllVars(val.code)
        return
      }
      variables[com.name] = com.value
    })
  }

  get(func, code) {
    
  }
}

module.exports = interpreter