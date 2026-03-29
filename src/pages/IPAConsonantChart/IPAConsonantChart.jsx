import React, { useState, useRef, useEffect } from 'react';
import './IPAConsonantChart.css';

// Inline SVG Icons
const PlayIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Volume2Icon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const VolumeXIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const ChevronDownIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Helper function to get audio file path
const getAudioPath = (symbol) => {
  // Map IPA symbols to filename-friendly names
  const symbolMap = {
    // Plosives
    'p': 'p',
    'b': 'b',
    't': 't',
    'd': 'd',
    'ʈ': 't-retroflex',
    'ɖ': 'd-retroflex',
    'c': 'c',
    'ɟ': 'j-bar',
    'k': 'k',
    'g': 'g',
    'q': 'q',
    'ɢ': 'g-cap',
    'ʔ': 'glottal-stop',

    // Nasals
    'm': 'm',
    'ɱ': 'm-dental',
    'n': 'n',
    'ɲ': 'n-tilde',
    'ŋ': 'n-eng',
    'ɴ': 'n-small-cap',

    // Fricatives
    'ɸ': 'phi',
    'β': 'beta',
    'f': 'f',
    'v': 'v',
    'θ': 'theta',
    'ð': 'eth',
    's': 's',
    'z': 'z',
    'ʃ': 'esh',
    'ʒ': 'ezh',
    'ʂ': 's-retroflex',
    'ʐ': 'z-retroflex',
    'ç': 'c-cedilla',
    'ʝ': 'j-crossed',
    'x': 'x',
    'ɣ': 'gamma',
    'χ': 'chi',
    'ʁ': 'r-uvular',
    'ħ': 'h-bar',
    'ʕ': 'ayn',
    'h': 'h',
    'ɦ': 'h-hook',

    // Lateral Fricatives
    'ɬ': 'l-belt',
    'ɮ': 'l-belt-voiced',

    // Approximants
    'β̞': 'beta-approximant',
    'ʋ': 'v-hook',
    'ɹ': 'r-turned',
    'ɻ': 'r-retroflex',
    'j': 'j',
    'ɰ': 'm-turned',
    'ɹ̠': 'r-postalveolar',

    // Lateral Approximants
    'l': 'l',
    'ɭ': 'l-retroflex',
    'ʎ': 'lambda',
    'ʟ': 'l-small-cap',

    // Trills
    'ʙ': 'b-tril',
    'r': 'r',
    'ʀ': 'r-small-cap',

    // Tap/Flap
    'ɾ': 'r-flap',

    // Affricates
    'tʃ': 't-esh',
    'dʒ': 'd-ezh',

    // Non-pulmonic
    'ʘ': 'bilabial-click',
    'ǀ': 'dental-click',
    'ǃ': 'alveolar-click',
    'ǂ': 'palatal-click',
    'ǁ': 'lateral-click',
    'ɓ': 'b-hook',
    'ɗ': 'd-hook',
    'ʄ': 'j-hook',
    'ɠ': 'g-hook',
    'ʛ': 'g-cap-hook',
    'pʼ': 'p-ejective',
    'tʼ': 't-ejective',
    'kʼ': 'k-ejective',
    'sʼ': 's-ejective',
    'ʃʼ': 'esh-ejective',
    'tsʼ': 'ts-ejective',
    'tʃʼ': 't-esh-ejective'
  };

  const fileName = symbolMap[symbol] || symbol.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  console.log(fileName)
  return `/audio/ipa_chart/${fileName}.mp3`;
};

// Audio Player Component with real audio files
const AudioPlayer = ({ consonant, isPlaying, onPlay, muted }) => {
  const audioRef = useRef(null);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create new audio instance
    const audioPath = getAudioPath(consonant.symbol);
    const audio = new Audio(audioPath);

    audio.oncanplaythrough = () => {
      setIsLoading(false);
    };

    audio.onerror = (e) => {
      console.error(`Failed to load audio for ${consonant.symbol}:`, e);
      setAudioError(true);
      setIsLoading(false);
    };

    audio.onended = () => {
      onPlay();
    };

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [consonant.symbol, onPlay]);

  // Handle mute changes
  useEffect(() => {
    if (audioRef.current && muted) {
      audioRef.current.pause();
      if (isPlaying) {
        onPlay();
      }
    }
  }, [muted, isPlaying, onPlay]);

  const playAudio = () => {
    if (isPlaying || muted || !audioRef.current) return;

    setIsLoading(true);

    // Stop any currently playing audio
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }

    audioRef.current.play()
      .then(() => {
        window.currentAudio = audioRef.current;
        onPlay();
      })
      .catch((err) => {
        console.error('Audio playback failed:', err);
        setAudioError(true);
        setIsLoading(false);
        onPlay();
      });
  };

  // Determine button state
  const isDisabled = isPlaying || muted || isLoading;
  let buttonClass = 'audio-button';
  if (isPlaying) buttonClass += ' playing';
  if (audioError) buttonClass += ' error';

  return (
    <button
      onClick={playAudio}
      disabled={isDisabled}
      className={buttonClass}
      title={audioError ? `No audio file for ${consonant.name}` : `Play ${consonant.name}`}
    >
      {isLoading ? (
        <div className="loading-spinner" />
      ) : isPlaying ? (
        <Volume2Icon size={14} />
      ) : audioError ? (
        <span className="error-icon">⚠️</span>
      ) : (
        <PlayIcon size={14} />
      )}
    </button>
  );
};

// IPA Consonant Chart Data (same as before)
const consonantChartData = {
  'Bilabial': {
    'Plosive': {
      voiceless: { symbol: 'p', name: 'Voiceless bilabial plosive', example: 'pat' },
      voiced: { symbol: 'b', name: 'Voiced bilabial plosive', example: 'bat' }
    },
    'Nasal': {
      voiced: { symbol: 'm', name: 'Bilabial nasal', example: 'mat' }
    },
    'Fricative': {
      voiceless: { symbol: 'ɸ', name: 'Voiceless bilabial fricative', example: 'Japanese "fu"' },
      voiced: { symbol: 'β', name: 'Voiced bilabial fricative', example: 'Spanish "haber"' }
    },
    'Approximant': {
      voiced: { symbol: 'β̞', name: 'Bilabial approximant', example: 'Spanish "lobo"' }
    },
    'Trill': {
      voiced: { symbol: 'ʙ', name: 'Bilabial trill', example: 'raspberry sound' }
    }
  },
  'Labiodental': {
    'Nasal': {
      voiced: { symbol: 'ɱ', name: 'Labiodental nasal', example: 'emphasis' }
    },
    'Fricative': {
      voiceless: { symbol: 'f', name: 'Voiceless labiodental fricative', example: 'fat' },
      voiced: { symbol: 'v', name: 'Voiced labiodental fricative', example: 'vat' }
    },
    'Approximant': {
      voiced: { symbol: 'ʋ', name: 'Labiodental approximant', example: 'Dutch "west"' }
    }
  },
  'Dental': {
    'Fricative': {
      voiceless: { symbol: 'θ', name: 'Voiceless dental fricative', example: 'thin' },
      voiced: { symbol: 'ð', name: 'Voiced dental fricative', example: 'this' }
    },
    'Plosive': {
      voiceless: { symbol: 't̪', name: 'Voiceless dental plosive', example: 'Spanish "toro"' },
      voiced: { symbol: 'd̪', name: 'Voiced dental plosive', example: 'Spanish "donde"' }
    }
  },
  'Alveolar': {
    'Plosive': {
      voiceless: { symbol: 't', name: 'Voiceless alveolar plosive', example: 'top' },
      voiced: { symbol: 'd', name: 'Voiced alveolar plosive', example: 'dog' }
    },
    'Nasal': {
      voiced: { symbol: 'n', name: 'Alveolar nasal', example: 'no' }
    },
    'Fricative': {
      voiceless: { symbol: 's', name: 'Voiceless alveolar fricative', example: 'sit' },
      voiced: { symbol: 'z', name: 'Voiced alveolar fricative', example: 'zoo' }
    },
    'Lateral Fricative': {
      voiceless: { symbol: 'ɬ', name: 'Voiceless alveolar lateral fricative', example: 'Welsh "llan"' },
      voiced: { symbol: 'ɮ', name: 'Voiced alveolar lateral fricative', example: 'Zulu "dlala"' }
    },
    'Approximant': {
      voiced: { symbol: 'ɹ', name: 'Alveolar approximant', example: 'run' }
    },
    'Lateral Approximant': {
      voiced: { symbol: 'l', name: 'Alveolar lateral approximant', example: 'lip' }
    },
    'Tap/Flap': {
      voiced: { symbol: 'ɾ', name: 'Alveolar tap', example: 'American English "butter"' }
    },
    'Trill': {
      voiced: { symbol: 'r', name: 'Alveolar trill', example: 'Spanish "perro"' }
    }
  },
  'Postalveolar': {
    'Fricative': {
      voiceless: { symbol: 'ʃ', name: 'Voiceless postalveolar fricative', example: 'ship' },
      voiced: { symbol: 'ʒ', name: 'Voiced postalveolar fricative', example: 'vision' }
    },
    'Affricate': {
      voiceless: { symbol: 'tʃ', name: 'Voiceless postalveolar affricate', example: 'chip' },
      voiced: { symbol: 'dʒ', name: 'Voiced postalveolar affricate', example: 'jam' }
    },
    'Approximant': {
      voiced: { symbol: 'ɹ̠', name: 'Postalveolar approximant', example: 'red (retroflex)' }
    }
  },
  'Retroflex': {
    'Plosive': {
      voiceless: { symbol: 'ʈ', name: 'Voiceless retroflex plosive', example: 'Swedish "parti"' },
      voiced: { symbol: 'ɖ', name: 'Voiced retroflex plosive', example: 'Swedish "ord"' }
    },
    'Fricative': {
      voiceless: { symbol: 'ʂ', name: 'Voiceless retroflex fricative', example: 'Mandarin "sh"' },
      voiced: { symbol: 'ʐ', name: 'Voiced retroflex fricative', example: 'Polish "ż"' }
    },
    'Approximant': {
      voiced: { symbol: 'ɻ', name: 'Retroflex approximant', example: 'Tamil "zh"' }
    },
    'Lateral Approximant': {
      voiced: { symbol: 'ɭ', name: 'Retroflex lateral approximant', example: 'Swedish "pärla"' }
    }
  },
  'Palatal': {
    'Plosive': {
      voiceless: { symbol: 'c', name: 'Voiceless palatal plosive', example: 'Hungarian "tyúk"' },
      voiced: { symbol: 'ɟ', name: 'Voiced palatal plosive', example: 'Hungarian "gyár"' }
    },
    'Nasal': {
      voiced: { symbol: 'ɲ', name: 'Palatal nasal', example: 'Spanish "niño"' }
    },
    'Fricative': {
      voiceless: { symbol: 'ç', name: 'Voiceless palatal fricative', example: 'German "ich"' },
      voiced: { symbol: 'ʝ', name: 'Voiced palatal fricative', example: 'Spanish "yo"' }
    },
    'Approximant': {
      voiced: { symbol: 'j', name: 'Palatal approximant', example: 'yes' }
    },
    'Lateral Approximant': {
      voiced: { symbol: 'ʎ', name: 'Palatal lateral approximant', example: 'Italian "gli"' }
    }
  },
  'Velar': {
    'Plosive': {
      voiceless: { symbol: 'k', name: 'Voiceless velar plosive', example: 'cat' },
      voiced: { symbol: 'g', name: 'Voiced velar plosive', example: 'go' }
    },
    'Nasal': {
      voiced: { symbol: 'ŋ', name: 'Velar nasal', example: 'sing' }
    },
    'Fricative': {
      voiceless: { symbol: 'x', name: 'Voiceless velar fricative', example: 'Scottish "loch"' },
      voiced: { symbol: 'ɣ', name: 'Voiced velar fricative', example: 'Spanish "amigo"' }
    },
    'Approximant': {
      voiced: { symbol: 'ɰ', name: 'Velar approximant', example: 'Japanese "u"' }
    },
    'Lateral Approximant': {
      voiced: { symbol: 'ʟ', name: 'Velar lateral approximant', example: 'Mid-Waghi' }
    }
  },
  'Uvular': {
    'Plosive': {
      voiceless: { symbol: 'q', name: 'Voiceless uvular plosive', example: 'Arabic "qasr"' },
      voiced: { symbol: 'ɢ', name: 'Voiced uvular plosive', example: 'Persian "q"' }
    },
    'Nasal': {
      voiced: { symbol: 'ɴ', name: 'Uvular nasal', example: 'Japanese "n" before g/k' }
    },
    'Fricative': {
      voiceless: { symbol: 'χ', name: 'Voiceless uvular fricative', example: 'French "rue"' },
      voiced: { symbol: 'ʁ', name: 'Voiced uvular fricative', example: 'French "rouge"' }
    },
    'Trill': {
      voiced: { symbol: 'ʀ', name: 'Uvular trill', example: 'French "r" (some dialects)' }
    }
  },
  'Pharyngeal': {
    'Fricative': {
      voiceless: { symbol: 'ħ', name: 'Voiceless pharyngeal fricative', example: 'Arabic "ح"' },
      voiced: { symbol: 'ʕ', name: 'Voiced pharyngeal fricative', example: 'Arabic "ع"' }
    }
  },
  'Glottal': {
    'Plosive': {
      voiceless: { symbol: 'ʔ', name: 'Glottal stop', example: 'uh-oh' }
    },
    'Fricative': {
      voiceless: { symbol: 'h', name: 'Voiceless glottal fricative', example: 'hat' },
      voiced: { symbol: 'ɦ', name: 'Voiced glottal fricative', example: 'behind' }
    }
  }
};

const mannerOrder = [
  'Plosive', 'Nasal', 'Trill', 'Tap/Flap', 'Fricative', 'Lateral Fricative',
  'Affricate', 'Approximant', 'Lateral Approximant'
];

const placeOrder = [
  'Bilabial', 'Labiodental', 'Dental', 'Alveolar', 'Postalveolar',
  'Retroflex', 'Palatal', 'Velar', 'Uvular', 'Pharyngeal', 'Glottal'
];

// Consonant Cell Component
const ConsonantCellComponent = ({ cell, currentlyPlaying, setCurrentlyPlaying, muted }) => {
  const [hovered, setHovered] = useState(null);

  const renderConsonant = (consonant) => {
    if (!consonant) return null;

    const isPlaying = currentlyPlaying === consonant.symbol;

    return (
      <div
        className="consonant-item"
        onMouseEnter={() => setHovered(consonant.symbol)}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="consonant-content">
          <span className="consonant-symbol">{consonant.symbol}</span>
          <AudioPlayer
            consonant={consonant}
            isPlaying={isPlaying}
            onPlay={() => setCurrentlyPlaying(isPlaying ? null : consonant.symbol)}
            muted={muted}
          />
        </div>
        {hovered === consonant.symbol && (
          <div className="tooltip">
            <div className="tooltip-name">{consonant.name}</div>
            {consonant.example && <div className="tooltip-example">e.g., "{consonant.example}"</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <td className="chart-cell">
      <div className="cell-content">
        {cell.voiceless && renderConsonant(cell.voiceless)}
        {cell.voiced && renderConsonant(cell.voiced)}
        {!cell.voiceless && !cell.voiced && (
          <div className="empty-cell">—</div>
        )}
      </div>
    </td>
  );
};

// Main Component
const IPAConsonantChart = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [activeTab, setActiveTab] = useState('pulmonic');
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (currentlyPlaying) {
      const timer = setTimeout(() => {
        setCurrentlyPlaying(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentlyPlaying]);

  const handleGlobalMute = () => {
    setMuted(!muted);
    if (!muted && window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }
  };

  return (
    <div className="ipa-chart-container">
      <div className="chart-header">
        <div>
          <h1 className="chart-title">IPA Consonant Chart</h1>
        </div>
        <button
          onClick={handleGlobalMute}
          className="mute-button"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeXIcon size={20} /> : <Volume2Icon size={20} />}
        </button>
      </div>

      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('pulmonic')}
          className={`tab-button ${activeTab === 'pulmonic' ? 'active' : ''}`}
        >
          Pulmonic Consonants
        </button>
{/*         <button */}
{/*           onClick={() => setActiveTab('non-pulmonic')} */}
{/*           className={`tab-button ${activeTab === 'non-pulmonic' ? 'active' : ''}`} */}
{/*         > */}
{/*           Non-Pulmonic Consonants */}
{/*         </button> */}
      </div>

      {activeTab === 'pulmonic' && (
        <div className="table-wrapper">
          <table className="consonant-table">
            <thead>
              <tr>
                <th className="table-header corner-cell">Manner ↓ \ Place →</th>
                {placeOrder.map(place => (
                  <th key={place} className="table-header">
                    {place}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mannerOrder.map(manner => {
                const hasData = placeOrder.some(place => consonantChartData[place]?.[manner]);
                if (!hasData) return null;

                return (
                  <tr key={manner}>
                    <td className="manner-cell">
                      {manner}
                    </td>
                    {placeOrder.map(place => {
                      const cell = consonantChartData[place]?.[manner];
                      if (!cell) {
                        return <td key={`${place}-${manner}`} className="empty-table-cell"></td>;
                      }
                      return (
                        <ConsonantCellComponent
                          key={`${place}-${manner}`}
                          cell={cell}
                          currentlyPlaying={currentlyPlaying}
                          setCurrentlyPlaying={setCurrentlyPlaying}
                          muted={muted}
                        />
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'non-pulmonic' && (
        <div className="non-pulmonic-section">
          <div className="section-card">
            <h3 className="section-title">
              <ChevronDownIcon size={20} />
              Clicks
            </h3>
            <div className="clicks-grid">
              {[
                { symbol: 'ʘ', name: 'Bilabial click', example: 'kiss sound', audioFile: 'bilabial-click.mp3' },
                { symbol: 'ǀ', name: 'Dental click', example: 'tsk tsk', audioFile: 'dental-click.mp3' },
                { symbol: 'ǃ', name: 'Postalveolar click', example: 'horse riding sound', audioFile: 'alveolar-click.mp3' },
                { symbol: 'ǂ', name: 'Palatal click', example: 'South African languages', audioFile: 'palatal-click.mp3' },
                { symbol: 'ǁ', name: 'Lateral click', example: 'clicking sound', audioFile: 'lateral-click.mp3' }
              ].map(click => (
                <SoundCard key={click.symbol} sound={click} muted={muted} setCurrentlyPlaying={setCurrentlyPlaying} />
              ))}
            </div>
          </div>

          <div className="section-card">
            <h3 className="section-title">Implosives</h3>
            <div className="implosives-grid">
              {[
                { symbol: 'ɓ', name: 'Voiced bilabial implosive', audioFile: 'b-hook.mp3' },
                { symbol: 'ɗ', name: 'Voiced alveolar implosive', audioFile: 'd-hook.mp3' },
                { symbol: 'ʄ', name: 'Voiced palatal implosive', audioFile: 'j-hook.mp3' },
                { symbol: 'ɠ', name: 'Voiced velar implosive', audioFile: 'g-hook.mp3' },
                { symbol: 'ʛ', name: 'Voiced uvular implosive', audioFile: 'g-cap-hook.mp3' }
              ].map(implosive => (
                <SoundCard key={implosive.symbol} sound={implosive} muted={muted} setCurrentlyPlaying={setCurrentlyPlaying} />
              ))}
            </div>
          </div>

          <div className="section-card">
            <h3 className="section-title">Ejectives</h3>
            <div className="ejectives-grid">
              {[
                { symbol: 'pʼ', name: 'Bilabial ejective', audioFile: 'p-ejective.mp3' },
                { symbol: 'tʼ', name: 'Alveolar ejective', audioFile: 't-ejective.mp3' },
                { symbol: 'kʼ', name: 'Velar ejective', audioFile: 'k-ejective.mp3' },
                { symbol: 'sʼ', name: 'Alveolar fricative ejective', audioFile: 's-ejective.mp3' },
                { symbol: 'ʃʼ', name: 'Postalveolar fricative ejective', audioFile: 'esh-ejective.mp3' },
                { symbol: 'tsʼ', name: 'Alveolar affricate ejective', audioFile: 'ts-ejective.mp3' },
                { symbol: 'tʃʼ', name: 'Postalveolar affricate ejective', audioFile: 't-esh-ejective.mp3' }
              ].map(ejective => (
                <SoundCard key={ejective.symbol} sound={ejective} muted={muted} setCurrentlyPlaying={setCurrentlyPlaying} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="chart-footer">
        <p>Audio files should be placed in the <code>/public/audio/</code> directory with filenames matching the IPA symbols.</p>
        <p>Example: <code>/public/audio/p.mp3</code>, <code>/public/audio/ʃ.mp3</code>, etc.</p>
      </div>
    </div>
  );
};

// Sound Card Component for non-pulmonic sounds
const SoundCard = ({ sound, muted, setCurrentlyPlaying }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const audio = new Audio(`/audio/${sound.audioFile}`);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    };
    audio.onerror = () => {
      setAudioError(true);
    };
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [sound.audioFile, setCurrentlyPlaying]);

  const playAudio = () => {
    if (isPlaying || muted || !audioRef.current) return;

    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
    }

    audioRef.current.play()
      .then(() => {
        window.currentAudio = audioRef.current;
        setIsPlaying(true);
        setCurrentlyPlaying(sound.symbol);
      })
      .catch((err) => {
        console.error('Playback failed:', err);
        setAudioError(true);
      });
  };

  return (
    <div className="sound-card">
      <div>
        <span className="sound-symbol">{sound.symbol}</span>
        <p className="sound-name">{sound.name}</p>
      </div>
      <button
        onClick={playAudio}
        disabled={isPlaying || muted}
        className="play-button-small"
        title={audioError ? `No audio file for ${sound.name}` : `Play ${sound.name}`}
      >
        {isPlaying ? <Volume2Icon size={14} /> : <PlayIcon size={14} />}
      </button>
    </div>
  );
};

export default IPAConsonantChart;