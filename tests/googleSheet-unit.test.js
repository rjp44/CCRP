var test = require('tape');
var request = require('supertest');

const config = require('../config.js');

const fs = require('fs');

const { Sheet } = require('../lib/googleSheet.js')
var sheet = new Sheet(config.sheet);

const FirstSheet = { range: 'Welcome!A1:C1', majorDimension: 'ROWS', values: [ [ 'Title',
      'Image', 'About' ]] }


test(`Existing rows`, function (t) {
  sheet.getData('Welcome!A1:C1').then( result => {
    t.deepEqual(result, FirstSheet, 'expecting this');
    t.end();
  })
});
