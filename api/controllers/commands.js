const shellCommands = require('../helpers/commands/commands')
const logger = require('../helpers/logger').logger

module.exports.echoCommand = (req, res) => { echoRoute(req, res) }
const echoRoute = async (req, res) => {
    let messageToEcho = req.swagger.params.body.value.message
    try {
        logger.log('info', req.id, `command-echo: ${messageToEcho}`)
        res.json({
            output: await shellCommands.echo({ messageToEcho })
        })
    } catch (shellError) {
        res.status(400).json({ message: 'the echo message cannot be processed' })
    }
}