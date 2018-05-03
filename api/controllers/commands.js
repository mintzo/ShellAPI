
module.exports.echoCommand = (req, res) => {
    let messageToEcho = req.swagger.params.body.value.message
    res.json({
        output: messageToEcho 
    })
}