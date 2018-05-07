var exec = require('child-process-promise').exec

const errorMessages = {
    commandExecutionError: 'the command could not execute correclty',
    incorectShellCommand: 'missing the shellCommandToRun parammeter, pass a string command to the function'
}
module.exports.errorMessages = errorMessages

module.exports.runShellCommand = ({ shellCommandToRun, options }) => {
    return new Promise(async (resolve, reject) => {
        if (shellCommandToRun === undefined || typeof shellCommandToRun != "string") { reject(errorMessages.incorectShellCommand) }
        else {
            try {
                let shellCommandExecution = await exec(`${shellCommandToRun} ${options}`)
                resolve(shellCommandExecution.stdout.toString())
            } catch (error) {
                if (error.code === 1) { resolve('\n') }
                else {
                    reject(errorMessages.commandExecutionError)
                }
            }
        }
    })
}