const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
chai.use(chaiAsPromised)
const expect = chai.expect

const grepCommand = require('../../../api/helpers/commands/grep').grep
const errorMessages = require('../../../api/helpers/commands/grep').errorMessages

var assert = require('assert')
describe('Grep Command', function () {
    describe('Input validation tests', function () {
        it('should reject because of invalid input', async () => {
            await expect(grepCommand({})).to.eventually.rejectedWith(errorMessages.missingFilesToSearch)
            await expect(grepCommand({ test: 'test' })).to.eventually.rejectedWith(errorMessages.missingFilesToSearch)
            await expect(grepCommand('wrong input')).to.eventually.rejectedWith(errorMessages.missingFilesToSearch)
        })
        it('should reject because of invalid input', async () => {
            await expect(grepCommand({ filesToSearch: ['t'] })).to.eventually.rejectedWith(errorMessages.missingSearchPhrase)
            await expect(grepCommand({ filesToSearch: ['d'], searchPhrase: undefined })).to.eventually.rejectedWith(errorMessages.missingSearchPhrase)
        })
        it('should reject because of invalid input', async () => {
            await expect(grepCommand({ filesToSearch: ['d'], searchPhrase: 's' })).to.eventually.rejectedWith(errorMessages.missingFilesDirectory)
            await expect(grepCommand({ filesToSearch: ['d'], searchPhrase: 's', filesDirectory: undefined })).to.eventually.rejectedWith(errorMessages.missingFilesDirectory)
        })
        it('should reject because of invalid input', async () => {
            await expect(grepCommand({ filesToSearch: ['d'], filesDirectory: 's', searchPhrase: null })).to.eventually.rejectedWith(errorMessages.incorrectSearchPhrase)
            await expect(grepCommand({ filesToSearch: ['d'], filesDirectory: 's', searchPhrase: false })).to.eventually.rejectedWith(errorMessages.incorrectSearchPhrase)
            await expect(grepCommand({ filesToSearch: ['d'], filesDirectory: 's', searchPhrase: true })).to.eventually.rejectedWith(errorMessages.incorrectSearchPhrase)
        })
        it('should reject because of invalid files input', async () => {
            await expect(grepCommand({ filesToSearch: ['d'], filesDirectory: 's', searchPhrase: 'test' })).to.eventually.rejectedWith(errorMessages.missingFile(['d']))
            await expect(grepCommand({ filesToSearch: ['text.txt'], filesDirectory: 's', searchPhrase: 'test' })).to.eventually.rejectedWith(errorMessages.missingFile(['text.txt']))
            await expect(grepCommand({ filesToSearch: ['d', 's'], filesDirectory: 's', searchPhrase: 'test' })).to.eventually.rejectedWith(errorMessages.missingFile(['d', 's']))
        })
    })
    describe('Penetration Tests', function () {
        it('should ignore command injections', async () => {
            let commandInjections = ['pwd', 'a; pwd', 'a && pwd', 'a ;&& pwd', 'a & pwd', 'a ;& pwd', 'a | pwd', 'pwd || pwd', 'pwd$%^&*(@,./; pwd']
            let searchPhrase = 'ama; pwd', filesDirectory = `${__dirname}/../../sampleFilesToTestCommandsOn`, filesToSearch = ['file1.txt']
            commandInjections.forEach(async (searchPhrase) => expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('\n'))
        })
    })
    describe('Basic tests', function () {
        it('should run grep on files', async () => {
            let searchPhrase = 'ama', filesDirectory = `${__dirname}/../../sampleFilesToTestCommandsOn`, filesToSearch = ['file1.txt']
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('this file is amazing\n')
            searchPhrase = 'amazi'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('this file is amazing\n')
            searchPhrase = 'amazing'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('this file is amazing\n')
            searchPhrase = 'testing'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('testing with file\n')
        })
        it('should return empty results', async () => {
            let searchPhrase = 'am32a', filesDirectory = `${__dirname}/../../sampleFilesToTestCommandsOn`, filesToSearch = ['file1.txt']
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('\n')
            searchPhrase = 'amaz1i'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('\n')
            searchPhrase = 'amazi234ng'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('\n')
        })
        it('should run grep on multiple files', async () => {
            let searchPhrase = 'ama', filesDirectory = `${__dirname}/../../sampleFilesToTestCommandsOn`, filesToSearch = ['file1.txt', 'file2.txt', 'file3.txt', 'emptyFile.txt']
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('file1.txt:this file is amazing\n')
            searchPhrase = 'use'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('file2.txt:dont use it\n')
            searchPhrase = 'testing'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch }))
                .to.equal('file1.txt:testing with file\nfile2.txt:testing with file\nfile3.txt:testing with file\n')
        })
        it('should run grep on all files', async () => {
            let searchPhrase = 'ama', filesDirectory = `${__dirname}/../../sampleFilesToTestCommandsOn`, filesToSearch = []
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('file1.txt:this file is amazing\n')
            searchPhrase = 'use'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch })).to.equal('file2.txt:dont use it\n')
            searchPhrase = 'testing'
            expect(await grepCommand({ searchPhrase, filesDirectory, filesToSearch }))
                .to.equal('file1.txt:testing with file\nfile3.txt:testing with file\nfile2.txt:testing with file\n')
        })
    })
})