const express = require('express');
const {google} = require('googleapis');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // generate a url that asks permissions for Google+ and Google Calendar scopes
  const scopes = [
    'https://www.googleapis.com/auth/drive',
    // 'https://www.googleapis.com/auth/sheets'
  ];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes
  });
  console.log(url)
  res.redirect(url);
});

router.get('/confirmation', function(req, res, next) {
  res.render('confirmation')
})



module.exports = router;
