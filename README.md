# MoodSync

MoodSync is a web application that detects your mood through facial expression analysis and recommends music based on your emotional state.

## Features

- **Real-time Emotion Detection**: Uses your webcam to analyze facial expressions and determine your current mood
- **Mood-Based Music Recommendations**: Suggests songs that match your detected emotional state
- **Text-Based Mood Analysis**: Describe your feelings in text if you prefer not to use the webcam
- **Customizable Detection Settings**: Adjust sensitivity and frequency of emotion detection
- **Last.fm API Integration**: Get real-time music recommendations from Last.fm based on your mood
- **Extensive Music Library**: Recommendations from various genres including pop, rock, jazz, classical, and more
- **Simple User Interface**: Easy-to-use controls and intuitive design
- **Privacy-Focused**: All processing happens in your browser - no data is sent to external servers

## How It Works

1. MoodSync uses face-api.js to detect facial expressions through your webcam
2. The app analyzes your expressions to determine your dominant emotion (happy, sad, angry, etc.)
3. Alternatively, you can describe your mood in text, and the app will analyze your words
4. Based on your detected mood, the app fetches music recommendations from Last.fm API or uses its local database
5. Click on any recommended song to listen to it via YouTube

## Technologies Used

- HTML5, CSS3, and JavaScript
- face-api.js for facial expression recognition
- Natural language processing for text-based mood analysis
- Last.fm API for music recommendations
- YouTube links for music playback

## Getting Started

1. Clone this repository to your local machine
2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended)
3. Click "Start Camera" to begin emotion detection, or use the text input to describe your mood
4. Adjust detection settings if needed
5. Once your mood is detected, click "Find Music" to get personalized recommendations

## API Configuration

MoodSync uses the Last.fm API to fetch music recommendations. The API key is already included in the code. If you want to use your own API key:

1. Register for a Last.fm API key at [Last.fm API](https://www.last.fm/api/account/create)
2. Replace the `LASTFM_API_KEY` constant in `script.js` with your own key

## Privacy Notice

MoodSync processes all facial recognition data locally in your browser. No images or personal data are sent to any server or stored anywhere. The webcam feed is used solely for real-time emotion detection.

When using the Last.fm API, only your detected mood is used to fetch music recommendations. No personal data is shared with Last.fm.

## Future Improvements

- Integration with music streaming services for direct playback
- More sophisticated music recommendation algorithms
- User profiles to save favorite songs and improve recommendations over time
- Support for more emotions and mood nuances

## License

This project is open source and available under the MIT License.

## Acknowledgments

- face-api.js for providing the facial recognition capabilities
- Last.fm for their music recommendation API
- Sample music data is for demonstration purposes only
