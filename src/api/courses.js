import { avar_intro_text, lm_intro_text, ling_programming_text } from "./courses_descriptions"

const coursesData = [
    {
        id: 'linear_models',
        title: "Линейные модели и фильтры",
        description: "Общая и прикладная фонетика",
        level: "bac",
        year: 3,
        long_description: lm_intro_text,
        author: "tityushina",
        chapters: [
            { id: 1, title: "Простая гармоника и гармонический сигнал. Колебание струны. Тембр.", filename: "lm_1.html" },
            { id: 2, title: "Цифровой и аналоговый сигнал. Дискретизация. Частота Найквиста.", filename: "lm_2.html" },
            { id: 3, title: "Действительное разложение в ряд Фурье", filename: "lm_3.html" },
            { id: 4, title: "Комплексный ряд Фурье", filename: "lm_4.html" },
            { id: 5, title: "Дискретное преобразование Фурье", filename: "lm_5.html" },
            { id: 6, title: "Быстрое преобразование Фурье", filename: "lm_6.html" },
            { id: 7, title: "Окна и свёртки", filename: "lm_8.html" },
            { id: 8, title: "Практические задачи", filename: "lm_7.html" },
            { id: 9, title: "Корреляция и автокорреляция", filename: "lm_9.html" },
            { id: 10, title: "Линейные системы и их свойства", filename: "lm_10.html" },
            { id: 11, title: "БИХ и КИХ фильтры", filename: "lm_11.html" },
            { id: 12, title: "Разностные уравнения для линейных систем", filename: "lm_12.html" },
            { id: 13, title: "z-преобразование", filename: "lm_13.html" },
            { id: 14, title: "Дискретное преобразование Фурье и круговая свёртка", filename: "lm_14.html" },
            { id: 15, title: "Проектирование фильтров", filename: "lm_15.html" },
            { id: 16, title: "Модуляция и демодуляция", filename: "lm_16.html" },
            { id: 17, title: "Шумы", filename: "lm_17.html" },
            { id: 18, title: "Преобразование частоты дискретизации", filename: "lm_18.html" },
            { id: 19, title: "Параметрический синтез", filename: "lm_18.html" },
            { id: 97, title: "Домашние задания", filename: "homework.html" },
            { id: 98, title: "Список литературы", filename: "lit.html" },
            { id: 99, title: "Вопросы к экзамену", filename: "exam_questions.html" },
        ]
    },
    {
        id: 'dsp',
        title: "Цифровая обработка сигналов",
        description: "Общая и прикладная фонетика",
        long_description: lm_intro_text,
        level: "bac",
        year: 4,
        author: "tityushina",
        chapters: [
            { id: 1, title: "Влияние фазы на восприятие", filename: "dsp_1.html" },
            { id: 2, title: "Дискретное косинусное преобразование", filename: "dsp_2.html" },
            { id: 3, title: "Гомоморфные системы: кепстр", filename: "dsp_3.html" },
            { id: 4, title: "Мел-кепстральные коэффициенты (MFCC)", filename: "dsp_4.html" },
        ]
    },
    {
        id: 'python_1_mag',
        title: "Основы программирования на языке Python",
        description: "Теория и история языка и языки народов Европы",
        long_description: "Теория и история языка и языки народов Европы, 1 курс магистратуры",
        level: "mag",
        year: 1,
        author: "tityushina",
        chapters: [
            { id: 1, title: "Переменные и типы данных", filename: "python_1_mag_1.html" },
            { id: 2, title: "Целочисленная арифметика, конструкция if", filename: "python_1_mag_2.html" },
            { id: 3, title: "Циклы", filename: "python_1_mag_3.html" },
            { id: 4, title: "Строки", filename: "python_1_mag_4.html" },
            { id: 5, title: "Списки", filename: "python_1_mag_5.html" },
            { id: 6, title: "Коллекции в Python", filename: "python_1_mag_6.html" },
            { id: 7, title: "Функции", filename: "python_1_mag_7.html" },
            { id: 8, title: "Работа с файлами", filename: "python_1_mag_8.html" },
            { id: 9, title: "Обработка исключений", filename: "python_1_mag_9.html" },
            { id: 10, title: "Построение графиков", filename: "python_1_mag_10.html" },
            { id: 11, title: "Дополнительные задачи", filename: "additional_tasks.html" },
        ]
    },
    {
        id: 'python_2_mag',
        title: "Основы программирования на языке Python (углубленный курс)",
        description: "Теория и история языка и языки народов Европы",
        long_description: "Теория и история языка и языки народов Европы, 2 курс магистратуры",
        level: "mag",
        year: 2,
        author: "tityushina",
        chapters: [
            { id: 1, title: "Повторение", filename: "python_2_mag_1.html" },
            { id: 2, title: "Классы в Python", filename: "python_2_mag_2.html" },
            { id: 3, title: "Работа с файлами разметки Praat", filename: "python_2_mag_3.html" },
            { id: 4, title: "Работа с аудио", filename: "python_2_mag_4.html" },
            { id: 5, title: "Pymorphy3", filename: "python_2_mag_5.html" },
        ]
    },
    {
        id: 'signal_proc_mag',
        title: 'Обработка и интерпретация речевого сигнала',
        description: 'Искусственный интеллект в моделировании речевой деятельности',
        long_description: 'Искусственный интеллект в моделировании речевой деятельности, 2 курс магистратуры',
        level: "mag",
        year: 2,
        author: "kholyavin",
        chapters: [
            { id: 1, title: "Повторение. Аналого-цифровое преобразование. Цифровое представление сигнала", filename: "signal_proc_mag_1.html" },
            { id: 2, title: "Обработка сигнала во временной области", filename: "signal_proc_mag_2.html" },
            { id: 3, title: "Обработка сигнала в частотной области", filename: "signal_proc_mag_3.html" },
            { id: 4, title: "Психоакустические шкалы", filename: "signal_proc_mag_4.html" },
            { id: 5, title: "Автоматическое определение ЧОТ", filename: "signal_proc_mag_5.html" },
            { id: 6, title: "Voice Activity Detection", filename: "signal_proc_mag_6.html" },
            { id: 7, title: "Моделирование мелодического контура", filename: "signal_proc_mag_7.html" },
            { id: 8, title: "Темпоральные характеристики", filename: "signal_proc_mag_8.html" },
            { id: 9, title: "PSOLA", filename: "signal_proc_mag_9.html" },
            { id: 10, title: "Автоматическая сегментация", filename: "signal_proc_mag_10.html" },
        ]
    },
    {
        id: 'english_phonetics',
        title: 'Практическая фонетика английского языка',
        description: 'Общая и прикладная фонетика, 1-2 курсы бакалавриата',
        long_description: 'Общая и прикладная фонетика, 1-2 курсы бакалавриата',
        level: "bac",
        year: 1,
        author: "kholyavin",
        chapters: [
            { id: 1, title: "Вводный курс", filename: "english_phonetics_intro.html" },
            { id: 2, title: "Акцентуация", filename: "english_phonetics_accentuation.html" },
            { id: 3, title: "Чистописание", filename: "english_phonetics_handwriting.html" },
        ]
    },
    {
        id: 'avar',
        title: 'Методическое пособие по аварскому языку',
        description: 'Общая и прикладная фонетика',
        long_description: avar_intro_text,
        level: "bac",
        year: 3,
        author: "kholyavin",
        chapters: [
            { id: 1, title: "Введение", filename: "avar_intro.html" },
            { id: 2, title: "Дифференциальные признаки согласных аварского языка", filename: "avar_distinctive_features.html" },
            { id: 3, title: "Лабиовелярный аппроксимант /w/", filename: "avar_w.html" },
            { id: 4, title: "Зубные аффрикаты /t͡s/ – /t͡sː/ – /t͡sʼ/ – /t͡sʼː/", filename: "avar_dental_affricates.html" },
            { id: 5, title: "Альвеолярные аффрикаты /t͡ʃ/ – /t͡ʃː/ – /t͡ʃʼ/ – /t͡ʃʼː/", filename: "avar_alveolar_affricates.html" },
            { id: 6, title: "Латеральные согласные /t͡ɬː/ – /t͡ɬʼː/ – /l/ – /ɬ/ – /ɬː/", filename: "avar_laterals.html" },
            { id: 7, title: "Гуттуральные согласные", filename: "avar_gutturals.html" },
            { id: 8, title: "Заднеязычные согласные /ɡ/ – /k/ – /kʼ/ – /k͡xː/ – /k͡xʼː/ – /х/", filename: "avar_velars.html" },
            { id: 9, title: "Увулярные согласные /q͡χː/ – /q͡χʼː/ – /ʁ/ – /χ/ – /χː/", filename: "avar_uvulars.html" },
            { id: 10, title: "Фарингальные согласные /ʕ/ – /ħ/", filename: "avar_pharyngeals.html" },
            { id: 11, title: "Ларингальные согласные /ʔ/ – /h/", filename: "avar_glottals.html" },
            { id: 12, title: "Приложение: задача на аварские числительные", filename: "avar_numbers.html" },
        ]
    },
    {
        id: 'python_genling_bac',
        title: 'Основы программирования на языке Python',
        description: 'Теоретическое и экспериментальное языкознание',
        long_description: 'Теоретическое и экспериментальное языкознание, 2 курс бакалавриата',
        level: "bac",
        year: 2,
        author: "kholyavin",
        chapters: [
            { id: 1, title: "Аттестация по курсу", filename: "python_genling_bac_intro.html" },
            { id: 2, title: "Переменные, типы данных, ввод и вывод", filename: "python_genling_bac_1.html" },
            { id: 3, title: "Списки, логические значения и условия", filename: "python_genling_bac_2.html" },
            { id: 4, title: "Циклы", filename: "python_genling_bac_3.html" },
            { id: 5, title: "List comprehension. Срезы", filename: "python_genling_bac_4.html" },
            { id: 6, title: "Работа с последовательностями", filename: "python_genling_bac_5.html" },
            { id: 7, title: "Коллоквиум", filename: "python_genling_bac_midterm.html" },
            { id: 8, title: "Строковые методы", filename: "python_genling_bac_6.html" },
        ]
    },
    {
        id: 'ling_programming',
        title: 'Программирование лингвистических задач',
        description: 'Общая и прикладная фонетика',
        long_description: 'Общая и прикладная фонетика, 4 курс бакалавриата',
        level: "bac",
        year: 4,
        author: "kholyavin",
        chapters: [
            { id: 1, title: "Чтение и запись звуковых данных", filename: "ling_programming_1.html" },
            { id: 2, title: "Чтение и запись файлов разметки Wave Assistant", filename: "ling_programming_2.html" },
            { id: 3, title: "Файловые системы и работа с многоуровневой разметкой", filename: "ling_programming_3.html" },
            { id: 4, title: "Работа с метками периодов основного тона", filename: "ling_programming_4.html" },
            { id: 5, title: "Работа с файлами аннотации TextGrid", filename: "ling_programming_5.html" },
        ]
    },
    {
        id: 'python_textbook',
        title: 'Python для фонетистов',
        description: 'Методическое пособие',
        long_description: ling_programming_text,
        level: "bac",
        year: 2,
        author: "kholyavin",
        chapters: [
            { id: 1, title: "Чтение и запись звуковых данных", filename: "wav_reading.html" },
            { id: 2, title: "Чтение и запись файлов разметки Wave Assistant", filename: "seg_reading.html" },
            { id: 3, title: "Файловые системы и работа с многоуровневой разметкой", filename: "multi_seg.html" },
            { id: 4, title: "Работа с метками периодов основного тона", filename: "pitchmarks.html" },
            { id: 5, title: "Работа с файлами аннотации TextGrid", filename: "textgrid.html" },
        ]
    },
    
];

export const getAllCourses = () => {
    return Promise.resolve(coursesData);
};

export const getCourseDetails = (courseId) => {
    const course = coursesData.find(c => c.id === courseId);
    return course ? Promise.resolve(course) : Promise.reject("Course not found");
};

export const getCourseContent = (courseId) => {
    console.log('Fetching content for course:', courseId);
    const course = coursesData.find(c => c.id === courseId);
    return course ? Promise.resolve({ chapters: course.chapters, title: course.title, level: course.level, year: course.year }) : Promise.reject("Course not found");
};