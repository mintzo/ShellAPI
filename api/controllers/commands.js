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
    } catch (commandError) {
        res.status(400).json({ message: 'the echo command cannot be processed' })
    }
}

module.exports.grepCommand = (req, res) => { grepRoute(req, res) }
const grepRoute = async (req, res) => {
    let grepCommandValues = {
        searchPhrase: req.swagger.params.body.value.searchPhrase,
        filesToSearch: req.swagger.params.body.value.filesToSearch,
        filesDirectory: `${__dirname}/../../filesToUseCommandsOn`,
    }
    if (grepCommandValues.filesToSearch === undefined) { grepCommandValues.filesToSearch = [] }
    try {
        logger.log('info', req.id, `command-grep: ${JSON.stringify(grepCommandValues)}`)
        res.json({
            output: await shellCommands.grep(grepCommandValues)
        })
    } catch (commandError) {
        res.status(400).json({ message: commandError })
    }
}