const runShellCommand = require('../shellCommandInterface').runShellCommand
const escapeString = require('js-string-escape')
const fs = require('fs-extra')

const errorMessages = {
    missingSearchPhrase: 'missing searchPhrase',
    missingFilesToSearch: 'missing filesToSearch',
    missingFilesDirectory: 'missing filesDirectory',
    incorrectSearchPhrase: 'searchPhrase needs to be a string',
    missingFile: (fileName) => `no files found with the name '${fileName.toString()}'`,

}
module.exports.errorMessages = errorMessages

async function validateGrepCommandInput({ searchPhrase, filesToSearch, filesDirectory }) {
    return new Promise(async (resolve, reject) => {
        if (filesToSearch === undefined) { resolve({ valid: false, error: errorMessages.missingFilesToSearch }) }
        else if (searchPhrase === undefined) { resolve({ valid: false, error: errorMessages.missingSearchPhrase }) }
        else if (filesDirectory === undefined) { resolve({ valid: false, error: errorMessages.missingFilesDirectory }) }
        else if (typeof searchPhrase !== "string") { resolve({ valid: false, error: errorMessages.incorrectSearchPhrase }) }
        else {
            let filesCheck = await validateFilesToSearch({ filesDirectory, filesToSearch })
            if (filesCheck.valid == false) { resolve(filesCheck) }
            else { resolve({ valid: true }) }
        }
    })
}

function validateFilesToSearch({ filesToSearch, filesDirectory }) {
    return new Promise(async (resolve, reject) => {
        let checkFilesExsist = filesToSearch.map((fileName) => fs.pathExists(`${filesDirectory}/${fileName}`))
        let fileCheckResults = await Promise.all(checkFilesExsist)
        let missingFilesIndexs = fileCheckResults.reduce((retrunArray, checkResult, index) => {
            if (checkResult == false) { retrunArray.push(index) }
            return retrunArray
        }, [])
        if (missingFilesIndexs.length > 0) {
            let missingFiles = missingFilesIndexs.map((missingIndex) => filesToSearch[missingIndex])
            resolve({ valid: false, error: errorMessages.missingFile(missingFiles) })
        } else {
            resolve({ valid: true })
        }
    })
}

function removeDirectoryPathFromOutput({ commandOutput, filesDirectory }) {
    return commandOutput.replace(new RegExp(`${filesDirectory}/`, 'g'), '')
}

module.exports.grep = ({ searchPhrase, filesToSearch, filesDirectory }) => {
    return new Promise(async (resolve, reject) => {
        let areTheInputParametersValid = await validateGrepCommandInput({ searchPhrase, filesToSearch, filesDirectory })
        if (areTheInputParametersValid.valid == false) { reject(areTheInputParametersValid.error) }
        else {
            try {
                let searchAllFilesInDirectory = (filesToSearch.length === 0)
                let options = searchAllFilesInDirectory ?
                    `'${escapeString(searchPhrase)}' -R ${filesDirectory}` :
                    `'${escapeString(searchPhrase)}' ${filesToSearch.reduce((files, file) => `${files} ${filesDirectory}/${file}`, '')}`
                let commandOutput = await runShellCommand({
                    shellCommandToRun: 'grep',
                    options
                })
                if (filesToSearch.length == 1) { resolve(commandOutput) }
                else {
                    resolve(removeDirectoryPathFromOutput({ commandOutput, filesDirectory }))
                }
            } catch (error) { reject(error) }
        }

    })
}