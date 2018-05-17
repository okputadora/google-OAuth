const express = require('express');
const {google} = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // generate a url that asks permissions for Google Drive and Google spreadsheets scopes
  const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets'
  ];

  const url = oAuth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    // If you only need one scope you can pass it as a string
    scope: scopes
  });

  res.redirect(url);
});

router.get('/confirmation', function(req, res, next) {

  const code = req.query.code
  oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      listFiles(oAuth2Client);
  });
  function listFiles(auth) {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list({
        pageSize: 50,
        fields: 'nextPageToken, files(id, name, mimeType)',
    }, (err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = data.files;
        console.log("FILES: ", files);
        console.log("DATA: ", data)
        if (files.length) {
            console.log('Files:');
            const filteredFiles = files.filter(file => {
              if (file.mimeType === 'application/vnd.google-apps.spreadsheet'){
                return file;
              }
            })
            const displayFiles = filteredFiles.map((file) => {
                return `${file.name} (${file.id}) (${file.mimeType})`;
            });
          res.render("confirmation", {files: displayFiles})
        } else {
            console.log('No files found.');
        }
    });
  }

})



module.exports = router;
