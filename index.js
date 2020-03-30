// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

const config = require('./config.js');

var bodyParser = require('body-parser');

const { Sheet } = require('google-apis.js')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies



var sheet = new Sheet(config.sheet);

sheet.getData();

// routes will go here

// ====================================
// POST PARAMETERS ====================
// ====================================

// POST http://localhost:8080/
// parameters sent with
app.post('/order-request', function(req, res) {
    const jsonData = req.body

    const answers = jsonData.twilio.collected_data.item_details.answers;  //Get the answers object from the incoming request object

    const objectKeys = Object.keys(answers).map(key => (key))           //Get a list of all keys within "answers" object

    const csvFormat = objectKeys.map(key => {
    return `"${answers[key].answer}"`                                 //Cycle through map and create the csv format
    })


    res.send(csvFormat.toString());
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
