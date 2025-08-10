import { useState, useCallback } from 'react';
import EmotionDetectorDemo from './components/EmotionDetectorDemo';
import MusicPlayer from './components/MusicPlayer';
import { Music, Camera, Heart } from 'lucide-react';
import './App.css';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [emotionConfidence, setEmotionConfidence] = useState(0);

  const handleEmotionDetected = useCallback((emotion, confidence) => {
    setCurrentEmotion(emotion);
    setEmotionConfidence(confidence);
    
    // Add to emotion history (keep last 10)
    setEmotionHistory(prev => {
      const newHistory = [...prev, { emotion, confidence, timestamp: Date.now() }];
      return newHistory.slice(-10);
    });
  }, []);

  const handleSongChange = useCallback((song) => {
    setCurrentSong(song);
  }, []);

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      neutral: '😐',
      frustrated: '😤',
      vibing: '🎵'
    };
    return emojis[emotion] || '😐';
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: 'text-yellow-500',
      sad: 'text-blue-500',
      neutral: 'text-gray-500',
      frustrated: 'text-red-500',
      vibing: 'text-purple-500'
    };
    return colors[emotion] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2">
              <Camera className="text-blue-400" size={32} />
              <Heart className="text-red-400" size={24} />
              <Music className="text-green-400" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Tamil Emotion Music Player
            </h1>
          </div>
          <p className="text-center text-white/70 mt-2">
            AI-powered music that matches your emotions
          </p>
          <p className="text-center text-white/60 mt-1 text-sm">
            Prepared by Bhuvana Vijayakumar, B.E CSE
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Camera and Emotion Detection */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Camera className="mr-2" size={24} />
                Emotion Detection
              </h2>
              <EmotionDetectorDemo onEmotionDetected={handleEmotionDetected} />
            </div>

            {/* Current Emotion Display */}
            {currentEmotion && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Current Emotion</h3>
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {getEmotionEmoji(currentEmotion)}
                  </div>
                  <div className={`text-2xl font-bold capitalize ${getEmotionColor(currentEmotion)}`}>
                    {currentEmotion}
                  </div>
                  <div className="text-white/70 text-sm mt-2">
                    Confidence: {(emotionConfidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Music Player */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Music className="mr-2" size={24} />
                Music Player
              </h2>
              <MusicPlayer 
                currentEmotion={currentEmotion} 
                onSongChange={handleSongChange}
              />
            </div>

            {/* Emotion History */}
            {emotionHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Emotion History</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {emotionHistory.slice().reverse().map((entry, index) => (
                    <div key={entry.timestamp} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getEmotionEmoji(entry.emotion)}</span>
                        <span className={`capitalize ${getEmotionColor(entry.emotion)}`}>
                          {entry.emotion}
                        </span>
                      </div>
                      <div className="text-white/60">
                        {(entry.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-white/80">
            <div className="text-center">
              <Camera className="mx-auto mb-2 text-blue-400" size={32} />
              <h4 className="font-medium mb-2">1. Camera Detection</h4>
              <p className="text-sm">Allow camera access and position your face in view</p>
            </div>
            <div className="text-center">
              <Heart className="mx-auto mb-2 text-red-400" size={32} />
              <h4 className="font-medium mb-2">2. Emotion Analysis</h4>
              <p className="text-sm">AI analyzes your facial expressions in real-time</p>
            </div>
            <div className="text-center">
              <Music className="mx-auto mb-2 text-green-400" size={32} />
              <h4 className="font-medium mb-2">3. Music Matching</h4>
              <p className="text-sm">Tamil songs automatically play based on your mood</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-white/60">
          <p>Tamil Emotion Music Player - Experience music that understands your feelings</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

