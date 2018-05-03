const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()
const express = require('express')
const fs = require('fs-extra')

module.exports.attachSwaggerUI = (app) => {
    app.use(express.static(pathToSwaggerUi))
    let swaggerUIHtml = fs.readFileSync(`${__dirname}/./node_modules/swagger-ui-dist/index.html`, 'utf8')
    swaggerUIHtml = swaggerUIHtml.replace('http://petstore.swagger.io/v2/swagger.json', '/apiV1/swagger')
    fs.outputFileSync(`${__dirname}/./node_modules/swagger-ui-dist/index.html`, swaggerUIHtml)
}