import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MusicPlayer = ({ currentEmotion, onSongChange }) => {
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Tamil songs database organized by emotion - Expanded with many options
  const songDatabase = {
    happy: [
      {
        title: "Whistle Podu",
        artist: "Thalapathy Vijay, Yuvan Shankar Raja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      },
      {
        title: "Idhazhin Oram",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      },
      {
        title: "Maanamadurai Maamarkilaiyile",
        artist: "A.R. Rahman",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      },
      {
        title: "Sollathey Solai Kili",
        artist: "Hariharan",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      },
      {
        title: "Chotta Chotta Nanaiyuthey",
        artist: "A.R. Rahman",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      },
      {
        title: "Anbilavan",
        artist: "Ilaiyaraaja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      },
      {
        title: "Vaathi Coming",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      },
      {
        title: "Rowdy Baby",
        artist: "Yuvan Shankar Raja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "happy"
      }
    ],
    sad: [
      {
        title: "Poi Vazhva",
        artist: "Santhosh Narayanan",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      },
      {
        title: "Othayilae",
        artist: "Harris Jayaraj",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      },
      {
        title: "Po Nee Po",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      },
      {
        title: "Yamma Yamma",
        artist: "Harris Jayaraj",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      },
      {
        title: "Why This Kolaveri Di",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      },
      {
        title: "Kaanum Sandhosham",
        artist: "Ilaiyaraaja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      },
      {
        title: "Pazhaya Sogangal",
        artist: "Ilaiyaraaja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      },
      {
        title: "Unmai Oru Naal Vellum",
        artist: "A.R. Rahman",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "sad"
      }
    ],
    neutral: [
      {
        title: "Oru Nathi",
        artist: "Nithyasree",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "neutral"
      },
      {
        title: "Poo Pookkum Osai",
        artist: "M. Vasudevan",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "neutral"
      },
      {
        title: "Kutti Kutti",
        artist: "Sadhana Sargam",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "neutral"
      },
      {
        title: "Ennai Konjum",
        artist: "Timmy, Tippu",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "neutral"
      },
      {
        title: "Uyirin Uyire",
        artist: "Krishnakumar Kunnath",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "neutral"
      },
      {
        title: "Saara Kaatre",
        artist: "Hariharan",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "neutral"
      },
      {
        title: "Thendral Vanthu",
        artist: "S.P. Balasubrahmanyam",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "neutral"
      }
    ],
    frustrated: [
      {
        title: "Gangsta",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "frustrated"
      },
      {
        title: "Darnaka",
        artist: "Yuvan Shankar Raja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "frustrated"
      },
      {
        title: "Siriki",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "frustrated"
      },
      {
        title: "Etharkkum Thunidhavan Theme",
        artist: "Ghibran",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "frustrated"
      },
      {
        title: "Kasedhan Kadavulada",
        artist: "Yuvan Shankar Raja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "frustrated"
      },
      {
        title: "Manuranda",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "frustrated"
      },
      {
        title: "Beast Mode",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "frustrated"
      }
    ],
    vibing: [
      {
        title: "Osaka Osaka",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      },
      {
        title: "Hey Amigo",
        artist: "Yuvan Shankar Raja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      },
      {
        title: "Molagapodiye",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      },
      {
        title: "Arabic Kuthu",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      },
      {
        title: "Butta Bomma",
        artist: "Armaan Malik",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      },
      {
        title: "Naanga Vera Maari",
        artist: "Yuvan Shankar Raja",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      },
      {
        title: "Jimikki Kammal",
        artist: "Vineeth Sreenivasan",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      },
      {
        title: "Thalapathy Anthem",
        artist: "Anirudh Ravichander",
        url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
        emotion: "vibing"
      }
    ]
  };

  // Effect to handle emotion changes
  useEffect(() => {
    if (currentEmotion && songDatabase[currentEmotion]) {
      const songs = songDatabase[currentEmotion];
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      
      // Only change song if it's different from current
      if (!currentSong || currentSong.title !== randomSong.title) {
        setCurrentSong(randomSong);
        onSongChange?.(randomSong);
        
        // Auto-play the new song
        setTimeout(() => {
          playAudio();
        }, 500);
      }
    }
  }, [currentEmotion]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // Auto-play next song from same emotion
      if (currentEmotion && songDatabase[currentEmotion]) {
        const songs = songDatabase[currentEmotion];
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        setCurrentSong(randomSong);
        onSongChange?.(randomSong);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentEmotion, onSongChange]);

  const playAudio = async () => {
    if (audioRef.current && currentSong) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const skipToNext = () => {
    if (currentEmotion && songDatabase[currentEmotion]) {
      const songs = songDatabase[currentEmotion];
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      setCurrentSong(randomSong);
      onSongChange?.(randomSong);
      
      if (isPlaying) {
        setTimeout(() => {
          playAudio();
        }, 100);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  const getEmotionGradient = (emotion) => {
    const gradients = {
      happy: 'from-yellow-400 to-orange-500',
      sad: 'from-blue-400 to-blue-600',
      neutral: 'from-gray-400 to-gray-600',
      frustrated: 'from-red-400 to-red-600',
      vibing: 'from-purple-400 to-pink-500'
    };
    return gradients[emotion] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${currentSong ? getEmotionGradient(currentSong.emotion) : 'from-gray-400 to-gray-600'} text-white shadow-lg`}>
      {/* Audio element */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          volume={volume}
          onLoadStart={() => console.log('Loading audio:', currentSong.title)}
        />
      )}

      {/* Current emotion indicator */}
      {currentEmotion && (
        <div className="mb-4 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(currentEmotion)} text-white`}>
            Playing for: {currentEmotion} mood
          </div>
        </div>
      )}

      {/* Song info */}
      <div className="text-center mb-6">
        {currentSong ? (
          <>
            <h3 className="text-xl font-bold mb-2">{currentSong.title}</h3>
            <p className="text-white/80">{currentSong.artist}</p>
          </>
        ) : (
          <p className="text-white/80">No song selected</p>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-white/80 mt-1">
          <span>{formatTime(audioRef.current?.currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          onClick={togglePlayPause}
          disabled={!currentSong}
          className="bg-white/20 hover:bg-white/30 text-white border-none"
          size="lg"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </Button>
        
        <Button
          onClick={skipToNext}
          disabled={!currentSong}
          className="bg-white/20 hover:bg-white/30 text-white border-none"
        >
          <SkipForward size={20} />
        </Button>
      </div>

      {/* Volume control */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={toggleMute}
          className="bg-white/20 hover:bg-white/30 text-white border-none p-2"
          size="sm"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Note about placeholder audio */}
      <div className="mt-4 text-center text-xs text-white/60">
        Note: Using placeholder audio for demo. In production, use actual Tamil song URLs.
      </div>
    </div>
  );
};

export default MusicPlayer;

