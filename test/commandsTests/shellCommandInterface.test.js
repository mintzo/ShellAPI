const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
chai.use(chaiAsPromised)
const expect = chai.expect

const runShellCommand = require('../../api/helpers/shellCommandInterface').runShellCommand
const errorMessages = require('../../api/helpers/shellCommandInterface').errorMessages

var assert = require('assert')
describe('Shell Command Interface', function () {
    describe('Input validation tests', function () {
        it('should reject because of invalid input', async () => {
            await expect(runShellCommand({})).to.eventually.rejectedWith(errorMessages.incorectShellCommand)
            await expect(runShellCommand({ test: true })).to.eventually.rejectedWith(errorMessages.incorectShellCommand)
            await expect(runShellCommand('string')).to.eventually.rejectedWith(errorMessages.incorectShellCommand)
            await expect(runShellCommand({ shellCommandToRun: true })).to.eventually.rejectedWith(errorMessages.incorectShellCommand)
            await expect(runShellCommand({ shellCommandToRun: 232 })).to.eventually.rejectedWith(errorMessages.incorectShellCommand)
            await expect(runShellCommand({ options: 'sdfsdfasf' })).to.eventually.rejectedWith(errorMessages.incorectShellCommand)
        })
    })
    describe('Command tests', function () {
        it('should run echo and return the output', async () => {
            let messageToEcho = 'this is a test :)'
            let shellCommandToRun = `echo`
            expect(await runShellCommand({ shellCommandToRun, options: `"${messageToEcho}"` })).to.equal(messageToEcho + '\n')
            messageToEcho = 'this is another test :)'
            expect(await runShellCommand({ shellCommandToRun, options: `"${messageToEcho}"` })).to.equal(messageToEcho + '\n')
            messageToEcho = 'more tests'
            expect(await runShellCommand({ shellCommandToRun, options: `"${messageToEcho}"` })).to.equal(messageToEcho + '\n')
            messageToEcho = 'tests are awsome'
            expect(await runShellCommand({ shellCommandToRun, options: `"${messageToEcho}"` })).to.equal(messageToEcho + '\n')
        })
        it('should run grep and return the output', async () => {
            let searchPhrase = '\'amazing\'', filesToSearch = [
                `${__dirname}/../sampleFilesToTestCommandsOn/file1.txt`,
                `${__dirname}/../sampleFilesToTestCommandsOn/file2.txt`]
            let shellCommandToRun = `grep`
            expect(await runShellCommand({ shellCommandToRun, options: `${searchPhrase} ${filesToSearch[0]}` })).to.equal('this file is amazing\n')
            searchPhrase = '\'ama\''
            expect(await runShellCommand({ shellCommandToRun, options: `${searchPhrase} ${filesToSearch[0]}` })).to.equal('this file is amazing\n')
            searchPhrase = '\'potato here\''
            expect(await runShellCommand({ shellCommandToRun, options: `${searchPhrase} ${filesToSearch[0]}` })).to.equal('\n')
        })
        it('should fail beccause of bad commands', async () => {
            await expect(runShellCommand({ shellCommandToRun: 'echozzz' })).to.eventually.rejectedWith(errorMessages.commandExecutionError)
            await expect(runShellCommand({ shellCommandToRun: 'echo222' })).to.eventually.rejectedWith(errorMessages.commandExecutionError)
            await expect(runShellCommand({ shellCommandToRun: 'grep', options: 'sfsf sdfsdfs' })).to.eventually.rejectedWith(errorMessages.commandExecutionError)
        })
    })
})