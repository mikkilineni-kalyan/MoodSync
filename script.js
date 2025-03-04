// DOM Elements
const webcamElement = document.getElementById('webcam');
const overlayCanvas = document.getElementById('overlay');
const detectedMoodElement = document.getElementById('detected-mood');
const startButton = document.getElementById('start-btn');
const findMusicButton = document.getElementById('find-music-btn');
const playlistContainer = document.getElementById('playlist-container');
const moodTextArea = document.getElementById('mood-text');
const analyzeTextButton = document.getElementById('analyze-text-btn');
const detectionSensitivity = document.getElementById('detection-sensitivity');
const detectionFrequency = document.getElementById('detection-frequency');

// Global Variables
let isWebcamRunning = false;
let currentMood = null;
let detectionInterval = null;
let modelsLoaded = false;
const LASTFM_API_KEY = 'ef6d348ab5f7c77d6e91ff3b3af1c1fc';
let isUsingLastFmApi = true; // Toggle between Last.fm API and local database

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

// Mood to Last.fm tag mapping
const moodToLastFmTag = {
    'happy': ['happy', 'upbeat', 'feel good'],
    'sad': ['sad', 'melancholy', 'emotional'],
    'angry': ['angry', 'aggressive', 'intense'],
    'surprised': ['surprising', 'unexpected', 'experimental'],
    'fearful': ['scary', 'dark', 'atmospheric'],
    'disgusted': ['intense', 'heavy', 'dark'],
    'neutral': ['chill', 'relaxing', 'mellow']
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
    'dance': [
        { title: 'Don\'t Start Now', artist: 'Dua Lipa', thumbnail: 'https://via.placeholder.com/60?text=DuaLipa', link: 'https://www.youtube.com/results?search_query=dua+lipa+dont+start+now' },
        { title: 'Levels', artist: 'Avicii', thumbnail: 'https://via.placeholder.com/60?text=Avicii', link: 'https://www.youtube.com/results?search_query=avicii+levels' },
        { title: 'One More Time', artist: 'Daft Punk', thumbnail: 'https://via.placeholder.com/60?text=DaftPunk', link: 'https://www.youtube.com/results?search_query=daft+punk+one+more+time' }
    ],
    'electronic': [
        { title: 'Strobe', artist: 'Deadmau5', thumbnail: 'https://via.placeholder.com/60?text=Deadmau5', link: 'https://www.youtube.com/results?search_query=deadmau5+strobe' },
        { title: 'Scary Monsters and Nice Sprites', artist: 'Skrillex', thumbnail: 'https://via.placeholder.com/60?text=Skrillex', link: 'https://www.youtube.com/results?search_query=skrillex+scary+monsters+and+nice+sprites' },
        { title: 'Opus', artist: 'Eric Prydz', thumbnail: 'https://via.placeholder.com/60?text=Prydz', link: 'https://www.youtube.com/results?search_query=eric+prydz+opus' }
    ],
    'soul': [
        { title: 'Respect', artist: 'Aretha Franklin', thumbnail: 'https://via.placeholder.com/60?text=Aretha', link: 'https://www.youtube.com/results?search_query=aretha+franklin+respect' },
        { title: 'I\'d Rather Go Blind', artist: 'Etta James', thumbnail: 'https://via.placeholder.com/60?text=EttaJames', link: 'https://www.youtube.com/results?search_query=etta+james+id+rather+go+blind' },
        { title: 'Superstition', artist: 'Stevie Wonder', thumbnail: 'https://via.placeholder.com/60?text=Stevie', link: 'https://www.youtube.com/results?search_query=stevie+wonder+superstition' }
    ],
    'ambient': [
        { title: 'Avril 14th', artist: 'Aphex Twin', thumbnail: 'https://via.placeholder.com/60?text=Aphex', link: 'https://www.youtube.com/results?search_query=aphex+twin+avril+14th' },
        { title: 'Music for Airports', artist: 'Brian Eno', thumbnail: 'https://via.placeholder.com/60?text=Eno', link: 'https://www.youtube.com/results?search_query=brian+eno+music+for+airports' },
        { title: 'Gymnopédie No.1', artist: 'Erik Satie', thumbnail: 'https://via.placeholder.com/60?text=Satie', link: 'https://www.youtube.com/results?search_query=erik+satie+gymnopedie+no+1' }
    ],
    'metal': [
        { title: 'Master of Puppets', artist: 'Metallica', thumbnail: 'https://via.placeholder.com/60?text=Metallica', link: 'https://www.youtube.com/results?search_query=metallica+master+of+puppets' },
        { title: 'Paranoid', artist: 'Black Sabbath', thumbnail: 'https://via.placeholder.com/60?text=Sabbath', link: 'https://www.youtube.com/results?search_query=black+sabbath+paranoid' },
        { title: 'Chop Suey!', artist: 'System of a Down', thumbnail: 'https://via.placeholder.com/60?text=SOAD', link: 'https://www.youtube.com/results?search_query=system+of+a+down+chop+suey' }
    ],
    'punk': [
        { title: 'Blitzkrieg Bop', artist: 'Ramones', thumbnail: 'https://via.placeholder.com/60?text=Ramones', link: 'https://www.youtube.com/results?search_query=ramones+blitzkrieg+bop' },
        { title: 'Anarchy in the UK', artist: 'Sex Pistols', thumbnail: 'https://via.placeholder.com/60?text=SexPistols', link: 'https://www.youtube.com/results?search_query=sex+pistols+anarchy+in+the+uk' },
        { title: 'Basket Case', artist: 'Green Day', thumbnail: 'https://via.placeholder.com/60?text=GreenDay', link: 'https://www.youtube.com/results?search_query=green+day+basket+case' }
    ],
    'jazz': [
        { title: 'Take Five', artist: 'Dave Brubeck', thumbnail: 'https://via.placeholder.com/60?text=Brubeck', link: 'https://www.youtube.com/results?search_query=dave+brubeck+take+five' },
        { title: 'So What', artist: 'Miles Davis', thumbnail: 'https://via.placeholder.com/60?text=Miles', link: 'https://www.youtube.com/results?search_query=miles+davis+so+what' },
        { title: 'My Favorite Things', artist: 'John Coltrane', thumbnail: 'https://via.placeholder.com/60?text=Coltrane', link: 'https://www.youtube.com/results?search_query=john+coltrane+my+favorite+things' }
    ],
    'experimental': [
        { title: 'Idioteque', artist: 'Radiohead', thumbnail: 'https://via.placeholder.com/60?text=Radiohead', link: 'https://www.youtube.com/results?search_query=radiohead+idioteque' },
        { title: 'Windowlicker', artist: 'Aphex Twin', thumbnail: 'https://via.placeholder.com/60?text=Aphex', link: 'https://www.youtube.com/results?search_query=aphex+twin+windowlicker' },
        { title: 'Frankie Sinatra', artist: 'The Avalanches', thumbnail: 'https://via.placeholder.com/60?text=Avalanches', link: 'https://www.youtube.com/results?search_query=the+avalanches+frankie+sinatra' }
    ],
    'classical': [
        { title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven', thumbnail: 'https://via.placeholder.com/60?text=Beethoven', link: 'https://www.youtube.com/results?search_query=beethoven+moonlight+sonata' },
        { title: 'Clair de Lune', artist: 'Claude Debussy', thumbnail: 'https://via.placeholder.com/60?text=Debussy', link: 'https://www.youtube.com/results?search_query=debussy+clair+de+lune' },
        { title: 'The Four Seasons', artist: 'Antonio Vivaldi', thumbnail: 'https://via.placeholder.com/60?text=Vivaldi', link: 'https://www.youtube.com/results?search_query=vivaldi+four+seasons' }
    ],
    'soundtrack': [
        { title: 'Time', artist: 'Hans Zimmer', thumbnail: 'https://via.placeholder.com/60?text=Zimmer', link: 'https://www.youtube.com/results?search_query=hans+zimmer+time' },
        { title: 'Main Theme', artist: 'John Williams (Star Wars)', thumbnail: 'https://via.placeholder.com/60?text=StarWars', link: 'https://www.youtube.com/results?search_query=star+wars+main+theme' },
        { title: 'Requiem for a Dream', artist: 'Clint Mansell', thumbnail: 'https://via.placeholder.com/60?text=Requiem', link: 'https://www.youtube.com/results?search_query=requiem+for+a+dream+theme' }
    ],
    'industrial': [
        { title: 'Head Like a Hole', artist: 'Nine Inch Nails', thumbnail: 'https://via.placeholder.com/60?text=NIN', link: 'https://www.youtube.com/results?search_query=nine+inch+nails+head+like+a+hole' },
        { title: 'The Perfect Drug', artist: 'Nine Inch Nails', thumbnail: 'https://via.placeholder.com/60?text=NIN', link: 'https://www.youtube.com/results?search_query=nine+inch+nails+the+perfect+drug' },
        { title: 'Du Hast', artist: 'Rammstein', thumbnail: 'https://via.placeholder.com/60?text=Rammstein', link: 'https://www.youtube.com/results?search_query=rammstein+du+hast' }
    ],
    'folk': [
        { title: 'Blowin\' in the Wind', artist: 'Bob Dylan', thumbnail: 'https://via.placeholder.com/60?text=Dylan', link: 'https://www.youtube.com/results?search_query=bob+dylan+blowin+in+the+wind' },
        { title: 'The Sound of Silence', artist: 'Simon & Garfunkel', thumbnail: 'https://via.placeholder.com/60?text=Simon', link: 'https://www.youtube.com/results?search_query=simon+and+garfunkel+the+sound+of+silence' },
        { title: 'Landslide', artist: 'Fleetwood Mac', thumbnail: 'https://via.placeholder.com/60?text=Fleetwood', link: 'https://www.youtube.com/results?search_query=fleetwood+mac+landslide' }
    ],
    'acoustic': [
        { title: 'Blackbird', artist: 'The Beatles', thumbnail: 'https://via.placeholder.com/60?text=Beatles', link: 'https://www.youtube.com/results?search_query=the+beatles+blackbird' },
        { title: 'Hallelujah', artist: 'Jeff Buckley', thumbnail: 'https://via.placeholder.com/60?text=Buckley', link: 'https://www.youtube.com/results?search_query=jeff+buckley+hallelujah' },
        { title: 'Tears in Heaven', artist: 'Eric Clapton', thumbnail: 'https://via.placeholder.com/60?text=Clapton', link: 'https://www.youtube.com/results?search_query=eric+clapton+tears+in+heaven' }
    ]
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
            .detectAllFaces(webcamElement, new faceapi.TinyFaceDetectorOptions({
                // Apply sensitivity setting (higher value = more sensitive)
                scoreThreshold: 1 - (detectionSensitivity.value / 10)
            }))
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
    if (isUsingLastFmApi) {
        // Use Last.fm API for recommendations
        fetchLastFmRecommendations(mood);
        // Return empty array as the actual recommendations will be loaded asynchronously
        return [];
    } else {
        // Use local database for recommendations (original implementation)
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
}

// Fetch music recommendations from Last.fm API
async function fetchLastFmRecommendations(mood) {
    try {
        // Show loading message
        playlistContainer.innerHTML = '<p class="placeholder-text">Loading recommendations from Last.fm...</p>';
        
        // Get tags for the mood
        const tags = moodToLastFmTag[mood] || ['pop'];
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        
        // Fetch tracks by tag
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${randomTag}&api_key=${LASTFM_API_KEY}&format=json&limit=10`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`Last.fm API error: ${data.message}`);
        }
        
        // Process the tracks
        const tracks = data.tracks?.track || [];
        const recommendations = [];
        
        for (const track of tracks) {
            // Get additional track info including album art
            const trackInfoResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(track.artist.name)}&track=${encodeURIComponent(track.name)}&api_key=${LASTFM_API_KEY}&format=json`);
            
            if (!trackInfoResponse.ok) {
                continue;
            }
            
            const trackInfo = await trackInfoResponse.json();
            
            // Find the largest image
            let imageUrl = 'https://via.placeholder.com/60?text=Music';
            if (trackInfo.track?.album?.image) {
                const images = trackInfo.track.album.image;
                const largeImage = images.find(img => img.size === 'large' || img.size === 'medium');
                if (largeImage && largeImage['#text']) {
                    imageUrl = largeImage['#text'];
                }
            }
            
            recommendations.push({
                title: track.name,
                artist: track.artist.name,
                thumbnail: imageUrl,
                link: `https://www.youtube.com/results?search_query=${encodeURIComponent(track.artist.name + ' ' + track.name)}`
            });
        }
        
        // Display the recommendations
        displayRecommendations(recommendations);
        
    } catch (error) {
        console.error('Error fetching Last.fm recommendations:', error);
        
        // Fall back to local database
        const localRecommendations = getLocalMusicRecommendations(mood);
        displayRecommendations(localRecommendations);
        
        // Show error message
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.textContent = 'Error fetching from Last.fm. Showing local recommendations instead.';
        playlistContainer.prepend(errorElement);
    }
}

// Get recommendations from local database (fallback)
function getLocalMusicRecommendations(mood) {
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
document.addEventListener('DOMContentLoaded', () => {
    initFaceAPI();
    
    // Add API toggle switch to settings
    const settingsContainer = document.querySelector('.detection-settings');
    const apiToggleGroup = document.createElement('div');
    apiToggleGroup.className = 'setting-group';
    apiToggleGroup.innerHTML = `
        <label for="api-toggle">Use Last.fm API:</label>
        <div class="toggle-switch">
            <input type="checkbox" id="api-toggle" checked>
            <span class="toggle-slider"></span>
        </div>
    `;
    settingsContainer.appendChild(apiToggleGroup);
    
    // Add event listener for API toggle
    const apiToggle = document.getElementById('api-toggle');
    apiToggle.addEventListener('change', () => {
        isUsingLastFmApi = apiToggle.checked;
        const apiStatusText = isUsingLastFmApi ? 'Last.fm API' : 'Local Database';
        console.log(`Music source: ${apiStatusText}`);
    });
});

startButton.addEventListener('click', async () => {
    try {
        await startWebcam();
        startButton.textContent = 'Camera Active';
        startButton.disabled = true;
        
        // Start emotion detection with the selected frequency
        const frequency = parseInt(detectionFrequency.value);
        detectionInterval = setInterval(detectEmotion, frequency);
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

// Text-based mood analysis
analyzeTextButton.addEventListener('click', () => {
    const text = moodTextArea.value.trim();
    
    if (!text) {
        alert('Please enter some text describing your mood');
        return;
    }
    
    // Analyze text and determine mood
    const mood = analyzeTextMood(text);
    updateMoodDisplay(mood);
    
    // Enable find music button
    findMusicButton.disabled = false;
});

// Detection settings event listeners
detectionFrequency.addEventListener('change', () => {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        const frequency = parseInt(detectionFrequency.value);
        detectionInterval = setInterval(detectEmotion, frequency);
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

// Text-based mood analysis function
function analyzeTextMood(text) {
    // Convert text to lowercase for easier matching
    const lowerText = text.toLowerCase();
    
    // Define mood keywords
    const moodKeywords = {
        'happy': ['happy', 'joy', 'excited', 'cheerful', 'delighted', 'upbeat', 'uplifting', 'energetic', 'positive'],
        'sad': ['sad', 'depressed', 'down', 'blue', 'unhappy', 'melancholy', 'gloomy', 'heartbroken', 'lonely'],
        'angry': ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'rage', 'frustrated', 'upset', 'intense'],
        'fearful': ['scared', 'afraid', 'fearful', 'anxious', 'nervous', 'worried', 'terrified', 'panicked'],
        'disgusted': ['disgusted', 'gross', 'repulsed', 'revolted', 'nauseous', 'sick'],
        'surprised': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'unexpected'],
        'neutral': ['neutral', 'calm', 'relaxed', 'peaceful', 'balanced', 'content', 'fine', 'okay']
    };
    
    // Count occurrences of mood keywords
    const moodCounts = {};
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        moodCounts[mood] = 0;
        
        keywords.forEach(keyword => {
            // Check if the keyword appears in the text
            if (lowerText.includes(keyword)) {
                moodCounts[mood]++;
            }
        });
    }
    
    // Find the mood with the highest count
    let dominantMood = 'neutral'; // Default to neutral
    let highestCount = 0;
    
    for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > highestCount) {
            highestCount = count;
            dominantMood = mood;
        }
    }
    
    // If no mood keywords were found, default to neutral
    return dominantMood;
}
