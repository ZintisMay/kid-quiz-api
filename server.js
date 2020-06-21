String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

//Utility function
const createWordCombo = require('./createWordCombo.js');

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


//Session Object to store activity on server
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
    getSession(id){
    	return this.sessionList[id]
    }
    addStudentToSession(id,studentId){
    	let session = this.getSession(id)
    	if(session && session.students){
    		session.students[studentId] = true
    	}
    	return session
    }
    getSessionForStudent(id,studentId){
    	let session = this.getSession(id)
    	return session && session.students && session.students[studentId] ? session : {}
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
            teacherId:0,
            questions: [],
            students:{

            }
        }
        return newSessionName
    }
    addQuestionToSession(id, question) {
    	question.correctAnswer = question.answers[0]
        this.sessionList[id].questions.push(question)
    }
}

function QuestionBuilder(prompt, imageUrl, answersArray) {
    return {
        prompt: prompt,
        image: imageUrl,
        answers: answersArray,
        correctAnswer: answersArray[0]
    }
}

let sessionList = new SessionList()

let sessionId = sessionList.createSession("zintis")

sessionList.addQuestionToSession(sessionId, QuestionBuilder("What is 5 + 5?", "", ["10", "15", "5", "55"]))
sessionList.addQuestionToSession(sessionId, QuestionBuilder("How many noses does a slug have?", "", ["4","1","2","3"]))
sessionList.addQuestionToSession(sessionId, QuestionBuilder("What is the fastest land animal?", "", ["Cheetah","Lion","Dog","Wolf"]))
sessionList.addQuestionToSession(sessionId, QuestionBuilder("What is the sweet food made by bees?", "", ["Honey","Chocolate","Marmalade","Caramel"]))

// API routes

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/student', (req, res) => res.sendFile(__dirname + '/student.html'))


app.get('/createSession', (req, res) => {
    res.send(sessionList.createSession())
})


app.get('/getListOfSessions', (req, res) => {
    res.json(sessionList.getListOfSessions())
})

app.get('/getSession/:id', (req, res) => {
    res.json(sessionList.getSession(req.params.id))
})

app.get('/getSession/:id/:studentId', (req, res) => {
	let session = sessionList.getSessionForStudent(req.params.id, req.params.studentId)
	res.json(session)
})

app.get('/addStudentToSession/:id/:studentId', (req, res) => {
	let session = sessionList.addStudentToSession(req.params.id, req.params.studentId)
	res.json(session)
})

app.post('/addQuestionToSession/:id', (req, res) => {
    console.log(req.params.id)
    console.log(req.body)
    sessionList.addQuestionToSession(req.params.id, req.body)
    res.json(sessionList.getSession(req.params.id))
})

//Check for bodyparser
app.post('/testPost', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// //Utility functions
// function readJson(path) {
//     fs.readFileSync(require.resolve(path), (err, data) => {
//         if (err)
//             console.log(err)
//         else
//             return JSON.parse(data)

//     })
// }

// function rand(lo, hi) {
//     return Math.floor((Math.random() * (hi - lo))) + lo
// }