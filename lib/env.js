const dotenv = require('dotenv');

function processEnvironment() {
    if (process.env.DEPLOYMENT !== 'infrastructure') {
        dotenv.config();
    }
}

function listenLocal(app) {
    if (process.env.DEPLOYMENT !== 'infrastructure') {
    app.listen(process.env.APPPORT, () => {
        console.log(`Example app listening on port ${process.env.APPPORT}`)
      });
    }
}

function getDBSettings() {
    if (process.env.DEPLOYMENT !== 'infrastructure') {
        return {
            region: "us-east-1",
            // credentials: {
            //     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            // }
        };
    }
    return {};
}

module.exports = {
    processEnvironment,
    listenLocal,
    getDBSettings
};