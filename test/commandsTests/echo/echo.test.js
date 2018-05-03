const expect = require('chai').expect
const echoCommand = require('../../../api/helpers/commands/echo').echo

var assert = require('assert')
describe('Echo Command', function () {
    describe('Basic tests', function () {
        it('should return the value sent', async () => {
            let messageToEcho = 'this is a test :)'
            expect(messageToEcho).to.equal(await echoCommand({messageToEcho}))
            messageToEcho = 'this is another test :)'
            expect(messageToEcho).to.equal(await echoCommand({messageToEcho}))
            messageToEcho = 'more tests'
            expect(messageToEcho).to.equal(await echoCommand({messageToEcho}))
            messageToEcho = 'tests are awsome'
            expect(messageToEcho).to.equal(await echoCommand({messageToEcho}))
        })
    })
})