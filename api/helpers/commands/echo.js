const errorMessages = { missingMessage: 'missing message to echo' }
module.exports.errorMessages = errorMessages

module.exports.echo = ({ messageToEcho }) => {
    return new Promise((resolve, reject) => {
        if (messageToEcho) { resolve(messageToEcho) }
        else { reject(errorMessages.missingMessage) }
    })
}