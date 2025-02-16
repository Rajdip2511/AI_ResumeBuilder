# AI Resume Builder

A modern web application that helps users create professional resumes using AI technology. Built with React, Firebase, and the DeepSeek API.

## Features

- 🔐 User Authentication
- 🤖 AI-Powered Resume Generation
- 📝 Real-Time Resume Editor
- 💾 Auto-Save Functionality
- 📥 PDF Export
- 🌓 Dark/Light Mode
- 📱 Responsive Design

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Firebase (Authentication, Firestore, Storage)
- AI: DeepSeek API
- PDF Generation: html2pdf.js

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- DeepSeek API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or Firebase Hosting. Make sure to set up the environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DeepSeek API](https://deepseek.com/)
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) 