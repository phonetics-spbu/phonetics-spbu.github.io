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
  'Губно-губные': {
    'Взрывные': {
      voiceless: { symbol: 'p', name: 'Глухой губно-губной взрывной', example: 'pat' },
      voiced: { symbol: 'b', name: 'Звонкий губно-губной взрывной', example: 'bat' }
    },
    'Носовые': {
      voiced: { symbol: 'm', name: 'Губно-губной носовой', example: 'mat' }
    },
    'Щелевые': {
      voiceless: { symbol: 'ɸ', name: 'Глухой губно-губной щелевой', example: 'Japanese "fu"' },
      voiced: { symbol: 'β', name: 'Звонкий губно-губной щелевой', example: 'Spanish "haber"' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'β̞', name: 'Губно-губной аппроксимант', example: 'Spanish "lobo"' }
    },
    'Дрожащие': {
      voiced: { symbol: 'ʙ', name: 'Губно-губной дрожащий', example: 'raspberry sound' }
    }
  },
  'Губно-зубные': {
    'Носовые': {
      voiced: { symbol: 'ɱ', name: 'Губно-зубной носовой', example: 'emphasis' }
    },
    'Щелевые': {
      voiceless: { symbol: 'f', name: 'Глухой губно-зубной щелевой', example: 'fat' },
      voiced: { symbol: 'v', name: 'Звонкий губно-зубной щелевой', example: 'vat' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ʋ', name: 'Губно-зубной аппроксимант', example: 'Dutch "west"' }
    },
    'Одноударные': {
      voiced: { symbol: 'ⱱ', name: 'Губно-зубной одноударный', example: 'American English "butter"' }
    },
  },
  'Зубные': {
    'Щелевые': {
      voiceless: { symbol: 'θ', name: 'Глухой зубной щелевой', example: 'thin' },
      voiced: { symbol: 'ð', name: 'Звонкий зубной щелевой', example: 'this' }
    },
    'Взрывные': {
      voiceless: { symbol: 't̪', name: 'Глухой зубной взрывной', example: 'Spanish "toro"' },
      voiced: { symbol: 'd̪', name: 'Звонкий зубной взрывной', example: 'Spanish "donde"' }
    },
    'Носовые': {
      voiced: { symbol: 'n̪', name: 'Зубной носовой', example: 'no' }
    },
  },
  'Альвеолярные': {
    'Взрывные': {
      voiceless: { symbol: 't', name: 'Глухой альвеолярный взрывной', example: 'top' },
      voiced: { symbol: 'd', name: 'Звонкий альвеолярный взрывной', example: 'dog' }
    },
    'Носовые': {
      voiced: { symbol: 'n', name: 'Альвеолярный носовой', example: 'no' }
    },
    'Щелевые': {
      voiceless: { symbol: 's', name: 'Глухой альвеолярный щелевой', example: 'sit' },
      voiced: { symbol: 'z', name: 'Звонкий альвеолярный щелевой', example: 'zoo' }
    },
    'Латеральные щелевые': {
      voiceless: { symbol: 'ɬ', name: 'Глухой альвеолярный латеральный щелевой', example: 'Welsh "llan"' },
      voiced: { symbol: 'ɮ', name: 'Звонкий альвеолярный латеральный щелевой', example: 'Zulu "dlala"' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ɹ', name: 'Альвеолярный аппроксимант', example: 'run' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'l', name: 'Альвеолярный латеральный аппроксимант', example: 'lip' }
    },
    'Одноударные': {
      voiced: { symbol: 'ɾ', name: 'Альвеолярный одноударный', example: 'American English "butter"' }
    },
    'Дрожащие': {
      voiced: { symbol: 'r', name: 'Альвеолярный дрожащий', example: 'Spanish "perro"' }
    }
  },
  'Постальвеолярные': {
    'Щелевые': {
      voiceless: { symbol: 'ʃ', name: 'Глухой постальвеолярный щелевой', example: 'ship' },
      voiced: { symbol: 'ʒ', name: 'Звонкий постальвеолярный щелевой', example: 'vision' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ɹ̠', name: 'Постальвеолярный аппроксимант', example: 'red (retroflex)' }
    },
    'Носовые': {
      voiced: { symbol: 'n̠', name: 'Постальвеолярный носовой', example: 'no' }
    },
  },
  'Ретрофлексные': {
    'Взрывные': {
      voiceless: { symbol: 'ʈ', name: 'Глухой ретрофлексный взрывной', example: 'Swedish "parti"' },
      voiced: { symbol: 'ɖ', name: 'Звонкий ретрофлексный взрывной', example: 'Swedish "ord"' }
    },
    'Щелевые': {
      voiceless: { symbol: 'ʂ', name: 'Глухой ретрофлексный щелевой', example: 'Mandarin "sh"' },
      voiced: { symbol: 'ʐ', name: 'Звонкий ретрофлексный щелевой', example: 'Polish "ż"' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ɻ', name: 'Ретрофлексный аппроксимант', example: 'Tamil "zh"' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'ɭ', name: 'Ретрофлексный латеральный аппроксимант', example: 'Swedish "pärla"' }
    },
    'Носовые': {
      voiced: { symbol: 'ɳ', name: 'Ретрофлексный носовой', example: 'no' }
    },
    'Одноударные': {
      voiced: { symbol: 'ɽ', name: 'Ретрофлексный одноударный', example: 'American English "butter"' }
    },
  },
  'Палатальные': {
    'Взрывные': {
      voiceless: { symbol: 'c', name: 'Глухой палатальный взрывной', example: 'Hungarian "tyúk"' },
      voiced: { symbol: 'ɟ', name: 'Звонкий палатальный взрывной', example: 'Hungarian "gyár"' }
    },
    'Носовые': {
      voiced: { symbol: 'ɲ', name: 'Палатальный носовой', example: 'Spanish "niño"' }
    },
    'Щелевые': {
      voiceless: { symbol: 'ç', name: 'Глухой палатальный щелевой', example: 'German "ich"' },
      voiced: { symbol: 'ʝ', name: 'Звонкий палатальный щелевой', example: 'Spanish "yo"' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'j', name: 'Палатальный аппроксимант', example: 'yes' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'ʎ', name: 'Палатальный латеральный аппроксимант', example: 'Italian "gli"' }
    }
  },
  'Велярные': {
    'Взрывные': {
      voiceless: { symbol: 'k', name: 'Глухой велярный взрывной', example: 'cat' },
      voiced: { symbol: 'g', name: 'Звонкий велярный взрывной', example: 'go' }
    },
    'Носовые': {
      voiced: { symbol: 'ŋ', name: 'Велярный носовой', example: 'sing' }
    },
    'Щелевые': {
      voiceless: { symbol: 'x', name: 'Глухой велярный щелевой', example: 'Scottish "loch"' },
      voiced: { symbol: 'ɣ', name: 'Звонкий велярный щелевой', example: 'Spanish "amigo"' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ɰ', name: 'Велярный аппроксимант', example: 'Japanese "u"' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'ʟ', name: 'Велярный латеральный аппроксимант', example: 'Mid-Waghi' }
    }
  },
  'Увулярные': {
    'Взрывные': {
      voiceless: { symbol: 'q', name: 'Глухой увулярный взрывной', example: 'Arabic "qasr"' },
      voiced: { symbol: 'ɢ', name: 'Звонкий увулярный взрывной', example: 'Persian "q"' }
    },
    'Носовые': {
      voiced: { symbol: 'ɴ', name: 'Увулярный носовой', example: 'Japanese "n" before g/k' }
    },
    'Щелевые': {
      voiceless: { symbol: 'χ', name: 'Глухой увулярный щелевой', example: 'French "rue"' },
      voiced: { symbol: 'ʁ', name: 'Звонкий увулярный щелевой', example: 'French "rouge"' }
    },
    'Дрожащие': {
      voiced: { symbol: 'ʀ', name: 'Увулярный дрожащий', example: 'French "r" (some dialects)' }
    }
  },
  'Фарингальные': {
    'Щелевые': {
      voiceless: { symbol: 'ħ', name: 'Глухой фарингальный щелевой', example: 'Arabic "ح"' },
      voiced: { symbol: 'ʕ', name: 'Звонкий фарингальный щелевой', example: 'Arabic "ع"' }
    }
  },
  'Ларингальные': {
    'Взрывные': {
      voiceless: { symbol: 'ʔ', name: 'Гортанная смычка', example: 'uh-oh' }
    },
    'Щелевые': {
      voiceless: { symbol: 'h', name: 'Глухой гортанный щелевой', example: 'hat' },
      voiced: { symbol: 'ɦ', name: 'Звонкий гортанный щелевой', example: 'behind' }
    }
  }
};

const mannerOrder = [
  'Взрывные', 'Носовые', 'Дрожащие', 'Одноударные', 'Щелевые', 'Латеральные щелевые',
  'Аппроксиманты', 'Латеральные аппроксиманты'
];

const placeOrder = [
  'Губно-губные', 'Губно-зубные', 'Зубные', 'Альвеолярные', 'Постальвеолярные',
  'Ретрофлексные', 'Палатальные', 'Велярные', 'Увулярные', 'Фарингальные', 'Ларингальные'
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
          <h1 className="chart-title">МФАзбука</h1>
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
                <th className="table-header corner-cell">Способ образования ↓ \ Место образования →</th>
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