# Google Sheets Import

## Local Development Procedure
Before cloning this repository there are a few preliminary steps you will need
to take to allow google to access users' drives.
### Setting up your Google Cloud Platform account
1. Navigate to [https://console.cloud.google.com] and login with your google account
2. Create a new project
3. On the left navbar select credentials
4. Select "OAuth consent screen" and set the information you want displayed to
end users.
5. Next, select credentials -> create credentials -> OAuth client ID
6. For application type select "Other"
7. google will provide you with a client ID and a client secret -- save these somewhere you can easily find them -- but keep them safe.
8. Navigate back to the credentials screen, select "create credentials" again and this time select "API key"

Now you are ready to clone the project.
### Installing the project
1. clone this repository to your local machine
2. `$ npm install`
3. Setup a local Mongodb database
4. In the root directory create a .env file and set the following variables
  * CLIENT_ID='yourClientIdFromGoogle'
  * CLIENT_SECRET='yourClientSecretFromGoogle'
  * API_KEY='youAPIkeyFromGoogle'
  * MONGO_URI='mongodb://localhost/<your db name>
