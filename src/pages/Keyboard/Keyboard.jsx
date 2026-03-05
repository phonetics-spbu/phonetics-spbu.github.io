import { useState, useRef, useEffect } from 'react';
import './Keyboard.css';
import SideMenu from "../../components/SideMenu/SideMenu";
import './Keyboard.css'; // Создайте этот файл для стилей

function Keyboard() {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(true);

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
        '!': '¡',
        '?': '¿',
        '.': '·',
        ',': '‚',
        ';': ';',
        ':': 'ː',
        '&': '⅋'
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
            const event = new Event('textarea', { bubbles: true });
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

    return (
        <div className="chapter-page">
            <div className="chapter-page-content">
                {loading && <div className="loading">Загрузка...</div>}
                {!loading && (
                    <div className="container">
                        <h2>Клавиатура для транскрипции и интонационной разметки</h2>

                        <textarea
                            ref={inputRef}
                            type="text"
                            id="textInput"
                            placeholder="Введите текст или нажмите кнопки для вставки специальных символов..."
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            className="special-input"
                        />

                        <div className="button-grid_7">
                            {['ˎ', 'ˋ', 'ˏ', 'ˊ', 'ˇ', 'ˆ', '˃'].map(char => (
                                <button
                                    key={char}
                                    className="special-btn"
                                    onClick={() => handleSpecialCharClick(char)}
                                >
                                    {char}
                                </button>
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

                        <div>
                            <button className="clear-btn" onClick={handleClear}>
                                Очистить всё
                            </button>
                        </div>

                        <div className="info">
                            <h3>Информация о клавиатуре:</h3>
                            <p><strong>Цифры (0-9):</strong> Заменяются на верхний индекс (⁰-⁹)</p>
                            <p><strong>Пунктуация:</strong> Заменяется специальными символами:</p>
                            <ul>
                                <li><strong>!</strong> → ¡ (перевернутый восклицательный знак)</li>
                                <li><strong>?</strong> → ¿ (перевернутый вопросительный знак)</li>
                                <li><strong>.</strong> → · (средняя точка)</li>
                                <li><strong>,</strong> → ‚ (нижняя запятая)</li>
                                <li><strong>;</strong> → ; (греческий вопросительный знак)</li>
                                <li><strong>:</strong> → ː (треугольное двоеточие)</li>
                                <li><strong>&</strong> → ⅋ (перевернутый амперсанд)</li>
                            </ul>
                            <p><strong>Все остальные клавиши:</strong> Работают обычно</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="mobile_side_menu"><SideMenu /></div>
        </div>
    );
}

export default Keyboard;