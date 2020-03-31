var test = require( 'tape' );
var request = require( 'supertest' );

const config = require( '../config.js' );

const fs = require( 'fs' );

const { Sheet } = require( '../lib/googleSheet.js' )
var sheet = new Sheet( config.sheet );

const FirstSheet = {
  range: 'Welcome!A1:C1',
  majorDimension: 'ROWS',
  values: [
    [ 'Title',
      'Image', 'About'
    ]
  ]
}

test( `Existing rows`, function ( t ) {
  sheet.getData( 'Welcome!A1:C1' )
    .then( result => {
      t.deepEqual( result, FirstSheet, 'expecting this' );
      t.end();
    } );
} );

test( `Credentials in environment`, function ( t ) {
  t.ok( fs.readFileSync( config.credentials, 'utf8' ), 'credentials succeeds' );
  fs.renameSync( config.credentials, config.credentials + '.SAV' );
  t.throws( () => fs.readFileSync( config.credentials, 'utf8' ), /.*no such file or directory.*/, 'credentials read fails' );
  var badSheet = new Sheet( config.sheet );
  badSheet.getData( 'Welcome!A1:C1' )
    .then( res => t.fail( 'should fail with no credentials' ) )
    .catch( err => t.pass( 'Got credential error' ) );
  t.ok( process.env.CREDENTIALSJSON = fs.readFileSync( config.credentials + '.SAV', 'utf8' ), 'old file contents' );
  t.ok( process.env.CREDENTIALSJSON.length > 0, 'non empty credentials' );
  var goodSheet = new Sheet( config.sheet );
  goodSheet.getData( 'Welcome!A1:C1' )
    .then( result => {
      t.deepEqual( result, FirstSheet, 'getData with credentials in env' );
    } );
  fs.renameSync( config.credentials + '.SAV', config.credentials );
  t.ok( fs.readFileSync( config.credentials, 'utf8' ), 'credentials replaced' );
  t.end();
} );

const localConfig = 'config.local.js';
const path = process.cwd();

if ( fs.existsSync( localConfig ) ) {
  test( `Using config.local.js to synthesise environment variables`, function ( t ) {
    fs.renameSync( localConfig, localConfig + '.SAV' );
    t.throws( () => fs.readFileSync( localConfig, 'utf8' ), /.*no such file or directory.*/, 'config read fails' );
    delete require.cache[ `${path}/config.js` ];
    delete require.cache[ `${path}/${localConfig}` ];
    let badConfig = require( '../config.js' );
    t.notEqual( config.sheet, badConfig.sheet, 'new config has emtpy sheet' );
    process.env.DEVELOPMENT_SHEET = process.env.PRODUCTION_SHEET = config.sheet;
    delete require.cache[ `${path}/config.js` ];
    delete require.cache[ `${path}/${localConfig}` ];
    let goodConfig = require( '../config.js' );
    t.equal( config.sheet, goodConfig.sheet, 'sheet config from environment OK' );
    fs.renameSync( localConfig + '.SAV', localConfig );
    t.ok( fs.readFileSync( localConfig, 'utf8' ), 'credentials replaced' );
    t.end();
  } );
}
