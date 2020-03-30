var test = require('tape');
var request = require('supertest');

const config = require('../config.js');

app = require('../index.js');

const requests = [
  { name: { answer: 'Rob PiVirgil' }, age: { answer: '56' }, address: { answer: 'North Ham, London' }, need: { answer: 'Toilet Rolls' } },
  { name: { answer: 'Rob Pickering' }, age: { answer: '57' }, address: { answer: 'South Ham, London' }, need: { answer: 'Toilet Bowls' } },
  { name: { answer: 'Virgil Names' }, age: { answer: '58' }, address: { answer: 'East Ham, London' }, need: { answer: 'Toilet Water' } },
  { name: { answer: 'Pickard Vision' }, age: { answer: '59' }, address: { answer: 'West Ham, London' }, need: { answer: 'Toilet Lids' } },
]

test(`Addrow`, function (t) {
  const REST = `/order-request`
  request(app)
    .post(REST)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({twilio:{collected_data:{item_details:{answers: requests[0]}}}}))
    .expect(200)
    .end((err, res) => {
      t.equal(err, null, 'no error');
      var act = res.body;
      t.equal(res.status, 200, `${res.req.method} ${res.req.path} ${act.errorMessage}`);
      t.equal(res.body.updates.updatedRows, 1, 'one row updated');
      t.equal(res.body.updates.updatedColumns, 4, 'columns updated');
      t.equal(res.body.updates.updatedCells, 4, 'cells updated');
      t.end();
    });
});
