const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
chai.use(chaiAsPromised)
const expect = chai.expect

const echoCommand = require('../../../api/helpers/commands/echo').echo
const echoCommandErrors = require('../../../api/helpers/commands/echo').errorMessages

var assert = require('assert')
describe('Echo Command', function () {
    describe('Basic tests', function () {
        it('should return the value sent', async () => {
            let messageToEcho = 'this is a test :)'
            expect(messageToEcho).to.equal(await echoCommand({ messageToEcho }))
            messageToEcho = 'this is another test :)'
            expect(messageToEcho).to.equal(await echoCommand({ messageToEcho }))
            messageToEcho = 'more tests'
            expect(messageToEcho).to.equal(await echoCommand({ messageToEcho }))
            messageToEcho = 'tests are awsome'
            expect(messageToEcho).to.equal(await echoCommand({ messageToEcho }))
        })
        it('should fail beccause of missing message', async () => {
            let messageToEcho = undefined
            expect(echoCommand({ messageToEcho })).to.eventually.rejectedWith(echoCommandErrors.missingMessage)
            messageToEcho = null
            expect(echoCommand({ messageToEcho })).to.eventually.rejectedWith(echoCommandErrors.missingMessage)
            expect(echoCommand({ notAMessage: 'nope' })).to.eventually.rejectedWith(echoCommandErrors.missingMessage)
        })
    })
})