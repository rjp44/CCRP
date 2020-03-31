const config = {
  "production": {
    "sheet": "<YOUR PRODUCTION SHEET ID>"
  },
  "development": {
    "sheet": "<YOUR DEVELOPMENT/TEST SHEET ID>"
  },
  "all": {
    "credentials": "credentials/credentials.json",
    "tokenPath": "credentials/tokenFile"
  }
};

module.exports = config;
