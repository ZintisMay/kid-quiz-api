//Utility functions
function readJson (path) {
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

module.exports = {
	rand,
	readJson
}
