// Google Calendar invite sender with Google Meet link, scheduled daily at 10:30pm
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const cron = require('node-cron');

// If modifying these SCOPES, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Placeholder recipient
const RECIPIENT_EMAIL = 'hiteshberg907@gmail.com';

// Load client secrets from a local file.
function loadCredentials() {
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token.
  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8')));
    callback(oAuth2Client);
  } else {
    getAccessToken(oAuth2Client, callback);
  }
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('Authorize this app by visiting this url:', authUrl);
  const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
  readline.question('Enter the code from that page here: ', (code) => {
    readline.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
      callback(oAuth2Client);
    });
  });
}

function createMeetEvent(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const now = new Date();
  const eventDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 22, 30, 0); // Next day 10:30pm
  const endDate = new Date(eventDate.getTime() + 30 * 60000); // 30 min meeting
  const event = {
    summary: 'Daily Google Meet',
    description: 'This is your daily scheduled Google Meet.',
    start: { dateTime: eventDate.toISOString(), timeZone: 'UTC' },
    end: { dateTime: endDate.toISOString(), timeZone: 'UTC' },
    attendees: [{ email: RECIPIENT_EMAIL }],
    conferenceData: { createRequest: { requestId: 'meet-' + Date.now() } },
  };
  calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
  }, (err, res) => {
    if (err) return console.error('Error creating event:', err);
    console.log('Event created: %s', res.data.htmlLink);
    if (res.data.conferenceData && res.data.conferenceData.entryPoints) {
      const meet = res.data.conferenceData.entryPoints.find(e => e.entryPointType === 'video');
      if (meet) console.log('Google Meet link:', meet.uri);
    }
  });
}

// Schedule the job to run every day at 10:30pm
cron.schedule('30 22 * * *', () => {
  console.log('Running scheduled job to create Google Meet event...');
  const credentials = loadCredentials();
  authorize(credentials, createMeetEvent);
});

// For manual run (uncomment to test immediately):
const credentials = loadCredentials();
authorize(credentials, createMeetEvent);

/*
Instructions:
1. Go to Google Cloud Console, enable Calendar API, and download credentials.json to SendMail/.
2. On first run, follow the link printed in the console to authorize and paste the code.
3. The script will create a calendar event with a Google Meet link every day at 10:30pm UTC (adjust timeZone as needed).
4. The recipient will get an email invite and can accept/decline/reschedule.
*/
