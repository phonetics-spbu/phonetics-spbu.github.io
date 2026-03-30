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

const symbolMap = {
    // Plosives
    'p': 'p',
    'b': 'b',
    't': 't',
    'd': 'd',
    'ʈ': 't-retroflex',
    'ɖ': 'd-retroflex',
    'd̪': 'd-dental',
    't̪': 't-dental',
    'c': 'c',
    'ɟ': 'j-bar',
    'k': 'k',
    'ɡ': 'g',
    'q': 'q',
    'ɢ': 'g-cap',
    'ʔ': 'glottal-stop',

    // Nasals
    'm': 'm',
    'ɱ': 'm-dental',
    'n': 'n',
    'n̪': 'n-dental',
    'ɲ': 'n-tilde',
    'ŋ': 'n-eng',
    'ɳ': 'n-retroflex',
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
    'ɾ': 'r-alveolar-tap',
    'ɽ': 'r-retroflex-flap',
    'ⱱ': 'v-alveolar-flap',

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

// Helper function to get audio file path
const getAudioPath = (symbol) => {
  const fileName = symbolMap[symbol] || symbol.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  return `/audio/ipa_chart/${fileName}.wav`;
};

const getImgPath = (symbol) => {
  const fileName = symbolMap[symbol] || symbol.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  return `/img/ipa_chart/${fileName}.png`;
};

// Audio Player Component with real audio files
// Audio Player Component - optimized for short audio (1 word)
const AudioPlayer = ({ consonant, isPlaying, onPlay }) => {
  const audioRef = useRef(null);
  const [error, setError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 1. Initialize Audio Object once
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const handleCanPlay = () => {
      setIsReady(true);
      setError(false);
    };

    const handleError = () => {
      console.error(`Audio error for: ${consonant.symbol}`);
      setError(true);
      if (isPlaying) onPlay(false); // Reset parent state
    };

    const handleEnded = () => {
      if (onPlay) onPlay(false); // Signal parent that sound finished
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // 2. Update Source when consonant changes
  useEffect(() => {
    if (!audioRef.current) return;

    setIsReady(false);
    setError(false);

    const path = getAudioPath(consonant.symbol);
    audioRef.current.src = path;
    audioRef.current.load(); // Force browser to buffer
  }, [consonant.symbol]);

  const handlePlayClick = async () => {
    if (error || !audioRef.current) return;

    try {
      // Reset to start (fixes the "click" if played rapidly)
      audioRef.current.currentTime = 0;

      // Signal parent we started playing
      if (onPlay) onPlay(true);

      await audioRef.current.play();
    } catch (err) {
      console.error("Playback failed:", err);
      if (onPlay) onPlay(false);
    }
  };

  // Determine button state
  const isLoading = !isReady && !error;
  const isDisabled = isPlaying || isLoading;

  return (
    <button
      onClick={handlePlayClick}
      disabled={isDisabled}
      className={`audio-button ${isPlaying ? 'playing' : ''} ${error ? 'error' : ''}`}
      title={error ? "File not found" : `Play ${consonant.name}`}
    >
      {isLoading ? (
        <div className="spinner" />
      ) : error ? (
        <span>⚠️</span>
      ) : isPlaying ? (
        <Volume2Icon size={14} />
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
      voiceless: { symbol: 'p', name: 'Глухой губно-губной взрывной', example: '[pat̪ʉ]', translation: 'Десять', lang: 'Тамильский' },
      voiced: { symbol: 'b', name: 'Звонкий губно-губной взрывной', example: '[bak]', translation: 'Бак', lang: 'Беларусский' }
    },
    'Носовые': {
      voiced: { symbol: 'm', name: 'Губно-губной носовой', example: '[ˈmɪlɪt]', translation: 'Просо', lang: 'Британский английский' }
    },
    'Фрикативные': {
      voiceless: { symbol: 'ɸ', name: 'Глухой губно-губной фрикативный', example: '[ˈɸɛːɬ]', translation: 'Кряква', lang: 'Сери' },
      voiced: { symbol: 'β', name: 'Звонкий губно-губной фрикативный', example: '[kaˈβaʝo]', translation: 'Лошадь', lang: 'Испанский' }
    },
    'Дрожащие': {
      voiced: { symbol: 'ʙ', name: 'Губно-губной дрожащий', example: '[tʙ̩]', translation: 'Боб', lang: 'Лизу' }
    }
  },
  'Губно-зубные': {
    'Носовые': {
      voiced: { symbol: 'ɱ', name: 'Губно-зубной носовой', example: '[liɱˈfɛr.no]', translation: 'Ад', lang: 'Итальянский' }
    },
    'Фрикативные': {
      voiceless: { symbol: 'f', name: 'Глухой губно-зубной фрикативный', example: '[fúːꜝlá]', translation: ' Раздеваться', lang: 'Бемба' },
      voiced: { symbol: 'v', name: 'Звонкий губно-зубной фрикативный', example: '[vaaz]', translation: 'Ваза', lang: 'Ямайский креольский' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ʋ', name: 'Губно-зубной аппроксимант', example: '[ɐːʋu]', translation: 'Корова', lang: 'Телугу' }
    },
    'Одноударные': {
      voiced: { symbol: 'ⱱ', name: 'Губно-зубной одноударный', example: '[kə́ⱱà]', translation: 'Посылать', lang: 'Моно' }
    },
  },
  'Зубные': {
    'Фрикативные': {
      voiceless: { symbol: 'θ', name: 'Глухой зубной фрикативный', example: '[aˈθa]', translation: 'Огонь', lang: 'Умбуйгаму' },
      voiced: { symbol: 'ð', name: 'Звонкий зубной фрикативный', example: '[ðraɪɡ]', translation: 'Дракон', lang: 'Валлийский' }
    },
    'Взрывные': {
      voiceless: { symbol: 't̪', name: 'Глухой зубной взрывной', example: '[ˈtapka]', translation: 'Тапка', lang: 'Русский' },
      voiced: { symbol: 'd̪', name: 'Звонкий зубной взрывной', example: '[dom]', translation: 'Дом', lang: 'Болгарский' }
    },
    'Носовые': {
      voiced: { symbol: 'n̪', name: 'Зубной носовой', example: '[an̪ɐkɐ]', translation: 'Промок', lang: 'Аранта' }
    },
  },
  'Альвеолярные': {
    'Взрывные': {
      voiceless: { symbol: 't', name: 'Глухой альвеолярный взрывной', example: '[topa]', translation: 'Кровать', lang: 'Чикасо' },
      voiced: { symbol: 'd', name: 'Звонкий альвеолярный взрывной', example: '[daun]', translation: 'Лист', lang: 'Кедаянский' }
    },
    'Носовые': {
      voiced: { symbol: 'n', name: 'Альвеолярный носовой', example: '[nanɨˀɨ]', translation: 'Госпожа', lang: 'Тилькиапанский сапотекский' }
    },
    'Фрикативные': {
      voiceless: { symbol: 's', name: 'Глухой альвеолярный фрикативный', example: '[so²¹]', translation: 'Ходить', lang: 'Цзайва' },
      voiced: { symbol: 'z', name: 'Звонкий альвеолярный фрикативный', example: '[zɔ̀ɔrɛ́ɛ]', translation: 'Шить', lang: 'Кера' }
    },
    'Латеральные фрикативные': {
      voiceless: { symbol: 'ɬ', name: 'Глухой альвеолярный латеральный фрикативный', example: '[ɬar]', translation: 'Ручей', lang: 'Аварский' },
      voiced: { symbol: 'ɮ', name: 'Звонкий альвеолярный латеральный фрикативный', example: '[ɮèpti]', translation: 'Заплетание кос', lang: 'Тера' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ɹ', name: 'Альвеолярный аппроксимант', example: '[ɹɑm]', translation: 'Индийский бог Рама', lang: 'Ассамский' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'l', name: 'Альвеолярный латеральный аппроксимант', example: '[láːʔê]', translation: 'Заяц', lang: 'Сандаве' }
    },
    'Одноударные': {
      voiced: { symbol: 'ɾ', name: 'Альвеолярный одноударный', example: '[ˈaɾan]', translation: 'Хлеб', lang: 'Шотландский гэльский' }
    },
    'Дрожащие': {
      voiced: { symbol: 'r', name: 'Альвеолярный дрожащий', example: '[rèt]', translation: 'Солнце', lang: 'Темне' }
    }
  },
  'Постальвеолярные': {
    'Фрикативные': {
      voiceless: { symbol: 'ʃ', name: 'Глухой постальвеолярный фрикативный', example: '[ʃa]', translation: 'Искать', lang: 'Бирманский' },
      voiced: { symbol: 'ʒ', name: 'Звонкий постальвеолярный фрикативный', example: '[ˈʒiːla]', translation: 'Вена', lang: 'Словенский' }
    },
  },
  'Ретрофлексные': {
    'Взрывные': {
      voiceless: { symbol: 'ʈ', name: 'Глухой ретрофлексный взрывной', example: '[ʈopi]', translation: 'Шапка', lang: 'Синдхи' },
      voiced: { symbol: 'ɖ', name: 'Звонкий ретрофлексный взрывной', example: '[ɖɤɾɤ]', translation: 'Кровь', lang: 'Мадурский' }
    },
    'Фрикативные': {
      voiceless: { symbol: 'ʂ', name: 'Глухой ретрофлексный фрикативный', example: '[ʂelɑ]', translation: 'Глина', lang: 'Юго-восточный пашаи' },
      voiced: { symbol: 'ʐ', name: 'Звонкий ретрофлексный фрикативный', example: '[ʐɐ̝ˈjën]', translation: 'Цветок', lang: 'Арауканский' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ɻ', name: 'Ретрофлексный аппроксимант', example: '[ɻeːʃ]', translation: 'Рвота', lang: 'Кумзари' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'ɭ', name: 'Ретрофлексный латеральный аппроксимант', example: '[aːɭi]', translation: 'Мясо / рыба', lang: 'Барди' }
    },
    'Носовые': {
      voiced: { symbol: 'ɳ', name: 'Ретрофлексный носовой', example: '[puɳu]', translation: 'Дерево', lang: 'Питжанджара' }
    },
    'Одноударные': {
      voiced: { symbol: 'ɽ', name: 'Ретрофлексный одноударный', example: '[bəɽɑ]', translation: 'Большой', lang: 'Хинди' }
    },
  },
  'Палатальные': {
    'Взрывные': {
      voiceless: { symbol: 'c', name: 'Глухой палатальный взрывной', example: '[ˈcelɲa]', translation: 'Мастерок', lang: 'Польский' },
      voiced: { symbol: 'ɟ', name: 'Звонкий палатальный взрывной', example: '[ˈɟaːr]', translation: 'Фабрика', lang: 'Венгерский' }
    },
    'Носовые': {
      voiced: { symbol: 'ɲ', name: 'Палатальный носовой', example: '[ɲàm]', translation: 'Продавать', lang: 'Ибибио' }
    },
    'Фрикативные': {
      voiceless: { symbol: 'ç', name: 'Глухой палатальный фрикативный', example: '[çim]', translation: 'Сила', lang: 'Корейский' },
      voiced: { symbol: 'ʝ', name: 'Звонкий палатальный фрикативный', example: '[ʝuːrd]', translation: 'Почва', lang: 'Шведский' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'j', name: 'Палатальный аппроксимант', example: '[ˈjiʒa]', translation: 'Еда', lang: 'Украинский' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'ʎ', name: 'Палатальный латеральный аппроксимант', example: '[ʎaʋi̞ː]', translation: 'Левый', lang: 'Словацкий' }
    }
  },
  'Велярные': {
    'Взрывные': {
      voiceless: { symbol: 'k', name: 'Глухой велярный взрывной', example: '[ˈkaki]', translation: 'Нога', lang: 'Кокосовый малайский' },
      voiced: { symbol: 'ɡ', name: 'Звонкий велярный взрывной', example: '[ɡɐ́m]', translation: 'Ночь', lang: 'Вайгео' }
    },
    'Носовые': {
      voiced: { symbol: 'ŋ', name: 'Велярный носовой', example: '[ŋú̙]', translation: 'Пить', lang: 'Игбо' }
    },
    'Фрикативные': {
      voiceless: { symbol: 'x', name: 'Глухой велярный фрикативный', example: '[ˈxəɾə]', translation: 'Осёл', lang: 'Мунджанский' },
      voiced: { symbol: 'ɣ', name: 'Звонкий велярный фрикативный', example: '[ʔi.ˈɣaː]', translation: 'Шерсть', lang: 'Хикарильянский апаче' }
    },
    'Аппроксиманты': {
      voiced: { symbol: 'ɰ', name: 'Велярный аппроксимант', example: '[ɰɔh]', translation: 'Ветка', lang: 'Мах Мери' }
    },
    'Латеральные аппроксиманты': {
      voiced: { symbol: 'ʟ', name: 'Велярный латеральный аппроксимант', example: '[paᶢʟa]', translation: 'Забор', lang: 'Мелпа' }
    }
  },
  'Увулярные': {
    'Взрывные': {
      voiceless: { symbol: 'q', name: 'Глухой увулярный взрывной', example: '[qalb]', translation: 'Сердце', lang: 'Арабский' },
      voiced: { symbol: 'ɢ', name: 'Звонкий увулярный взрывной', example: '[ɢæhˈve]', translation: 'Кофе', lang: 'Персидский' }
    },
    'Носовые': {
      voiced: { symbol: 'ɴ', name: 'Увулярный носовой', example: '[ɖàɴ]', translation: 'Орхидея', lang: 'Японский' }
    },
    'Фрикативные': {
      voiceless: { symbol: 'χ', name: 'Глухой увулярный фрикативный', example: '[aːχt]', translation: 'Восемь', lang: 'Люксембургский' },
      voiced: { symbol: 'ʁ', name: 'Звонкий увулярный фрикативный', example: '[ʁu]', translation: 'Колесо', lang: 'Французский' }
    },
    'Дрожащие': {
      voiced: { symbol: 'ʀ', name: 'Увулярный дрожащий', example: '[ʀiːst]', translation: 'Рис', lang: 'Нидерландский' }
    }
  },
  'Фарингальные': {
    'Фрикативные': {
      voiceless: { symbol: 'ħ', name: 'Глухой фарингальный фрикативный', example: '[maˈħar]', translation: 'Завтра', lang: 'Иврит' },
      voiced: { symbol: 'ʕ', name: 'Звонкий фарингальный фрикативный', example: '[buʕːu]', translation: 'Монстр', lang: 'Шильхский' }
    }
  },
  'Ларингальные': {
    'Взрывные': {
      voiceless: { symbol: 'ʔ', name: 'Гортанная смычка', example: '[ˈʔaka]', translation: 'Смех', lang: 'Гавайский' }
    },
    'Фрикативные': {
      voiceless: { symbol: 'h', name: 'Глухой гортанный фрикативный', example: '[hɑt͡sɑɾ]', translation: 'Ключ', lang: 'Азербайдджанский' },
      voiced: { symbol: 'ɦ', name: 'Звонкий гортанный фрикативный', example: '[ˈɦora]', translation: 'Гора', lang: 'Чешский' }
    }
  }
};

const mannerOrder = [
  'Взрывные', 'Носовые', 'Дрожащие', 'Одноударные', 'Фрикативные', 'Латеральные фрикативные',
  'Аппроксиманты', 'Латеральные аппроксиманты'
];

const placeOrder = [
  'Губно-губные', 'Губно-зубные', 'Зубные', 'Альвеолярные', 'Постальвеолярные',
  'Ретрофлексные', 'Палатальные', 'Велярные', 'Увулярные', 'Фарингальные', 'Ларингальные'
];

// Consonant Cell Component
const ConsonantCellComponent = ({ cell, currentlyPlaying, setCurrentlyPlaying }) => {
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
          <div>
              <div className="consonant-symbol">{consonant.symbol}</div>
              <AudioPlayer
                consonant={consonant}
                isPlaying={isPlaying}
                onPlay={() => setCurrentlyPlaying(isPlaying ? null : consonant.symbol)}
              />
          </div>
          <span>
          <img className="consonant-img" src={getImgPath(consonant.symbol)}/>
          <div className="example">{consonant.example}</div>
          <div className="translation">{consonant.translation}</div>
          <div className="lang-name">{consonant.lang}</div>
          </span>
        </div>
        {hovered === consonant.symbol && (
          <div className="tooltip">
            <div className="tooltip-name">{consonant.name}</div>
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

  useEffect(() => {
    if (currentlyPlaying) {
      const timer = setTimeout(() => {
        setCurrentlyPlaying(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentlyPlaying]);

  return (
    <div className="ipa-chart-container">
      <div className="chart-header">
        <div>
          <h1 className="chart-title">МФАзбука</h1>
        </div>
      </div>

      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('pulmonic')}
          className={`tab-button ${activeTab === 'pulmonic' ? 'active' : ''}`}
        >
          Дыхательные согласные
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
                <SoundCard key={click.symbol} sound={click} setCurrentlyPlaying={setCurrentlyPlaying} />
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
                <SoundCard key={implosive.symbol} sound={implosive} setCurrentlyPlaying={setCurrentlyPlaying} />
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
                <SoundCard key={ejective.symbol} sound={ejective} setCurrentlyPlaying={setCurrentlyPlaying} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sound Card Component for non-pulmonic sounds
const SoundCard = ({ sound, setCurrentlyPlaying }) => {
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
    if (isPlaying || !audioRef.current) return;

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
        disabled={isPlaying}
        className="play-button-small"
        title={audioError ? `No audio file for ${sound.name}` : `Play ${sound.name}`}
      >
        {isPlaying ? <Volume2Icon size={14} /> : <PlayIcon size={14} />}
      </button>
    </div>
  );
};

export default IPAConsonantChart;