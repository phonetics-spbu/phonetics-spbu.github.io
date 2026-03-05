import { useState, useRef, useEffect } from 'react';
import './Keyboard.css';
import SideMenu from "../../components/SideMenu/SideMenu";
import './Keyboard.css'; // Создайте этот файл для стилей

function Keyboard() {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(32); // Начальный размер шрифта
    const [letterReplaceEnabled, setLetterReplaceEnabled] = useState(true); // Toggle state for letter replacements

    // Маппинг для цифр в спец символы
    const digitToSuperscript = {
        '1': 'ˎ',
        '2': 'ˋ',
        '3': 'ˏ',
        '4': 'ˊ',
        '5': 'ˇ',
        '6': 'ˆ',
        '7': '˃',
    };

    // Маппинг для пунктуации
    const punctuationMap = {
        '\'': 'ˈ',
        '"': 'ˌ',
        '*': '˚',
        '%': '˳',
        '_': 'ˉ',
        '<': '↗',
        '>': '↘',
        '!': '↑',
        '\\': '‖',
        '#': '┆',
        '$': '⌇',
        ':': 'ː',
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

            if (digitToSuperscript.hasOwnProperty(e.key)) {
                replacement = digitToSuperscript[e.key];
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

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        let processedText = '';

        for (let char of pastedText) {
            if (digitToSuperscript.hasOwnProperty(char)) {
                processedText += digitToSuperscript[char];
            } else if (punctuationMap.hasOwnProperty(char)) {
                processedText += punctuationMap[char];
            } else if (letterReplaceEnabled && letterMap.hasOwnProperty(char)) {
                // Only replace letters if the toggle is enabled
                processedText += letterMap[char];
            } else {
                processedText += char;
            }
        }

        insertAtCursor(processedText);
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
                            <div className="toggle-controls">
                                <button 
                                    onClick={toggleLetterReplace} 
                                    className={`toggle-btn ${letterReplaceEnabled ? 'active' : 'inactive'}`}
                                    title={letterReplaceEnabled ? "Отключить замену букв" : "Включить замену букв"}
                                >
                                    <span className="toggle-icon">{letterReplaceEnabled ? '🔊' : '🔇'}</span>
                                    <span className="toggle-text">
                                        {letterReplaceEnabled ? 'Замена букв: ВКЛ' : 'Замена букв: ВЫКЛ'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <textarea
                            ref={inputRef}
                            id="textInput"
                            placeholder="Введите текст или нажмите кнопки для вставки специальных символов..."
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
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
                        </div>

                        <div className="info">
                            <h3>Информация о клавиатуре:</h3>
                            <p><strong>Замена букв:</strong> <span className={letterReplaceEnabled ? 'status-on' : 'status-off'}>
                                {letterReplaceEnabled ? 'ВКЛЮЧЕНА' : 'ВЫКЛЮЧЕНА'}
                            </span></p>
                            <p><strong>Когда включена:</strong> Следующие буквы заменяются на фонетические символы:</p>
                            <div className="mapping-preview">
                                {Object.entries(letterMap).map(([key, value]) => (
                                    <div key={key} className="mapping-item">
                                        {key} → {value}
                                    </div>
                                ))}
                            </div>
                            <p><strong>Цифры:</strong> Заменяются на знаки тонов (1→ˎ, 2→ˋ, 3→ˏ, 4→ˊ, 5→ˇ, 6→ˆ, 7→˃)</p>
                            <p><strong>Пунктуация:</strong> Заменяется специальными символами:</p>
                            <ul>
                                <li><strong>'</strong> → ˈ (ударение)</li>
                                <li><strong>"</strong> → ˌ (второстепенное ударение)</li>
                                <li><strong>*</strong> → ˚ (кружок)</li>
                                <li><strong>%</strong> → ˳ (подстрочный кружок)</li>
                                <li><strong>_</strong> → ˉ (высокая предшкала)</li>
                                <li><strong>&lt;</strong> → ↗ (восходящая шкала)</li>
                                <li><strong>&gt;</strong> → ↘ (нисходящая шкала)</li>
                                <li><strong>!</strong> → ↑ (ресеттинг деклинации)</li>
                                <li><strong>\</strong> → ‖ (фразовая граница)</li>
                                <li><strong>#</strong> → ┆ (пунктирная граница)</li>
                                <li><strong>$</strong> → ⌇ (волнистая граница)</li>
                                <li><strong>:</strong> → ː (долгота)</li>
                            </ul>
                            <p><em>Примечание: Кнопки со специальными символами всегда работают независимо от переключателя.</em></p>
                        </div>
                    </div>
                )}
            </div>
            <div className="mobile_side_menu"><SideMenu /></div>
        </div>
    );
}

export default Keyboard;