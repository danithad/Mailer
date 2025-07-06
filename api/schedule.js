const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

function loadCredentials() {
  // Check if we have service account key (recommended for Vercel)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_KEY format');
    }
  }
  
  // Fallback to OAuth2 credentials
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing Google credentials. Please set GOOGLE_SERVICE_ACCOUNT_KEY or OAuth2 credentials.');
  }
  
  return {
    installed: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      project_id: process.env.GOOGLE_PROJECT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uris: (process.env.GOOGLE_REDIRECT_URIS || 'http://localhost').split(',')
    }
  };
}

function authorize(credentials, callback) {
  try {
    // If it's a service account key (has private_key)
    if (credentials.private_key) {
      const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: SCOPES
      });
      callback(auth);
    } else {
      // OAuth2 client (for development/testing)
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      
      // For now, we'll need a valid token or use service account
      callback(oAuth2Client);
    }
  } catch (error) {
    callback(null, error);
  }
}

function createMeetEvent(auth, email, date, time, res) {
  if (!auth) {
    res.status(500).json({ error: 'Authentication failed' });
    return;
  }

  const calendar = google.calendar({ version: 'v3', auth });
  const startDateTime = new Date(`${date}T${time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min

  const event = {
    summary: 'Scheduled Google Meet',
    description: 'Scheduled via web UI',
    start: { dateTime: startDateTime.toISOString(), timeZone: 'UTC' },
    end: { dateTime: endDateTime.toISOString(), timeZone: 'UTC' },
    attendees: [{ email }],
    conferenceData: { createRequest: { requestId: 'meet-' + Date.now() } },
  };

  calendar.events.insert(
    {
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    },
    (err, eventRes) => {
      if (err) {
        console.error('Calendar API Error:', err);
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({
          eventLink: eventRes.data.htmlLink,
          meetLink: eventRes.data.conferenceData.entryPoints.find(e => e.entryPointType === 'video').uri,
        });
      }
    }
  );
}

module.exports = (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON' });
      return;
    }
  }
  
  const { email, date, time } = body;
  if (!email || !date || !time) {
    res.status(400).json({ error: 'Missing required fields: email, date, time' });
    return;
  }
  
  try {
    const credentials = loadCredentials();
    authorize(credentials, (auth, error) => {
      if (error) {
        console.error('Authorization Error:', error);
        res.status(500).json({ error: 'Authentication failed: ' + error.message });
        return;
      }
      createMeetEvent(auth, email, date, time, res);
    });
  } catch (error) {
    console.error('Setup Error:', error);
    res.status(500).json({ error: error.message });
  }
};
