// DOM Elements
const webcamElement = document.getElementById('webcam');
const overlayCanvas = document.getElementById('overlay');
const detectedMoodElement = document.getElementById('detected-mood');
const startButton = document.getElementById('start-btn');
const findMusicButton = document.getElementById('find-music-btn');
const playlistContainer = document.getElementById('playlist-container');

// Global Variables
let isWebcamRunning = false;
let currentMood = null;
let detectionInterval = null;
let modelsLoaded = false;

// Mood to Music Genre Mapping
const moodToGenre = {
    'happy': ['pop', 'dance', 'electronic'],
    'sad': ['blues', 'soul', 'ambient'],
    'angry': ['rock', 'metal', 'punk'],
    'surprised': ['jazz', 'experimental', 'classical'],
    'fearful': ['ambient', 'soundtrack', 'classical'],
    'disgusted': ['industrial', 'experimental', 'electronic'],
    'neutral': ['indie', 'folk', 'acoustic']
};

// Sample song database organized by genre
// In a real app, you would fetch this from an API
const songDatabase = {
    'pop': [
        { title: 'Happy', artist: 'Pharrell Williams', thumbnail: 'https://via.placeholder.com/60?text=Happy', link: 'https://www.youtube.com/results?search_query=pharrell+williams+happy' },
        { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', thumbnail: 'https://via.placeholder.com/60?text=Uptown', link: 'https://www.youtube.com/results?search_query=uptown+funk' },
        { title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', thumbnail: 'https://via.placeholder.com/60?text=Feeling', link: 'https://www.youtube.com/results?search_query=justin+timberlake+cant+stop+the+feeling' }
    ],
    'rock': [
        { title: 'Enter Sandman', artist: 'Metallica', thumbnail: 'https://via.placeholder.com/60?text=Metallica', link: 'https://www.youtube.com/results?search_query=metallica+enter+sandman' },
        { title: 'Back In Black', artist: 'AC/DC', thumbnail: 'https://via.placeholder.com/60?text=ACDC', link: 'https://www.youtube.com/results?search_query=acdc+back+in+black' },
        { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', thumbnail: 'https://via.placeholder.com/60?text=GNR', link: 'https://www.youtube.com/results?search_query=guns+n+roses+sweet+child+o+mine' }
    ],
    'blues': [
        { title: 'The Thrill Is Gone', artist: 'B.B. King', thumbnail: 'https://via.placeholder.com/60?text=BBKing', link: 'https://www.youtube.com/results?search_query=bb+king+the+thrill+is+gone' },
        { title: 'Stormy Monday', artist: 'T-Bone Walker', thumbnail: 'https://via.placeholder.com/60?text=TBone', link: 'https://www.youtube.com/results?search_query=t+bone+walker+stormy+monday' },
        { title: 'Crossroad Blues', artist: 'Robert Johnson', thumbnail: 'https://via.placeholder.com/60?text=RJohnson', link: 'https://www.youtube.com/results?search_query=robert+johnson+crossroad+blues' }
    ],
    'indie': [
        { title: 'Skinny Love', artist: 'Bon Iver', thumbnail: 'https://via.placeholder.com/60?text=BonIver', link: 'https://www.youtube.com/results?search_query=bon+iver+skinny+love' },
        { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', thumbnail: 'https://via.placeholder.com/60?text=Arctic', link: 'https://www.youtube.com/results?search_query=arctic+monkeys+do+i+wanna+know' },
        { title: 'Midnight City', artist: 'M83', thumbnail: 'https://via.placeholder.com/60?text=M83', link: 'https://www.youtube.com/results?search_query=m83+midnight+city' }
    ],
    // Add more genres as needed
};

// Initialize face-api.js
async function initFaceAPI() {
    try {
        // Show loading message
        detectedMoodElement.textContent = 'Loading models...';
        
        // Define model URLs
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        
        // Load models
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        console.log('Face-API models loaded successfully');
        modelsLoaded = true;
        startButton.disabled = false;
        detectedMoodElement.textContent = 'Models loaded. Click Start Camera';
    } catch (error) {
        console.error('Error loading Face-API models:', error);
        detectedMoodElement.textContent = 'Error loading models. Please refresh';
    }
}

// Start webcam
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            } 
        });
        
        webcamElement.srcObject = stream;
        
        return new Promise((resolve) => {
            webcamElement.onloadedmetadata = () => {
                isWebcamRunning = true;
                resolve();
            };
        });
    } catch (error) {
        console.error('Error starting webcam:', error);
        detectedMoodElement.textContent = 'Camera access denied';
        throw error;
    }
}

// Detect emotions
async function detectEmotion() {
    if (!isWebcamRunning || !modelsLoaded) return;
    
    const displaySize = { 
        width: webcamElement.videoWidth, 
        height: webcamElement.videoHeight 
    };
    
    // Match canvas size to video
    faceapi.matchDimensions(overlayCanvas, displaySize);
    
    try {
        const detections = await faceapi
            .detectAllFaces(webcamElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
            
        if (detections.length > 0) {
            // Get the dominant expression
            const expressions = detections[0].expressions;
            const dominantExpression = Object.keys(expressions).reduce((a, b) => 
                expressions[a] > expressions[b] ? a : b);
            
            // Update UI
            updateMoodDisplay(dominantExpression);
            
            // Draw detections on canvas
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            overlayCanvas.getContext('2d').clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            faceapi.draw.drawDetections(overlayCanvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(overlayCanvas, resizedDetections);
        } else {
            detectedMoodElement.textContent = 'No face detected';
        }
    } catch (error) {
        console.error('Error detecting emotions:', error);
    }
}

// Update mood display
function updateMoodDisplay(mood) {
    // Convert API mood names to more user-friendly terms
    const moodMap = {
        'happy': 'Happy',
        'sad': 'Sad',
        'angry': 'Angry',
        'fearful': 'Fearful',
        'disgusted': 'Disgusted',
        'surprised': 'Surprised',
        'neutral': 'Neutral'
    };
    
    const displayMood = moodMap[mood] || mood;
    detectedMoodElement.textContent = displayMood;
    currentMood = mood;
    
    // Enable find music button once we have a mood
    findMusicButton.disabled = false;
}

// Get music recommendations based on mood
function getMusicRecommendations(mood) {
    const genres = moodToGenre[mood] || ['pop']; // Default to pop if mood not found
    const recommendations = [];
    
    // Get 2 songs from each genre associated with the mood
    genres.forEach(genre => {
        const genreSongs = songDatabase[genre] || [];
        const selectedSongs = genreSongs.slice(0, 2); // Get up to 2 songs
        recommendations.push(...selectedSongs);
    });
    
    return recommendations;
}

// Display music recommendations
function displayRecommendations(songs) {
    playlistContainer.innerHTML = '';
    
    if (songs.length === 0) {
        playlistContainer.innerHTML = '<p class="placeholder-text">No songs found for your current mood</p>';
        return;
    }
    
    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `
            <img class="song-thumbnail" src="${song.thumbnail}" alt="${song.title}">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-link">
                <a href="${song.link}" target="_blank">Listen</a>
            </div>
        `;
        playlistContainer.appendChild(songElement);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initFaceAPI);

startButton.addEventListener('click', async () => {
    try {
        await startWebcam();
        startButton.textContent = 'Camera Active';
        startButton.disabled = true;
        
        // Start emotion detection
        detectionInterval = setInterval(detectEmotion, 1000);
    } catch (error) {
        console.error('Failed to start webcam:', error);
    }
});

findMusicButton.addEventListener('click', () => {
    if (currentMood) {
        const recommendations = getMusicRecommendations(currentMood);
        displayRecommendations(recommendations);
    } else {
        alert('Please wait for mood detection to complete');
    }
});

// Clean up resources when page is unloaded
window.addEventListener('beforeunload', () => {
    if (detectionInterval) {
        clearInterval(detectionInterval);
    }
    
    if (isWebcamRunning && webcamElement.srcObject) {
        webcamElement.srcObject.getTracks().forEach(track => track.stop());
    }
});
