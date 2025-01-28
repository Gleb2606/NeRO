document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://localhost:7280/api/powerplant";
    const powerPlantSelect = document.getElementById("powerPlantSelect");
    const startCalculationButton = document.getElementById("startCalculationButton");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const calculationResult = document.getElementById("calculationResult");

    const showSpinner = () => {
        loadingSpinner.style.display = "inline-block";
        startCalculationButton.disabled = true; // Отключаем кнопку на время загрузки
    };

    const hideSpinner = () => {
        loadingSpinner.style.display = "none";
        startCalculationButton.disabled = false; // Включаем кнопку обратно
    };

    startCalculationButton.addEventListener("click", () => {
        startCalculationButton.disabled = true;
        const selectedPlant = powerPlantSelect.value;

        if (!selectedPlant) {
            calculationResult.innerHTML = `<p class="text-danger">Пожалуйста, выберите станцию</p>`;
            return;
        }

        calculationResult.innerHTML = "";
        showSpinner();

        fetch(`${apiBaseUrl}/${encodeURIComponent(selectedPlant)}`)
            .then((response) => {
                startCalculationButton.disabled = false;
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                return fetch(`${apiBaseUrl}/start-calculation`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка при расчете: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => {
                calculationResult.innerHTML = `<p class="text-success">Расчет успешно выполнен:</p>
                                               <pre>${JSON.stringify(result, null, 2)}</pre>`;
            })
            .catch((error) => {
                calculationResult.innerHTML = `<p class="text-danger">Произошла ошибка: ${error.message}</p>`;
            })
            .finally(() => {
                hideSpinner(); // Прячем спиннер после завершения
            });
    });
});