# Email Setup for OTP Functionality

## Prerequisites

1. **Gmail Account**: You need a Gmail account to send OTP emails
2. **App Password**: Generate an app password for your Gmail account

## Setup Instructions

### 1. Enable 2-Factor Authentication on Gmail
- Go to your Google Account settings
- Navigate to Security
- Enable 2-Step Verification

### 2. Generate App Password
- In Google Account settings, go to Security
- Under "2-Step Verification", click "App passwords"
- Select "Mail" and "Other (custom name)"
- Enter "Academia Library" as the name
- Copy the generated 16-character password

### 3. Configure Environment Variables
Create a `.env` file in the `server` directory with the following content:

```env
# Email Configuration for OTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/academia-library

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key

# Server Configuration
PORT=8000
```

### 4. Replace Placeholder Values
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the app password you generated
- Replace other placeholder values as needed

### 5. Start the Server
```bash
cd server
npm run dev
```

## Features Implemented

### Login Page
- **Admin Login**: 
  - Email: `admin@gmail.com`
  - Password: `admin`
- **Student Login**: 
  - Email: Must end with `@charusat.edu.in`
  - Placeholder: `enrollment_number@charusat.edu.in`

### Signup Page
- **Email Validation**: Only accepts `@charusat.edu.in` emails
- **OTP Verification**: 
  - Sends 6-digit OTP to email
  - OTP expires in 5 minutes
  - Must verify email before account creation
- **Placeholder**: `enrollment_number@charusat.edu.in`

## API Endpoints

- `POST /api/v1/user/send-otp` - Send OTP to email
- `POST /api/v1/user/verify-otp` - Verify OTP
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user

## Testing

1. Start the backend server: `cd server && npm run dev`
2. Start the frontend: `cd client && npm run dev`
3. Navigate to signup page and test OTP functionality
4. Check your email for the OTP

## Troubleshooting

- **Email not sending**: Check your app password and ensure 2FA is enabled
- **OTP not working**: Ensure the server is running on port 8000
- **CORS errors**: Make sure the backend CORS is configured for your frontend URL
