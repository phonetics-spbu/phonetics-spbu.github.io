const coursesData = [
    {
        id: 'linear_models',
        title: "Линейные модели и фильтры",
        description: "Общая и прикладная фонетика, 3 курс",
        author: "tityushina",
        chapters: [
            { id: 1, title: "Простая гармоника и гармонический сигнал. Колебание струны. Тембр.", filename: "lm_1.html" },
            { id: 2, title: "Цифровой и аналоговый сигнал. Дискретизация. Частота Найквиста.", filename: "lm_2.html" },
            { id: 3, title: "Действительное разложение в ряд Фурье", filename: "lm_3.html" },
            { id: 4, title: "Комплексный ряд Фурье", filename: "lm_4.html" },
            { id: 5, title: "Дискретное преобразование Фурье", filename: "lm_5.html" },
            { id: 6, title: "Быстрое преобразование Фурье", filename: "lm_6.html" },
            { id: 7, title: "Интегральное преобразование Фурье", filename: "lm_7.html" },
            { id: 8, title: "Окна и свёртки", filename: "lm_8.html" },
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
        description: "Общая и прикладная фонетика, 4 курс",
        author: "tityushina",
        chapters: [
            { id: 1, title: "1 тема", filename: "dsp_1.html" },
            { id: 2, title: "2 тема", filename: "dsp_2.html" },
        ]
    },
    {
        id: 'python_1_mag',
        title: "Основы программирования на языке Python",
        description: "Теория и история языка и языки народов Европы, 1 курс",
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
        description: "Теория и история языка и языки народов Европы, 2 курс",
        author: "tityushina",
        chapters: [
            { id: 1, title: "Повторение", filename: "python_2_mag_1.html" },
            { id: 2, title: "Классы в Python", filename: "python_2_mag_2.html" },
            { id: 3, title: "Работа с файлами разметки Praat", filename: "python_2_mag_3.html" },
        ]
    },
    {
        id: 'signal_proc_mag',
        title: 'Обработка и интерпретация речевого сигнала',
        description: 'Искусственный интеллект в моделировании речевой деятельности, 2 курс',
        author: "kholyavin",
        chapters: [
            { id: 1, title: "Повторение. Аналого-цифровое преобразование. Цифровое представление сигнала", filename: "signal_proc_mag_1.html" },
            { id: 2, title: "Обработка сигнала во временной области", filename: "signal_proc_mag_2.html" },
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
    return course ? Promise.resolve({ chapters: course.chapters }) : Promise.reject("Course not found");
};