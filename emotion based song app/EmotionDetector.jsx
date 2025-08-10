import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const EmotionDetector = ({ onEmotionDetected }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        
        // Load face-api.js models
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        
        console.log('Models loaded successfully');
        startVideo();
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load emotion detection models');
        setIsLoading(false);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
            detectEmotions();
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Failed to access camera. Please allow camera permissions.');
        setIsLoading(false);
      }
    };

    const detectEmotions = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const detectInterval = setInterval(async () => {
        if (video.paused || video.ended) return;

        try {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

          if (detections.length > 0) {
            const expressions = detections[0].expressions;
            
            // Find the emotion with highest confidence
            let maxEmotion = '';
            let maxConfidence = 0;
            
            Object.keys(expressions).forEach(emotion => {
              if (expressions[emotion] > maxConfidence) {
                maxConfidence = expressions[emotion];
                maxEmotion = emotion;
              }
            });

            // Map face-api emotions to our custom emotions
            const emotionMapping = {
              'happy': 'happy',
              'sad': 'sad',
              'neutral': 'neutral',
              'angry': 'frustrated',
              'surprised': 'vibing',
              'fearful': 'neutral',
              'disgusted': 'frustrated'
            };

            const mappedEmotion = emotionMapping[maxEmotion] || 'neutral';
            
            // Only update if confidence is above threshold
            if (maxConfidence > 0.5) {
              setCurrentEmotion(mappedEmotion);
              setConfidence(maxConfidence);
              onEmotionDetected(mappedEmotion, maxConfidence);
            }

            // Draw detection results on canvas
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw face detection box
            const box = detections[0].detection.box;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            
            // Draw emotion text
            ctx.fillStyle = '#00ff00';
            ctx.font = '16px Arial';
            ctx.fillText(
              `${mappedEmotion} (${(maxConfidence * 100).toFixed(1)}%)`,
              box.x,
              box.y - 10
            );
          }
        } catch (err) {
          console.error('Error detecting emotions:', err);
        }
      }, 100); // Detect every 100ms

      return () => clearInterval(detectInterval);
    };

    loadModels();

    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onEmotionDetected]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading emotion detection...</p>
          </div>
        </div>
      )}
      
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-auto"
          style={{ maxWidth: '640px', maxHeight: '480px' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      
      {currentEmotion && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-blue-800">
              Current Emotion: {currentEmotion}
            </span>
            <span className="text-sm text-blue-600">
              Confidence: {(confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;

