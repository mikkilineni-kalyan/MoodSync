// MoodSync Test Script
// This script contains tests for the MoodSync application

// Test the text-based mood analysis function
function testTextMoodAnalysis() {
    console.log('=== Testing Text Mood Analysis ===');
    
    // Test cases with expected results
    const testCases = [
        { text: 'I am feeling so happy today!', expected: 'happy' },
        { text: 'I feel sad and depressed', expected: 'sad' },
        { text: 'I am so angry right now', expected: 'angry' },
        { text: 'I am scared and anxious about tomorrow', expected: 'fearful' },
        { text: 'That was disgusting and gross', expected: 'disgusted' },
        { text: 'Wow, I am so surprised!', expected: 'surprised' },
        { text: 'I feel okay, just normal', expected: 'neutral' },
        { text: 'Random text with no mood keywords', expected: 'neutral' }
    ];
    
    // Run each test case
    testCases.forEach(test => {
        // Call the analyzeTextMood function from the main script
        const result = analyzeTextMood(test.text);
        const passed = result === test.expected;
        
        console.log(`Test: "${test.text}"`);
        console.log(`Expected: ${test.expected}, Got: ${result}`);
        console.log(`Result: ${passed ? 'PASSED' : 'FAILED'}`);
        console.log('---');
    });
}

// Test the music recommendation system
function testMusicRecommendations() {
    console.log('=== Testing Music Recommendations ===');
    
    // Test each mood
    const moods = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];
    
    moods.forEach(mood => {
        const recommendations = getMusicRecommendations(mood);
        console.log(`Mood: ${mood}`);
        console.log(`Number of recommendations: ${recommendations.length}`);
        console.log(`First recommendation: ${recommendations[0]?.title} by ${recommendations[0]?.artist}`);
        console.log('---');
    });
}

// Test the detection settings
function testDetectionSettings() {
    console.log('=== Testing Detection Settings ===');
    
    // Test different sensitivity values
    console.log('Sensitivity test:');
    [1, 5, 10].forEach(value => {
        const threshold = 1 - (value / 10);
        console.log(`Sensitivity value: ${value}, Threshold: ${threshold}`);
    });
    
    // Test different frequency values
    console.log('Frequency test:');
    ['500', '1000', '2000', '3000'].forEach(value => {
        console.log(`Frequency value: ${value}ms`);
    });
}

// Run tests when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a button to run tests
    const testButton = document.createElement('button');
    testButton.textContent = 'Run Tests';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '1000';
    testButton.style.backgroundColor = '#ff5722';
    
    testButton.addEventListener('click', () => {
        console.clear();
        console.log('Running MoodSync Tests...');
        
        // Run all tests
        testTextMoodAnalysis();
        testMusicRecommendations();
        testDetectionSettings();
        
        console.log('All tests completed. Check console for results.');
    });
    
    document.body.appendChild(testButton);
});
