document.addEventListener("DOMContentLoaded", function () {
    const powerPlantSelect = document.getElementById("powerPlantSelect");

    // URL для GET-запроса
    const apiUrl = "https://localhost:7280/api/powerplant/get-plants";

    // Выполняем запрос
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки данных");
            }
            return response.json();
        })
        .then((data) => {
            // Очищаем текущие опции
            powerPlantSelect.innerHTML = "";

            // Заполняем select новыми опциями
            data.forEach((plant) => {
                const option = document.createElement("option");
                option.textContent = plant; // Название станции
                option.value = plant;      // Значение опции
                powerPlantSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Ошибка при загрузке списка станций:", error);
            // Добавляем сообщение об ошибке
            const option = document.createElement("option");
            option.textContent = "Не удалось загрузить данные";
            powerPlantSelect.appendChild(option);
        });
});