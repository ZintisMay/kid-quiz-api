String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

const bodyParser = require('body-parser');
const express = require('express')
const fs = require('fs')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 8888

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.static('public'))
app.use(cors())

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

class SessionList {
    constructor() {
        this.sessionList = {}
    }
    getSession(id) {
        if (this.sessionList[id]) {
            return this.sessionList[id]
        } else {
            return false
        }
    }
    hasSession(id) {
        return this.sessionList[id] ? true : false
    }
    getListOfSessions() {
        return Object.keys(this.sessionList)
    }
    createSession(customName) {
        var newSessionName
        if (customName && !this.hasSession(customName)) {
            newSessionName = customName
        } else {
            do {
                newSessionName = createWordCombo(10)
            } while (this.sessionList[newSessionName])
        }

        console.log(`creating session: ${newSessionName}`)

        this.sessionList[newSessionName] = {
            id: newSessionName,
            questions: [],
        }
        return newSessionName
    }
    addQuestionToSession(id, question) {
        this.sessionList[id].questions.push(question)
    }
}

function QuestionBuilder(prompt, imageUrl, correctThenWrongAnswersArray) {
    return {
        prompt: prompt,
        image: imageUrl,
        answers: correctThenWrongAnswersArray,
    }
}

let sessionList = new SessionList()

let sessionId = sessionList.createSession()

sessionList.addQuestionToSession(sessionId, QuestionBuilder("How many apples?", "", ['1', 'banana', 'kiwi', 'grape']))

// API routes

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.get('/createSession', (req, res) => {
    res.send(sessionList.createSession())
})

app.get('/getListOfSessions', (req, res) => {
    res.json(sessionList.getListOfSessions())
})

app.post('/addQuestions/:id', (req, res) => {
    console.log(req.body)
})

//Check for bodyparser
app.post('/testPost', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

app.get('/getSession/:id', (req, res) => {
    res.json(sessionList.getSession(req.params.id))
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



function readJson(path) {
    fs.readFileSync(require.resolve(path), (err, data) => {
        if (err)
            console.log(err)
        else
            return JSON.parse(data)

    })
}

function rand(lo, hi) {
    return Math.floor((Math.random() * (hi - lo))) + lo
}