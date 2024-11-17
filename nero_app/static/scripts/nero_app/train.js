function toggleHyperparameters() {
        const isAutoTuning = document.getElementById("auto-tuning").checked;
        const inputs = document.querySelectorAll(".hyperparameters input, .hyperparameters select");
        inputs.forEach(input => input.disabled = isAutoTuning);
    }

    document.getElementById('train-model').addEventListener('click', function () {
        const fileInput = document.getElementById('dataset-file');
        const file = fileInput.files[0];

        if (file && file.type === 'application/json') {
            const reader = new FileReader();

            reader.onload = function(event) {
                const jsonData = JSON.parse(event.target.result);

                const input_width = parseInt(document.getElementById("input-width").value);
                const epochs = parseInt(document.getElementById("epoch").value);

                jsonData.epochs = epochs;
                jsonData.input_width = input_width;

                fetch('http://localhost:5001/auto_train', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert('Модель обучена успешно! Путь: ' + data.model_path);
                    } else {
                        alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
                    }
                })
                .catch(error => {
                    console.error('Ошибка при отправке данных:', error);
                    alert('Ошибка при отправке данных на сервер');
                });
            };

            reader.readAsText(file);
        } else {
            alert('Пожалуйста, выберите правильный JSON файл');
        }
    });