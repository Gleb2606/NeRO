document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "http://127.0.0.1:5005/model";
    const modelSelect = document.getElementById("modelSelect");

    fetch(apiBaseUrl)
        .then((response) => {
            if(!response.ok) {
                throw new Error("Ошибка загрузки данных");
            }
            return response.json();
    })
        .then((data) => {
            modelSelect.innerHTML = "";

            data.forEach((model) => {
                const option = document.createElement("option");
                option.textContent = model.name;
                option.value = model.name;
                modelSelect.appendChild(option);
            })
        })
        .catch((error) => {
            console.error("Ошибка при загрузке списка моделей:", error);
            // Добавляем сообщение об ошибке
            const option = document.createElement("option");
            option.textContent = "Не удалось загрузить данные";
            modelSelect.appendChild(option);
        })
})