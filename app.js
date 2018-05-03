var SwaggerExpress = require('swagger-express-mw')
const addRequestId = require('express-request-id')()
const express = require('express')
const app = express()
const documentation = require('./documentation')
app.use(addRequestId)

module.exports = app
const logger = require('./api/helpers/logger').logger

var config = {
  appRoot: __dirname
}

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err }

  swaggerExpress.register(app)
  documentation.attachSwaggerUI(app)

  var port = process.env.PORT || 10010
  app.listen(port)

  app.use(function (err, req, res, next) {
    logger.log('error', req.id, err.stack)
    res.status(500).send('There was a problem handeling the request')
  })
})
