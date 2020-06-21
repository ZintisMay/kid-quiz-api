const {rand, readJson} = require('./utils')

var wordList = require('./childWords.js')
// console.log(wordList)

var wordSet = {}
for (var x of wordList) {
    if (x.length > 2) {
        wordSet[x.capitalize()] = true
    }
}
var wordArr = []
for (var w in wordSet) {
    wordArr.push(w)
}

wordArr.sort()


function createWordCombo(length) {
    var wordCombo = ""
    while (wordCombo.length < length) {

        wordCombo += wordArr[rand(0, wordArr.length)]
    }

    return wordCombo
}

module.exports = createWordCombo