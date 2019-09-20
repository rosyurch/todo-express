const fs = require('fs');

function writeToJsonFile(name, data) {
    fs.writeFile(name, JSON.stringify(data), err => {
        if (err) console.error(err);
    });
}

module.exports = writeToJsonFile;
