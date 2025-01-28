document.addEventListener("DOMContentLoaded", () => {
    const apiTransientUrl = "http://localhost:5007/get-transient";
    const apiPredictUrl = "http://localhost:5007/predict";
    const apiPlotter = "http://localhost:7123/plot";
    const startCalculationButton = document.getElementById("calculation");
    const modelSelect = document.getElementById("modelSelect");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const imageDisplay = document.getElementById("imageDisplay");
    const imageUrl = `C:\\Users\\Umaro\\PycharmProjects\\NeRO\\nero_app\\static\\plots\\plot.png`;

    const showSpinner = () => {
        loadingSpinner.style.display = "inline-block";
        startCalculationButton.disabled = true; // Отключаем кнопку на время загрузки
    };

    const hideSpinner = () => {
        loadingSpinner.style.display = "none";
        startCalculationButton.disabled = false; // Включаем кнопку обратно
    };

    startCalculationButton.addEventListener("click", () => {
        const modeFileInput = document.getElementById("mode-file");
        const faultFileInput = document.getElementById("fault-file");
        const modeFile = Array.from(modeFileInput.files).map(file => file.name);
        const faultFile = Array.from(faultFileInput.files).map(file => file.name);
        const selectedValue = modelSelect.value;
        const selectedText = modelSelect.options[modelSelect.selectedIndex].text;

        // Проверка наличия выбранных файлов
        if (modeFile.length === 0 || faultFile.length === 0) {
            alert("Выберите файлы для анализа.");
            return;
        }

        showSpinner();

        document.getElementById('mode-files-list').textContent = modeFile.join(', ') || 'Не выбраны файлы.';
        document.getElementById('fault-files-list').textContent = faultFile.join(', ') || 'Не выбраны файлы.';
        document.getElementById('model').textContent = selectedValue;
        document.getElementById('model-text').textContent = selectedText;

        // Отправка первого запроса (get-transient)
        fetch(apiTransientUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "rst_file": `C:\\Users\\Umaro\\OneDrive\\Рабочий стол\\rst\\${modeFile[0]}`,
                "scn_file": `C:\\Users\\Umaro\\OneDrive\\Рабочий стол\\scn\\${faultFile[0]}`,
                "input_width": 1.41
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка на этапе расчета динамики: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.path) {
                    // Отправка второго запроса (predict)
                    return fetch(apiPredictUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "path": data.path,
                            "name": selectedValue
                        })
                    });
                } else {
                    throw new Error("Путь результата отсутствует в ответе сервера.");
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка на этапе предсказания: ${response.status}`);
                }
                return response.json();
            })
            .then((predictData) => {
                console.log("Данные второго запроса:", predictData);
                if (predictData.path) {
                    // Отправка третьего запроса (plot)
                    return fetch(apiPlotter, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "path": predictData.path
                        })
                    });
                } else {
                    throw new Error("Путь результата отсутствует в ответе второго запроса.");
                }
            })
            .then((plotResponse) => {
                if (!plotResponse.ok) {
                    throw new Error(`Ошибка на этапе создания графика: ${plotResponse.status}`);
                }
                return plotResponse.json();
            })
            .then((plotData) => {
                imageDisplay.src = imageUrl; // Установить источник изображения
                imageDisplay.style.display = "block";
                alert(`Расчет успешно завершён!`);
            })
            .catch((error) => {
                console.error("Ошибка:", error);
                alert(`Произошла ошибка: ${error.message}`);
            })
            .finally(() => {
                hideSpinner();
            });
    });
});
