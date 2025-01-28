document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://localhost:7280/api/powerplant";
    const powerPlantSelect = document.getElementById("powerPlantSelect");
    const factorsTableContainer = document.getElementById("factorsTableContainer");

    // Обработчик изменения выбранной станции
    powerPlantSelect.addEventListener("change", () => {
        const selectedPlant = powerPlantSelect.value;
        if (selectedPlant) {
            fetch(`${apiBaseUrl}/${encodeURIComponent(selectedPlant)}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Ошибка: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    renderFactorsTable(data.influentalFactors);
                })
                .catch((error) => {
                    console.error("Ошибка при загрузке данных:", error);
                    factorsTableContainer.innerHTML = `<p class="text-danger">Не удалось загрузить данные</p>`;
                });
        }
    });

    // Функция для отображения таблицы факторов
    function renderFactorsTable(factors) {
        if (!factors || factors.length === 0) {
            factorsTableContainer.innerHTML = `<p class="text-warning">Нет данных для отображения</p>`;
            return;
        }

        // Создаем таблицу
        let tableHtml =
            `
            <label>Влияющие факторы</label>
            <table class="table table-hover">
                <thead>
                    <tr class="table-dark">
                        <th>Название</th>
                        <th>Узел</th>
                        <th>Верхний предел</th>
                        <th>Нижний предел</th>
                        <th>Шаг</th>
                    </tr>
                </thead>
                <tbody>
        `;

        factors.forEach((factor) => {
            tableHtml += `
                <tr>
                    <td>${factor.name}</td>
                    <td>${factor.node}</td>
                    <td>${factor.upperLimit}</td>
                    <td>${factor.lowerLimit}</td>
                    <td>${factor.increment}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        factorsTableContainer.innerHTML = tableHtml;
    }
});
