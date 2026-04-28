from itertools import product

letters = "GBRY"
nums = "1234"
levels = [ch + num for num, ch in product(nums, letters)]
level_codes = [2 ** i for i in range(len(levels))]

level2code = {i: j for i, j in zip(levels, level_codes)}
code2level = {j: i for i, j in zip(levels, level_codes)}


def detect_encoding(file_path: str) -> str:
    encoding = "utf-8"
    try:
        text = open(file_path, 'r', encoding="utf-8").read()
    except UnicodeDecodeError:
        try:
            open(file_path, 'r', encoding="utf-16").read()
            encoding = "utf-16"
        except UnicodeDecodeError:
            encoding = "cp1251"
    else:
        if text.startswith("\ufeff"):  # т.н. byte order mark
            encoding = "utf-8-sig"
    return encoding


def read_seg(filename: str, encoding: str = "utf-8-sig") -> tuple[dict, list[dict]]:
    with open(filename, encoding=encoding) as f:
        lines = [line.strip() for line in f.readlines()]

    # найдём границы секций в списке строк:
    header_start = lines.index("[PARAMETERS]") + 1
    data_start = lines.index("[LABELS]") + 1

    # прочитаем параметры
    params = {}
    for line in lines[header_start:data_start - 1]:
        key, value = line.split("=")
        params[key] = int(value)

    # прочитаем метки
    labels = []
    for line in lines[data_start:]:
        # если в строке нет запятых, значит, это не метка и метки закончились
        if line.count(",") < 2:
            break
        pos, level, name = line.split(",", maxsplit=2)
        label = {
            # чтобы перевести в отсчёты, разделим на кол-во байт на отсчёт
            # и на количество каналов
            "position": int(pos) // params["BYTE_PER_SAMPLE"] // params["N_CHANNEL"],
            "level": code2level[int(level)],
            "name": name,
        }
        labels.append(label)
    return params, labels


def write_seg(params: dict, labels: list, filename: str, encoding: str = "utf-8-sig") -> None:
    # зададим значения параметров по умолчанию
    # вы можете изменить функцию так, чтобы параметры можно было передавать как ключевые слова
    param_defaults = {
        "SAMPLING_FREQ": 44100,
        "BYTE_PER_SAMPLE": 2,
        "CODE": 0,
        "N_CHANNEL": 1,
        "N_LABEL": 0
    }
    # запишем в словарь переданные в функцию значения параметров
    params = param_defaults | params
    # количество меток определим как длину списка labels
    params["N_LABEL"] = len(labels)
    with open(filename, "w", encoding=encoding) as f:
        f.write("[PARAMETERS]\n")
        for key, value in params.items():
            f.write(f"{key}={value}\n")
        f.write("[LABELS]\n")
        for label in labels:
            label_byte = (
                params['BYTE_PER_SAMPLE'] * 
                params['N_CHANNEL'] * label['position']
            )
            f.write(f"{label_byte},")
            f.write(f"{level2code[label['level']]},")
            f.write(f"{label['name']}\n")
