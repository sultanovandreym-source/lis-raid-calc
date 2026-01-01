// Элементы
const explosiveSection = document.getElementById("explosive-section");
const materialSection = document.getElementById("material-section");
const targetSection = document.getElementById("target-section");
const targetButtonsDiv = document.getElementById("target-buttons");
const backToExplosive = document.getElementById("back-to-explosive");
const backToMaterial = document.getElementById("back-to-material");
const resultDiv = document.getElementById("result");

let selectedExplosive = null;
let selectedMaterial = null;

// Данные для расчета (пример)
const data = {
    bababka: {
        wood: {
            "Деревянная дверь": { amount: 2, sulfur: 240 },
            "Деревянная стена": { amount: 4, sulfur: 480 },
            "Деревянный фундамент": { amount: 15, sulfur: 1800 }
        },
        stone: {
            "Каменная дверь": { amount: 3, sulfur: 360 },
            "Каменная стена": { amount: 10, sulfur: 1200 },
            "Каменный фундамент": { amount: 40, sulfur: 4800 }
        },
        metal: {
            "Металлическая дверь": { amount: 30, sulfur: 3600 },
            "Металлическая стена": { amount: 100, sulfur: 12000 },
            "Металлический фундамент": { amount: 400, sulfur: 48000 },
            "Железная складная лестница": { amount: 46, sulfur: 5520 }
        },
        iron: {
            "Дверь": { amount: 200, sulfur: 24000 },
            "Стена": { amount: 667, sulfur: 80040 },
            "Фундамент": { amount: 2667, sulfur: 320040 },
            "Складная лестница": { amount: 275, sulfur: 33000 }
        },
        titan: {
            "Дверь": { amount: 800, sulfur: 96000 },
            "Стена": { amount: 2667, sulfur: 320040 },
            "Складная лестница": { amount: 1112, sulfur: 133440 }
        },
        objects: {
            "Устройство отслеживания стрельбы": { amount: 50, sulfur: 6000 },
            "Устройство с автоматической винтовкой": { amount: 50, sulfur: 6000 },
            "Автоматическая установка для картечи": { amount: 50, sulfur: 6000 },
            "Торговый бот": { amount: 668, sulfur: 80160 },
            "Электрическая турель": { amount: 50, sulfur: 6000 },
            "Ракетная пусковая установка": { amount: 50, sulfur: 6000 }
        }
    }
};

// Выбор взрывчатки
explosiveSection.querySelectorAll("button[data-explosive]").forEach(btn => {
    btn.addEventListener("click", () => {
        selectedExplosive = btn.dataset.explosive;
        explosiveSection.style.display = "none";
        materialSection.style.display = "block";
        resultDiv.innerHTML = "";
    });
});

// Выбор материала
materialSection.querySelectorAll("button[data-material]").forEach(btn => {
    btn.addEventListener("click", () => {
        selectedMaterial = btn.dataset.material;
        materialSection.style.display = "none";
        targetSection.style.display = "block";

        // Генерируем кнопки для целей
        targetButtonsDiv.innerHTML = "";
        const targets = data[selectedExplosive][selectedMaterial];
        for (let key in targets) {
            const tBtn = document.createElement("button");
            tBtn.textContent = key;
            tBtn.addEventListener("click", () => {
                const { amount, sulfur } = targets[key];
                resultDiv.innerHTML = `
                    Для разрушения <b>${key}</b> с помощью <b>${selectedExplosive}</b>:<br>
                    Необходимо <b>${amount}</b> единиц взрывчатки<br>
                    Потребуется <b>${sulfur}</b> серы
                `;
            });
            targetButtonsDiv.appendChild(tBtn);
        }
    });
});

// Кнопки назад
backToExplosive.addEventListener("click", () => {
    materialSection.style.display = "none";
    explosiveSection.style.display = "block";
    resultDiv.innerHTML = "";
});
backToMaterial.addEventListener("click", () => {
    targetSection.style.display = "none";
    materialSection.style.display = "block";
    resultDiv.innerHTML = "";
});
