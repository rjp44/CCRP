const config = {
  "production": {
    "sheet": "<YOUR PRODUCTION SHEET ID>"
  },
  "development": {
    "sheet": "<YOUR DEVELOPMENT/TEST SHEET ID>"
  },
  "all": {
    "credentials": "credentials/credentials.json"
  }
};

module.exports = { ...config['all'], ...config[process.env.NODE_ENV || 'development'] };
