document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "http://127.0.0.1:5003/process";
    const startPreprocessButton = document.getElementById("startPreprocessButton");
    const calculationResult = document.getElementById("calculationResult");

    // Обработчик события кнопки "Обучить модель"
    startPreprocessButton.addEventListener("click", () => {
        const datasetPath = "C:\\Users\\Umaro\\OneDrive\\Рабочий стол\\set";

        calculationResult.innerHTML = `<p class="text-info">Предобработка данных...</p>`;

        fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({"directory": datasetPath})
        })
            .then((response) => {
                if(!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if(data.error) {
                    calculationResult.innerHTML = `<p class="text-info">Ошибка!</p>`;
                }
                else {
                    calculationResult.innerHTML = `<p class="text-info">Данные готовы</p>`;

                    // Перенаправление на страницу 'train/'
                    setTimeout(() => {
                        window.location.href = 'http://localhost:8000/train/';
                    }, 2000); // Задержка 2 секунды для отображения сообщения
                }
            })
            .catch((error) => {
                // Ошибка запроса
                calculationResult.innerHTML = `<p class="text-danger">Произошла ошибка: ${error.message}</p>`;
            });
    });
});