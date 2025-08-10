import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const EmotionDetectorDemo = ({ onEmotionDetected }) => {
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [confidence, setConfidence] = useState(0.8);
  const [isAutoMode, setIsAutoMode] = useState(false);

  const emotions = ['happy', 'sad', 'neutral', 'frustrated', 'vibing'];

  // Auto-cycle through emotions for demo
  useEffect(() => {
    if (isAutoMode) {
      const interval = setInterval(() => {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        const randomConfidence = 0.6 + Math.random() * 0.4; // 60-100%
        
        setCurrentEmotion(randomEmotion);
        setConfidence(randomConfidence);
        onEmotionDetected(randomEmotion, randomConfidence);
      }, 3000); // Change emotion every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoMode, onEmotionDetected]);

  const handleManualEmotion = (emotion) => {
    const randomConfidence = 0.7 + Math.random() * 0.3;
    setCurrentEmotion(emotion);
    setConfidence(randomConfidence);
    onEmotionDetected(emotion, randomConfidence);
  };

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
      happy: 'bg-yellow-500',
      sad: 'bg-blue-500',
      neutral: 'bg-gray-500',
      frustrated: 'bg-red-500',
      vibing: 'bg-purple-500'
    };
    return colors[emotion] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">Demo Mode</h3>
        <p className="text-blue-700 text-sm">
          Camera not available in this environment. Use the controls below to simulate emotion detection.
        </p>
      </div>

      {/* Current Emotion Display */}
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {getEmotionEmoji(currentEmotion)}
          </div>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold ${getEmotionColor(currentEmotion)}`}>
            {currentEmotion.toUpperCase()}
          </div>
          <div className="mt-3 text-gray-600">
            Confidence: {(confidence * 100).toFixed(1)}%
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getEmotionColor(currentEmotion)}`}
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Auto Mode Toggle */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium">Auto Demo Mode</span>
          <Button
            onClick={() => setIsAutoMode(!isAutoMode)}
            variant={isAutoMode ? "default" : "outline"}
            size="sm"
          >
            {isAutoMode ? 'Stop Auto' : 'Start Auto'}
          </Button>
        </div>
        {isAutoMode && (
          <p className="text-sm text-gray-600 mt-2">
            Automatically cycling through emotions every 3 seconds...
          </p>
        )}
      </div>

      {/* Manual Emotion Controls */}
      {!isAutoMode && (
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <h4 className="font-medium mb-3">Manual Emotion Selection</h4>
          <div className="grid grid-cols-2 gap-2">
            {emotions.map((emotion) => (
              <Button
                key={emotion}
                onClick={() => handleManualEmotion(emotion)}
                variant={currentEmotion === emotion ? "default" : "outline"}
                className="flex items-center space-x-2"
                size="sm"
              >
                <span className="text-lg">{getEmotionEmoji(emotion)}</span>
                <span className="capitalize">{emotion}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="font-medium mb-2">How to test:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use "Start Auto" to automatically cycle through emotions</li>
          <li>• Or manually select emotions to test music matching</li>
          <li>• Watch the music player respond to emotion changes</li>
        </ul>
      </div>
    </div>
  );
};

export default EmotionDetectorDemo;

