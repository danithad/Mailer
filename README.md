# Google Calendar Meet Invite Sender

A full-stack web application that allows users to send Google Calendar invites with Google Meet links via email. Built with React frontend and Node.js backend, deployed on Vercel.

## Features

- 🗓️ **Google Calendar Integration**: Create calendar events with Google Meet links
- 📧 **Email Invitations**: Send calendar invites directly to recipients
- 🎨 **Modern UI**: Clean, responsive React interface
- ☁️ **Cloud Deployment**: Fully deployed on Vercel
- 🔐 **Secure**: Uses Google Service Account for authentication

## Tech Stack

- **Frontend**: React.js, Create React App
- **Backend**: Node.js, Express.js
- **Google APIs**: Google Calendar API, Google Meet API
- **Deployment**: Vercel
- **Authentication**: Google Service Account

## Project Structure

```
Mailer/
├── api/                    # Backend API (Vercel serverless functions)
│   ├── schedule.js        # Main Google Calendar integration
│   ├── server.js          # Local development server
│   ├── hello.js           # Test endpoint
│   └── test.js            # Test endpoint
├── meet-invite-ui/        # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   └── ...
│   └── package.json
├── SendMail/              # Additional email functionality
├── vercel.json            # Vercel configuration
└── README.md
```

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Git** (for version control)
3. **Google Cloud Project** with Calendar API enabled
4. **Google Service Account** with proper permissions

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Mailer
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd api
   npm install
   
   # Install frontend dependencies
   cd ../meet-invite-ui
   npm install
   ```

3. **Set up Google credentials**
   - Create a Google Cloud Project
   - Enable Google Calendar API
   - Create a Service Account
   - Download the JSON key file
   - For local development, place it as `api/token.json`

4. **Start the development servers**
   ```bash
   # Start backend (in api directory)
   cd api
   node server.js
   
   # Start frontend (in meet-invite-ui directory)
   cd meet-invite-ui
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Deployment

1. **Deploy to Vercel**
   ```bash
   # Deploy backend API
   vercel
   
   # Deploy frontend
   cd meet-invite-ui
   vercel
   ```

2. **Set environment variables in Vercel**
   - Go to your Vercel project settings
   - Add `GOOGLE_SERVICE_ACCOUNT_KEY` with your service account JSON

## API Endpoints

### POST `/api/schedule`
Creates a Google Calendar event with Meet link and sends invitation.

**Request Body:**
```json
{
  "email": "recipient@example.com",
  "date": "2024-07-05",
  "time": "15:00"
}
```

**Response:**
```json
{
  "eventLink": "https://calendar.google.com/...",
  "meetLink": "https://meet.google.com/..."
}
```

### GET `/api/hello`
Test endpoint that returns a simple message.

### GET `/api/test`
Test endpoint for API connectivity.

## Environment Variables

- `GOOGLE_SERVICE_ACCOUNT_KEY`: Your Google Service Account JSON (required for production)
- `GOOGLE_CLIENT_ID`: OAuth2 client ID (for development)
- `GOOGLE_CLIENT_SECRET`: OAuth2 client secret (for development)

## Usage

1. Open the web application
2. Enter the recipient's email address
3. Select the date and time for the meeting
4. Click "Send Invite"
5. The recipient will receive a Google Calendar invitation with a Google Meet link

## Troubleshooting

### Common Issues

1. **"Missing Google credentials" error**
   - Ensure `GOOGLE_SERVICE_ACCOUNT_KEY` is set in Vercel environment variables
   - For local development, ensure `api/token.json` exists

2. **"Method not allowed" error**
   - Ensure you're sending a POST request (not GET)
   - Check that the API endpoint URL is correct

3. **"Network error" from frontend**
   - Verify the API URL in the frontend configuration
   - Check that the backend is running and accessible

### Local Development Issues

1. **Port conflicts**
   - Frontend runs on port 3000
   - Backend runs on port 5000
   - Ensure these ports are available

2. **Module not found errors**
   - Run `npm install` in both `api/` and `meet-invite-ui/` directories
   - Check that all dependencies are properly installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Google Calendar API documentation
3. Check Vercel deployment logs
4. Open an issue in the GitHub repository 