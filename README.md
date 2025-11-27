# GlucoNova - Diabetes Management Platform

![GlucoNova Banner](https://raw.githubusercontent.com/user-attachments/assets/983f8c09-3b3d-4c0d-9b1a-2f8b3c8d8e8f)

An AI-powered diabetes management platform that helps patients track glucose levels, insulin doses, and meals while enabling doctors to monitor patients remotely.

## Features

### For Patients
- 📊 Real-time glucose monitoring with trend visualization
- 💉 Insulin dose tracking with AI-powered predictions
- 🍽️ Voice-activated meal logging (supports multiple languages)
- 💊 Medication scheduling and reminders
- 🤖 Personalized health insights powered by AI
- 📱 Mobile-responsive interface

### For Doctors
- 👥 Patient management dashboard
- 📈 Real-time patient health analytics
- ⚠️ Clinical alerts and notifications
- 💬 Secure messaging with patients
- 📄 Medical report analysis with OCR

### Technical Features
- 🔐 JWT-based authentication
- 🌐 Multi-language support (English, Hindi, Kannada, Telugu, Tamil)
- 📞 Real-time communication via WebSocket
- ☁️ Cloud-ready deployment
- 🐳 Docker support

## Tech Stack

- **Frontend**: React 18+, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport.js
- **Real-time**: WebSocket
- **AI/ML**: Custom algorithms for health predictions
- **Deployment**: Docker, Railway/Render compatible

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CommunityRecommender
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Railway Deployment

See [railway-deploy-guide.md](railway-deploy-guide.md) for detailed deployment instructions.

### Environment Variables

For production deployment, set these environment variables:

```bash
# Node environment
NODE_ENV=production

# Server configuration
PORT=8080

# Database configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Security
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# CORS
FRONTEND_URL=https://yourdomain.com
```

## Project Structure

```
.
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
├── server/           # Express backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── shared/           # Shared code
└── uploads/          # File uploads
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped develop this platform
- AI models inspired by medical research and best practices