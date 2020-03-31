const fs = require( 'fs' )
  .promises;
const readline = require( 'readline' );
const { google } = require( 'googleapis' );

// If modifying these scopes, delete token.json.
const SCOPES = [ 'https://www.googleapis.com/auth/spreadsheets' ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const config = require( '../config.js' );
/**
 * Handle interactions with Google Sheets
 */
class Sheet {

  /**
   * Open a new sheet
   *
   * @method constructor
   * @param  {string}    sheetId Google sheet Id (can be inspected from Doc URL)
   */
  constructor( sheetId ) {
    this.sheet = sheetId;
  }

  async doAuth() {

    // Load client secrets from a local file
    const content = await fs.readFile( config.credentials, { encoding: 'utf8' } );
    return new Promise( ( resolve, reject ) => authorize( JSON.parse( content ), auth => {
      this.auth = auth;
      this.sheets = google.sheets( { version: 'v4', auth: this.auth } );
      resolve( this.auth )
    } ) );

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize( credentials, callback ) {
      if(!credentials.installed)
        throw new Error ('Invalid credentials.json (wrong type, select "desktop app"?)');
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[ 0 ] );

      // Check if we have previously stored a token.
      fs.readFile( config.tokenPath )
        .then( token => {
          oAuth2Client.setCredentials( JSON.parse( token ) );
          callback( oAuth2Client );
        } )
        .catch( err => getNewToken( oAuth2Client, callback ) );
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken( oAuth2Client, callback ) {
      const authUrl = oAuth2Client.generateAuthUrl( {
        access_type: 'offline',
        scope: SCOPES,
      } );
      console.log( 'Authorize this app by visiting this url:', authUrl );
      const rl = readline.createInterface( {
        input: process.stdin,
        output: process.stdout,
      } );
      rl.question( 'Enter the code from that page here: ', ( code ) => {
        rl.close();
        oAuth2Client.getToken( code, ( err, token ) => {
          if ( err ) return console.error( 'Error while trying to retrieve access token', err );
          oAuth2Client.setCredentials( token );
          // Store the token to disk for later program executions
          fs.writeFile( config.tokenPath, JSON.stringify( token ) )
            .catch( err => console.error( err ) )
            .then( () => {
              console.log( 'Token stored to', config.tokenPath )
              callback( oAuth2Client )
            } );
        } );
      } );
    }

  }

  /**
   * Get Data from a sheet
   *
   * @method getData
   * @param  {String}  range Range required in Google sheets format
   * @return {Promise}                 Reeolves to row data for range, or throws error
   */
  async getData( range ) {
    if ( !this.sheets )
      await this.doAuth();
    return ( await this.sheets.spreadsheets.values.get( {
        spreadsheetId: this.sheet,
        range,
      } ) )
      .data
  }

  /**
   * Append data to a sheet
   *
   * @method appendData
   * @param  {String}        range Range to be appended to in Google sheets format
   * @param  {(string[])[]}  data  Array of rows to append
   * @return {Promise}        Result of insert, throws an error on failure
   */
  async appendData( range, data ) {
    if ( !this.sheets )
      await this.doAuth();
    let resource = {
      values: data,
    };
    return ( await this.sheets.spreadsheets.values.append( {
        spreadsheetId: this.sheet,
        range,
        valueInputOption: 'RAW',
        resource,
      } ) )
      .data
  }
}

module.exports = exports = { Sheet };
