document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("SubmitPlantButton");
    const plantNameInput = document.getElementById("PlantNameInput");
    const modalErrorMessage = document.getElementById("ModalErrorMessage");
    const modalElement = new bootstrap.Modal(document.getElementById('AddPlantModal'));

    // Обработчик нажатия кнопки "Добавить"
    submitButton.addEventListener("click", async function () {
        const plantName = plantNameInput.value.trim();

        // Проверка на пустое поле
        if (!plantName) {
            modalErrorMessage.style.display = "block";
            return;
        }

        modalErrorMessage.style.display = "none";

        try {
            const response = await fetch("https://localhost:7280/api/PowerPlant/add-station", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(plantName)
            });

            if (response.ok) {
                alert("Станция успешно добавлена!");
                modalElement.hide();
                plantNameInput.value = ""; // Очистка поля ввода
            } else {
                const errorText = await response.text();
                alert(`Ошибка: ${errorText}`);
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            alert("Не удалось добавить станцию. Проверьте соединение.");
        }
    });
});