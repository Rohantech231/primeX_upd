# Emotion Tracking App

A real-time emotion tracking application that uses your webcam to detect and analyze facial expressions. All processing happens locally in your browser for maximum privacy.

## Features

- Real-time emotion detection using TensorFlow.js
- Dynamic emotion visualization with emoji overlays
- Mood-based theme switching
- Personalized recommendations based on detected emotions
- Real-time emotion statistics dashboard
- Data export in JSON and PDF formats
- Fully responsive design
- Privacy-focused (all processing happens locally)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the provided URL
5. Grant camera permissions when prompted

## Technology Stack

- Next.js 13 with App Router
- TensorFlow.js for emotion detection
- Recharts for data visualization
- Tailwind CSS for styling
- shadcn/ui for UI components
- File-saver and jsPDF for data export

## Privacy

This application processes all data locally in your browser. No video or emotion data is ever sent to any server.

## License

MIT