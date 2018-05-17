const express = require('express');
const studentResponses = require('../controllers/studentResponsesController')
const {google} = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
  process.env.API_KEY,
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
        if (files.length) {
            const filteredFiles = files.filter(file => {
              if (file.mimeType === 'application/vnd.google-apps.spreadsheet'){
                return file;
              }
            })
            const displayFiles = filteredFiles.map((file) => {
                return {name: file.name, id: file.id};
            });
          res.render("confirmation", {files: displayFiles})
        } else {
            console.log('No files found.');
        }
    });
  }
})

router.post('/sheet', function(req, res, next){
  const id = req.body.id;
  const sheets = google.sheets({version: 'v4', oAuth2Client});
  console.log("sheets object created");
  console.log(id)
  // const spreadsheetMetaData = {spreadsheetId: id, range: 'Form Responses 1'};
  // console.log("got metadata: ", spreadsheetMetaData)
  // console.log(oAuth2Client);
  sheets.spreadsheets.get({spreadsheetId: id, key: process.env.API_KEY}, (err, {data}) => {
    if (err) {console.log("ERROR: ",err)}
    const range = data.sheets[0].properties.title;
    console.log(range)
    sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: range,
      key: process.env.API_KEY
    }, (err, { data }) => {
      console.log("in the callback")
      if (err) return console.log("ERROR: ", err)

      const headers = data.values.shift();
      let dataArr = [];
      data.values.forEach(rowData => {
        let rowObj = {};
        rowData.forEach((cellData, index) => {
          rowObj[headers[index]] = cellData;
        })
        dataArr.push(rowObj)
      })
      studentResponses.post({
        teacher: "MR. M",
        problemName: "Easy math questions",
        responses: dataArr
      })
      .then(resp => {
        res.json(resp)
      })
      .catch(err => {
        res.json(err)
      })
    })
  })



  // sheets.spreadsheets.values.get(spreadsheetMetaData, (err, {data}) => {
  //   console.log("FUnctiuon running");
  //   if (err) {
  //     console.log('The API returned an error: ' + err);
  //     return res.json({confirmation: "fail", error: err})
  //   }
  //   console.log("hello")
  //   console.log("DATA: ", {data} )
  //   const rows = data.values;
  //   if (rows.length) {
  //     const output = rows.map((row) => {
  //       return {timestamp: row[0], name: row[1], response: row[2]};
  //     });
  //     console.log(output)
  //     res.json({confirmation: 'success', output: output})
  //   } else {
  //     console.log('No data found.');
  //   }
  // })
  // .catch(err => {
  //   console.log(err)
  //   res.json({confirmation: "fail", error: err})
  // })
})




module.exports = router;
