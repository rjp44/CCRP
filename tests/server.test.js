var test = require('tape');
var request = require('supertest');

const config = require('../config.js');

app = require('../index.js');

const requests = [
  { name: 'Rob PiVirgil', age: '56', address: 'North Ham, London', need: 'Toilet Rolls' },
  { name: 'Rob Pickering', age: '57', address: 'South Ham, London', need: 'Toilet Bowls' },
  { name: 'Virgil Names', age: '58', address: 'East Ham, London', need: 'Toilet Water' },
  { name: 'Pickard Vision', age: '59', address: 'West Ham, London', need: 'Toilet Lids' },
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
