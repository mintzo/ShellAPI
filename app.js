var SwaggerExpress = require('swagger-express-mw')
var app = require('express')()
const correlator = require('express-correlation-id')
module.exports = app

var config = {
  appRoot: __dirname
}

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err }
  swaggerExpress.register(app)

  var port = process.env.PORT || 10010
  app.listen(port)
  app.use(correlator())
  app.use(function (err, req, res, next) {
    // console.error(err.stack)   /// log errors here
    res.status(500).send('There was a problem handeling the request')
  })
})
