import { useState, useRef, useEffect } from 'react';
import './Keyboard.css';
import SideMenu from "../../components/SideMenu/SideMenu";
import './Keyboard.css'; 

function Keyboard() {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(32); // Начальный размер шрифта
    const [letterReplaceEnabled, setLetterReplaceEnabled] = useState(true); // Toggle state for letter replacements

    const digitMap = {
        '1': 'ˎ',
        '2': 'ˋ',
        '3': 'ˏ',
        '4': 'ˊ',
        '5': 'ˇ',
        '6': 'ˆ',
        '7': '˃',
    };

    const punctuationMap = {
        '\'': 'ˈ',
        '"': 'ˌ',
        '*': '˚',
        '%': '˳',
        '=': 'ˉ',
        '<': '↗',
        '>': '↘',
        '!': '↑',
        '\\': '‖',
        '#': '┆',
        '$': '⌇',
    };

    const letterMap = {
        'Z': 'ʒ',
        'S': 'ʃ',
        'N': 'ŋ',
        'I': 'ɪ',
        'U': 'ʊ',
        'T': 'θ',
        'D': 'ð',
        '@': 'ə',
        'E': 'ɜ',
        'O': 'ɔ',
        'A': 'ɑ',
        'V': 'ʌ',
        'Q': 'ɒ',
        '{': 'æ',
        'G': 'ɡ',
        ':': 'ː',
        '+': '͡',
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const insertAtCursor = (text) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart;
        const end = input.selectionEnd;
        const currentValue = input.value;

        input.value = currentValue.substring(0, start) + text + currentValue.substring(end);
        input.selectionStart = input.selectionEnd = start + text.length;
        input.focus();
    };

    const handleKeyDown = (e) => {
        // Allow control keys
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
            e.key === 'Home' || e.key === 'End' || e.key === 'Tab' || e.ctrlKey || e.metaKey) {
            return;
        }

        if (e.key.length === 1) {
            e.preventDefault();

            let replacement = null;

            if (digitMap.hasOwnProperty(e.key)) {
                replacement = digitMap[e.key];
            } else if (punctuationMap.hasOwnProperty(e.key)) {
                replacement = punctuationMap[e.key];
            } else if (letterReplaceEnabled && letterMap.hasOwnProperty(e.key)) {
                // Only replace letters if the toggle is enabled
                replacement = letterMap[e.key];
            }

            const start = inputRef.current.selectionStart;
            const end = inputRef.current.selectionEnd;
            const text = inputRef.current.value;

            if (replacement) {
                inputRef.current.value = text.substring(0, start) + replacement + text.substring(end);
                inputRef.current.selectionStart = inputRef.current.selectionEnd = start + replacement.length;
            } else {
                inputRef.current.value = text.substring(0, start) + e.key + text.substring(end);
                inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 1;
            }

            // Trigger input event
            const event = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(event);
        }
    };

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    };

    const handleSpecialCharClick = (char) => {
        insertAtCursor(char);
    };

    const increaseFontSize = () => {
        setFontSize(prevSize => prevSize + 2); // Увеличиваем на 2px
    };

    const decreaseFontSize = () => {
        setFontSize(prevSize => Math.max(10, prevSize - 2)); // Уменьшаем, но не меньше 10px
    };

    const toggleLetterReplace = () => {
        setLetterReplaceEnabled(prev => !prev);
        // Keep focus on textarea after toggling
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleSaveToFile = () => {
        const content = inputRef.current?.value || '';
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transcription_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="chapter-page">
            <div className="chapter-page-content">
                {loading && <div className="loading">Загрузка...</div>}
                {!loading && (
                    <div className="container">
                        <h2>Клавиатура для транскрипции и интонационной разметки</h2>

                        <div className="textarea-controls">
                            <div className="font-size-controls">
                                <button onClick={decreaseFontSize} className="font-size-btn" title="Уменьшить шрифт">-</button>
                                <span className="font-size-display">{fontSize}px</span>
                                <button onClick={increaseFontSize} className="font-size-btn" title="Увеличить шрифт">+</button>
                            </div>

                            <button
                                onClick={toggleLetterReplace}
                                className={`toggle-btn ${letterReplaceEnabled ? 'active' : 'inactive'}`}
                                title={letterReplaceEnabled ? "Выключить режим фонетического ввода" : "Включить режим фонетического ввода"}>
                                <span className="toggle-text">
                                    {letterReplaceEnabled ? 'Фонетический ввод: ВКЛ' : 'Фонетический ввод: ВЫКЛ'}
                                </span>
                            </button>

                        </div>

                        <textarea
                            spellcheck="false"
                            ref={inputRef}
                            id="textInput"
                            placeholder="Введите текст"
                            onKeyDown={handleKeyDown}
                            className={`special-input ${letterReplaceEnabled ? 'letter-replace-on' : ''}`}
                            style={{ fontSize: `${fontSize}px` }}
                        />

                        <div className="button-grid_7">
                            {['ˎ', 'ˋ', 'ˏ', 'ˊ', 'ˇ', 'ˆ', '˃'].map(char => (
                                <div>
                                    <button
                                        key={char}
                                        className="special-btn"
                                        onClick={() => handleSpecialCharClick(char)}
                                    >
                                        {char}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="button-grid_7">
                            <span className="button-grid_5">
                                {['ʒ', 'ʃ', 'ŋ', 'ɪ', 'ʊ', 'θ', 'ð', 'ə', 'ɜː', 'ɔː', 'ɔ', 'æ', 'ʌ', 'ɑː', 'ɒ'].map(char => (
                                    <button
                                        key={char}
                                        className="special-btn"
                                        onClick={() => handleSpecialCharClick(char)}
                                    >
                                        {char}
                                    </button>
                                ))}
                            </span>
                            <span className="button-grid_4">
                                {['ˈ', 'ˌ', '˚', '˳', 'ˉ', '↑', '↗', '↘', '|', '‖', '┆', '⌇'].map(char => (
                                    <button
                                        key={char}
                                        className="special-btn"
                                        onClick={() => handleSpecialCharClick(char)}
                                    >
                                        {char}
                                    </button>
                                ))}
                            </span>
                        </div>

                        <div className="action-buttons">
                            <button className="clear-btn" onClick={handleClear}>
                                Очистить всё
                            </button>
                            <button className="save-btn" onClick={handleSaveToFile}>
                                Сохранить в файл
                            </button>
                        </div>

                        <div className="info">
                            <h3>Информация о клавиатуре:</h3>
                            <p><strong>Фонетический ввод:</strong> <span className={letterReplaceEnabled ? 'status-on' : 'status-off'}>
                                {letterReplaceEnabled ? 'включён' : 'выключен'}
                            </span></p>
                            
                            <div className="tables-container">
                                {/* First Table - Intonation Marks */}
                                <div className="table-wrapper">
                                    <h4>Интонационные символы</h4>
                                    <table className="symbol-table">
                                        <thead>
                                            <tr>
                                                <th>Символ</th>
                                                <th>Описание</th>
                                                <th>Что нажать</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>ˎyes</td><td>Low Fall</td><td>1</td></tr>
                                            <tr><td>ˋyes</td><td>High Fall</td><td>2</td></tr>
                                            <tr><td>ˏyes</td><td>Low Rise</td><td>3</td></tr>
                                            <tr><td>ˊyes</td><td>High Rise</td><td>4</td></tr>
                                            <tr><td>ˇyes</td><td>Fall-Rise</td><td>5</td></tr>
                                            <tr><td>ˆyes</td><td>Rise-Fall</td><td>6</td></tr>
                                            <tr><td>˃yes</td><td>Mid-Level</td><td>7</td></tr>
                                            <tr><td>ˈyes</td><td>High Accent</td><td>'</td></tr>
                                            <tr><td>ˌyes</td><td>Low Accent</td><td>"</td></tr>
                                            <tr><td>˚yes</td><td>Non-Low Unaccented</td><td>*</td></tr>
                                            <tr><td>˳yes</td><td>Low Unaccented</td><td>%</td></tr>
                                            <tr><td>ˉyes</td><td>High Pre-head</td><td>=</td></tr>
                                            <tr><td>↗</td><td>Rising Head</td><td>&lt;</td></tr>
                                            <tr><td>↘</td><td>Falling Head</td><td>&gt;</td></tr>
                                            <tr><td>↑</td><td>Declination Reset</td><td>!</td></tr>
                                            <tr><td>|</td><td>Tone Group Boundary</td><td>|</td></tr>
                                            <tr><td>‖</td><td>Phrase Boundary</td><td>\</td></tr>
                                            <tr><td>┆</td><td>Dashed Boundary</td><td>#</td></tr>
                                            <tr><td>⌇</td><td>Wavy Boundary</td><td>$</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Second Table - Phonetic Symbols */}
                                <div className="table-wrapper">
                                    <h4>Фонетические символы</h4>
                                    <table className="symbol-table">
                                        <thead>
                                            <tr>
                                                <th>Символ</th>
                                                <th>Описание</th>
                                                <th>Что нажать</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>ɡ</td><td>Voiced Velar Plosive</td><td>G</td></tr>
                                            <tr><td>θ</td><td>Voiceless Dental Fricative</td><td>T</td></tr>
                                            <tr><td>ð</td><td>Voiced Dental Fricative</td><td>D</td></tr>
                                            <tr><td>ʃ</td><td>Voiceless Postalveolar Fricative</td><td>S</td></tr>
                                            <tr><td>ʒ</td><td>Voiced Postalveolar Fricative</td><td>Z</td></tr>
                                            <tr><td>ŋ</td><td>Velar Nasal</td><td>N</td></tr>
                                            <tr><td>ɪ</td><td>KIT Vowel</td><td>I</td></tr>
                                            <tr><td>æ</td><td>TRAP Vowel</td><td>{'{'}</td></tr>
                                            <tr><td>ɒ</td><td>LOT Vowel</td><td>Q</td></tr>
                                            <tr><td>ʌ</td><td>STRUT Vowel</td><td>V</td></tr>
                                            <tr><td>ʊ</td><td>FOOT Vowel</td><td>U</td></tr>
                                            <tr><td>ɑ</td><td>PALM Vowel</td><td>A</td></tr>
                                            <tr><td>ɔ</td><td>THOUGHT Vowel</td><td>O</td></tr>
                                            <tr><td>ɜ</td><td>NURSE Vowel</td><td>E</td></tr>
                                            <tr><td>ə</td><td>Schwa</td><td>@</td></tr>
                                            <tr><td>ː</td><td>Length Mark</td><td>:</td></tr>
                                            <tr><td>t͡ʃ</td><td>Affricate Tie Bar</td><td>+</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <p><em>Примечание: ввод интонационных символов работает всегда, независимо от переключателя.</em></p>
                        </div>
                    </div>
                )}
            </div>
            <div className="mobile_side_menu"><SideMenu /></div>
        </div>
    );
}

export default Keyboard;