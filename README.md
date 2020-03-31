# Using the Google API to post to a spreadsheet

1. ```npm install```
2. Follow instructions [here][a7a2d4a8] to grab a ```credentials.json``` whilst logged in as the owner of the sheet you want to modify, put this in the ```credentials``` directory. Note that you should download a "desktop client" credential file, not the more obvious "web server" credential!
*In some environments (e.g. Heroku) placing private files in the application tree is hard, for this reason the app will also preferentially read the credentials file contents from the* ```CREDENTIALSJSON``` *environment variable*
3. Copy ```config.local-example.js``` in the top level directory to ```config.local.js``` and edit in the spreadsheet ID of the spreadsheet you want to append to (development and production if different, development is used for test)
*Or add environment variables* ```PRODUCTION_SHEET``` *and* ```DEVELOPMENT_SHEET```
4. The first time the application is run (e.g. by ```node index.js```), it will prompt for authorisation:
```
Authorize this app by visiting this url: https://accounts.google.com/o/oauth2/v2/auth?access_type=.......
Enter the code from that page here:```

Follow the prompts by pasting the URL into a web browser that is logged into the sheet you want to be able to modify.

If this is done correctly then output like the below will appear:

```
Token stored to credentials/tokenFile
Attached to sheet:  1eRi_fkjoiweueyrtlaskdjfho3498ghsZCU
```
5. ```npm install -g tap```
6. ```npm run test``` to verify (modifies development sheet)

  [a7a2d4a8]: https://developers.google.com/sheets/api/quickstart/nodejs "Credentials file"

```node index.js``` to run server
