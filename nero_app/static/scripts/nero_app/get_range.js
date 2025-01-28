document.addEventListener("DOMContentLoaded", function() {
    const modelSelect = document.getElementById("modelSelect");
    const customRange = document.getElementById("customRange3");
    const apiBaseUrl = "http://localhost:5005/powerplant";

    modelSelect.addEventListener("change", () => {
        const selectedModel = modelSelect.value;
        if (selectedModel) {
            fetch(`${apiBaseUrl}/${encodeURIComponent(selectedModel)}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Ошибка: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);

                    if (data.generators_count !== undefined) {
                        customRange.max = data.generators_count;
                    }

                })
                .catch((error) => {
                    console.error("Ошибка при получении данных:", error);
                });
        }
    });
});