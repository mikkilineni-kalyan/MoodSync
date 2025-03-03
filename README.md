# MoodSync

MoodSync is a web application that detects your mood through facial expression analysis and recommends music based on your emotional state.

## Features

- **Real-time Emotion Detection**: Uses your webcam to analyze facial expressions and determine your current mood
- **Mood-Based Music Recommendations**: Suggests songs that match your detected emotional state
- **Simple User Interface**: Easy-to-use controls and intuitive design
- **Privacy-Focused**: All processing happens in your browser - no data is sent to external servers

## How It Works

1. MoodSync uses face-api.js to detect facial expressions through your webcam
2. The app analyzes your expressions to determine your dominant emotion (happy, sad, angry, etc.)
3. Based on your detected mood, the app recommends music from a curated list of songs
4. Click on any recommended song to listen to it via YouTube

## Technologies Used

- HTML5, CSS3, and JavaScript
- face-api.js for facial expression recognition
- YouTube links for music playback

## Getting Started

1. Clone this repository to your local machine
2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended)
3. Click "Start Camera" to begin emotion detection
4. Once your mood is detected, click "Find Music" to get personalized recommendations

## Privacy Notice

MoodSync processes all facial recognition data locally in your browser. No images or personal data are sent to any server or stored anywhere. The webcam feed is used solely for real-time emotion detection.

## Future Improvements

- Integration with music streaming services for direct playback
- More sophisticated music recommendation algorithms
- User profiles to save favorite songs and improve recommendations over time
- Support for more emotions and mood nuances

## License

This project is open source and available under the MIT License.

## Acknowledgments

- face-api.js for providing the facial recognition capabilities
- Sample music data is for demonstration purposes only
