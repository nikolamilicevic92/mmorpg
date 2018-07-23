const fs   = require('fs')
const path = 'logs.txt'
const mode = 'development'

class Logger {

    constructor(mode, path) {
        this.mode = mode
        this.path = path
    }

    log(message) {
        if(this.mode == 'production') {
            fs.appendFile(this.path, message + "\n", err => {
                if(err) {
                    console.log('Failed logging to file: ' + err)
                    console.log('Message to log: ' + message)
                }
            })
        } else {
            console.log(message)
        }
    }
}

module.exports = new Logger(mode, path)