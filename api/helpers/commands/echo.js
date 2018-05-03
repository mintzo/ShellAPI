module.exports.echo = ({ messageToEcho }) => {
    return new Promise((resolve, reject) => {
        resolve(messageToEcho)
    })
}