document.addEventListener("DOMContentLoaded", function () {
    const tableContainer = document.getElementById("PlantsTableContainer");
    const inputField = document.getElementById("time-series");
    const modalContainer = document.createElement("div");
    modalContainer.id = "modal-container";
    document.body.appendChild(modalContainer);
    let currentPlantName = ""; // Для хранения имени текущей станции

    // Функция для создания модального окна влияющих факторов
    function showFactorModal(title, content) {
        const modalHtml = `
            <div class="modal fade" id="factorsModal" tabindex="-1" aria-labelledby="factorsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="factorsModalLabel">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">${content}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            <button type="button" class="btn btn-primary" id="addNewFactorBtn">Добавить фактор</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalContainer.innerHTML = modalHtml;
        const modal = new bootstrap.Modal(document.getElementById("factorsModal"));
        modal.show();

        // Обработчик для кнопки "Добавить фактор"
        document.getElementById("addNewFactorBtn").addEventListener("click", function () {
            showAddFactorModal();
        });
    }

    // Функция для создания модального окна для добавления нового фактора
    function showAddFactorModal() {
        const modalHtml = `
            <div class="modal fade" id="addFactorModal" tabindex="-1" aria-labelledby="addFactorModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addFactorModalLabel">Добавить новый фактор</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addFactorForm">
                                <div class="form-group">
                                    <label for="factorName">Название</label>
                                    <input type="text" id="factorName" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="factorNode">Узел</label>
                                    <input type="number" id="factorNode" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="upperLimit">Верхняя граница</label>
                                    <input type="number" id="upperLimit" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="lowerLimit">Нижняя граница</label>
                                    <input type="number" id="lowerLimit" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="increment">Шаг</label>
                                    <input type="number" id="increment" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="type">Тип фактора</label>
                                    <select id="factorType" class="form-control" required>
                                        <option value="" disabled selected>Выберите тип</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-success mt-3">Добавить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalContainer.innerHTML = modalHtml;
        const modal = new bootstrap.Modal(document.getElementById("addFactorModal"));
        modal.show();

        // Загружаем список типов факторов
        loadFactorTypes();

        // Обработчик для формы добавления нового фактора
        document.getElementById("addFactorForm").addEventListener("submit", async function (event) {
            event.preventDefault();
            const factorData = {
                name: document.getElementById("factorName").value,
                node: parseFloat(document.getElementById("factorNode").value),
                upperLimit: parseFloat(document.getElementById("upperLimit").value),
                lowerLimit: parseFloat(document.getElementById("lowerLimit").value),
                increment: parseFloat(document.getElementById("increment").value),
                factorType: document.getElementById("factorType").value,
                plantName: currentPlantName
            };

            try {
                const response = await fetch("https://localhost:7280/api/PowerPlant/add-factor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(factorData)
                });

                if (!response.ok) {
                    throw new Error(`Ошибка добавления фактора: ${response.status}`);
                }

                alert("Фактор успешно добавлен!");
                modal.hide();
                fetchInfluentalFactors(currentPlantName); // Обновляем список факторов
            } catch (error) {
                console.error("Ошибка добавления фактора:", error);
                alert("Ошибка добавления фактора: " + error.message);
                modal.hide();
            }
        });
    }

    // Функция для загрузки данных о влияющих факторах
    async function fetchInfluentalFactors(plantName) {
        try {
            const response = await fetch(`https://localhost:7280/api/PowerPlant/${encodeURIComponent(plantName)}`);
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            const data = await response.json();
            const factors = data.influentalFactors;
            if (!Array.isArray(factors) || factors.length === 0) {
                showFactorModal(
                    `Влияющие факторы для ${plantName}`,
                    "<p class='text-warning'>Влияющие факторы не найдены.</p>"
                );
                return;
            }

            let factorsTable = `
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Тип</th>
                            <th>Верхний предел</th>
                            <th>Нижний предел</th>
                            <th>Шаг</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            factors.forEach((factor) => {
                factorsTable += `
                    <tr>
                        <td>${factor.name}</td>
                        <td>${factor.factorTypes.type}</td>
                        <td>${factor.upperLimit}</td>
                        <td>${factor.lowerLimit}</td>
                        <td>${factor.increment}</td>
                    </tr>
                `;
            });

            factorsTable += "</tbody></table>";
            showFactorModal(`Влияющие факторы для ${plantName}`, factorsTable);
        } catch (error) {
            console.error("Ошибка загрузки факторов:", error);
            showFactorModal(
                `Ошибка для ${plantName}`,
                `<p class="text-danger">Ошибка загрузки данных: ${error.message}</p>`
            );
        }
    }

    // Функция для загрузки данных с сервера
    async function fetchPowerPlants() {
        try {
            const response = await fetch("https://localhost:7280/api/PowerPlant/get-plants");
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            const data = await response.json();
            populateTable(data);
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            tableContainer.innerHTML = `<p class="text-danger">Ошибка загрузки данных: ${error.message}</p>`;
        }
    }

    // Функция для заполнения таблицы
    function populateTable(data) {
        if (!Array.isArray(data) || data.length === 0) {
            tableContainer.innerHTML = "<p class='text-warning'>Станции не найдены.</p>";
            return;
        }

        let tableHtml = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Название станции</th>
                        <th>Влияющие факторы</th>
                        <th>Управляющие воздействия</th>
                        <th>Возмущения I,II группы</th>
                        <th>Возмущения III группы</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach((plantName) => {
            tableHtml += `
                <tr>
                    <td>${plantName}</td>
                    
                    <td>
                        <button class="btn btn-outline-primary btn-sm view-factors-btn" data-plant-name="${plantName}">
                            Просмотр
                        </button>
                    </td>
                    
                    <td>
                        <button class="btn btn-outline-primary btn-sm view-actions-btn" data-plant-name="${plantName}">
                            Просмотр
                        </button>
                    </td>
                    
                    <td>
                        <button class="btn btn-outline-primary btn-sm view-recloser-faults-btn" data-plant-name="${plantName}">
                            Просмотр
                        </button>
                    </td>
                    
                    <td>
                        <button class="btn btn-outline-primary btn-sm view-breaker-faults-btn" data-plant-name="${plantName}">
                            Просмотр
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = tableHtml;

        // Добавляем обработчики событий для кнопок "Просмотреть"
        const viewButtons = tableContainer.querySelectorAll(".view-factors-btn");
        viewButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const plantName = this.getAttribute("data-plant-name");
                currentPlantName = plantName;
                fetchInfluentalFactors(plantName);
            });
        });
    }

    // Добавляем обработчик ввода для фильтрации
    inputField.addEventListener("input", function () {
        const searchValue = inputField.value.trim().toLowerCase();
        const rows = tableContainer.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            const nameCell = row.querySelector("td");
            const isVisible = nameCell.textContent.toLowerCase().includes(searchValue);
            row.style.display = isVisible ? "" : "none";
        });
    });

    // Функция для загрузки типов факторов и добавления их в выпадающий список
    async function loadFactorTypes() {
        try {
            const response = await fetch("https://localhost:7280/api/PowerPlant/get-factor-types");
            if (!response.ok) {
                throw new Error(`Ошибка загрузки типов факторов: ${response.status}`);
            }
            const factorTypes = await response.json();
            const selectElement = document.getElementById("factorType");

            // Добавляем элементы в выпадающий список
            factorTypes.forEach((type) => {
                const option = document.createElement("option");
                option.value = type;
                option.textContent = type;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error("Ошибка загрузки типов факторов:", error);
            alert("Не удалось загрузить типы факторов: " + error.message);
        }
    }

    // Обработчик для кнопки "Просмотр"
document.addEventListener("click", async function (event) {
    if (event.target.classList.contains("view-actions-btn")) {
        const plantName = event.target.dataset.plantName;

        try {
            // Получаем данные для выбранной станции
            const response = await fetch(`https://localhost:7280/api/PowerPlant/${plantName}`);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных станции: ${response.status}`);
            }

            const data = await response.json();
            showActionsModal(data.remedialActions, plantName);
        } catch (error) {
            console.error("Ошибка при загрузке данных станции:", error);
            alert("Не удалось загрузить данные: " + error.message);
        }
    }
});

// Функция для отображения первого модального окна с таблицей действий
function showActionsModal(remedialActions, plantName) {
    const modalHtml = `
        <div class="modal fade" id="actionsModal" tabindex="-1" aria-labelledby="actionsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="actionsModalLabel">Действия для станции: ${plantName}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Ступень</th>
                                    <th>Отключаемый генератор</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${remedialActions
                                    .map(
                                        (action) => `
                                        <tr>
                                            <td>${action.id}</td>
                                            <td>${action.name}</td>
                                            <td>${action.stage}</td>
                                            <td>${action.generatorNode}</td>
                                        </tr>
                                    `
                                    )
                                    .join("")}
                            </tbody>
                        </table>
                        <button class="btn btn-primary" id="addRemedialActionBtn">Добавить УВ</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    modalContainer.innerHTML = modalHtml;
    const modal = new bootstrap.Modal(document.getElementById("actionsModal"));
    modal.show();

    // Обработчик для кнопки "Добавить действие"
    document.getElementById("addRemedialActionBtn").addEventListener("click", function () {
        showAddActionModal(plantName);
    });
}

// Функция для отображения второго модального окна (добавление нового действия)
function showAddActionModal(plantName) {
    const modalHtml = `
        <div class="modal fade" id="addActionModal" tabindex="-1" aria-labelledby="addActionModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addActionModalLabel">Добавить УВ</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addActionForm">
                            <div class="form-group">
                                <label for="actionName">Название</label>
                                <input type="text" id="actionName" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="actionStage">Ступень</label>
                                <input type="number" id="actionStage" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="generatorNode">Отключаемый генератор</label>
                                <input type="number" id="generatorNode" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-success mt-3">Добавить</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    modalContainer.innerHTML = modalHtml;
    const modal = new bootstrap.Modal(document.getElementById("addActionModal"));
    modal.show();

    // Обработчик для отправки нового действия
    document.getElementById("addActionForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const actionData = {
            name: document.getElementById("actionName").value,
            stage: parseInt(document.getElementById("actionStage").value, 10),
            generatorNode: parseInt(document.getElementById("generatorNode").value, 10),
            plantName: plantName,
        };

        try {
            const response = await fetch("https://localhost:7280/api/PowerPlant/add-remedial-action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actionData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка добавления действия: ${response.status}`);
            }

            alert("Действие успешно добавлено!");
            modal.hide();
        } catch (error) {
            console.error("Ошибка добавления действия:", error);
            alert("Ошибка добавления действия: " + error.message);
        }
    });
}

    // Загружаем данные при загрузке страницы
    fetchPowerPlants();
});