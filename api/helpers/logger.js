const winston = require('winston')
const winstonLogger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './error.log', level: 'error' }),
        new winston.transports.File({ filename: './combined.log', json: false, name: 'logs' })
    ]
})

if (process.env.NODE_ENV !== 'production') {
    winstonLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

module.exports.logger = {
    log: (level, correlationId, message) => {
        winstonLogger[level](`${correlationId} -> ${message}`)
    }
}