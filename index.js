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

// We do this here to generate an early user prompt if we need to authenticate, and
//  bomb on fatal errors before server starts
sheet.getData('A1:A2')
  .then(result => console.info('Attached to sheet: ', config.sheet))
  .catch(err => {
    console.log(err);
    process.exit(0);
  });

// routes will go here

// ====================================
// POST PARAMETERS ====================
// ====================================

// POST http://localhost:8080/
// parameters sent with
app.post('/order-request', function (req, res, next) {
  try {
    const jsonData = req.body
    console.log('hook:', jsonData);
    let needTime = jsonData.queryResult.parameters.time && new Date(jsonData.queryResult.parameters.time.replace(/\+.*/,''));
    let time = `${needTime.getHours()} ${needTime.getMinutes()}`;
    // Add an array of strings which represents one row, return result or let express sort out error.
    let output = {
      "fulfillmentMessages": [
        {
          "text": {
            "text": [
          `${jsonData.queryResult.fulfillmentText} of ${jsonData.queryResult.parameters.Fruit} at ${time}`
        ]
          }
            }
          ]
    };

    console.log('result: ', JSON.stringify(output,null,2));
    sheet.appendData('Requests!A:Z', [[process.env.CALLERNAME, jsonData.queryResult.parameters.Fruit, jsonData.queryResult.parameters.time]])
      .then(result => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200)
          .send(JSON.stringify(output))
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
