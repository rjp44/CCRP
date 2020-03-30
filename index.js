// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

const config = require('./config.js');

var bodyParser = require('body-parser');

const { Sheet } = require('./lib/googleSheet.js')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var sheet = new Sheet(config.sheet);

// We do this here to generate an early user prompt if we need to authenticate
sheet.getData('A1:A2').then(result => console.info('Attached to sheet: ', config.sheet))

// routes will go here

// ====================================
// POST PARAMETERS ====================
// ====================================

// POST http://localhost:8080/
// parameters sent with
app.post('/order-request', function (req, res, next) {
  try {
    const jsonData = req.body

    const answers = jsonData.twilio.collected_data.item_details.answers; //Get the answers object from the incoming request object
    const objectKeys = Object.keys(answers)
      .map(key => (key)) //Get a list of all keys within "answers" object

    // Add an array of strings which represents one row, return result or let express sort out error.
    sheet.appendData('Requests!A:Z', [objectKeys.map(key => `${answers[key].answer}`)])
      .then(result => {
        console.log('result: ', result)
        res.setHeader('Content-Type', 'application/json');
        res.status(200)
        .send(JSON.stringify(result))
      });
  } catch (err) {
    console.log('Error: ', err)
    next(err);
  };
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log('Press Ctrl+C to quit.');
  });
}

exports = module.exports = app;
