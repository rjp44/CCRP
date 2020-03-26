
// BEFORE RUNNING:
// ---------------
// 1. If not already done, enable the Google Sheets API
//    and check the quota for your project at
//    https://console.developers.google.com/apis/api/sheets
// 2. Install the Node.js client library by running
//    `npm install googleapis --save`

const {google} = require('googleapis');
const sheets = google.sheets('v4');

async function main () {
  const authClient = await authorize();
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: '1ga7x21vsEgQeMLG9szOQbd5s1QKD0-ShDerKt6IFibs',  // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    range: 'Requests!A1:E1',  // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: 'RAW',  // TODO: Update placeholder value.

    // How the input data should be inserted.
    insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.

    resource: {
      // TODO: Add desired properties to the request body.
    },

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.values.append(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}
main();

async function authorize() {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  'https://www.googleapis.com/auth/drive'
  'https://www.googleapis.com/auth/drive.file'
  'https://www.googleapis.com/auth/spreadsheets'
  let authClient = null;

  if (authClient == null) {
    throw Error('authentication failed');
  }

  return authClient;
}