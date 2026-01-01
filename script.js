const screen = document.getElementById("screen");
const title = document.getElementById("title");
const backBtn = document.getElementById("backBtn");
const result = document.getElementById("result");

let step = 0;
let explosive = "";
let material = "";

const data = {
  babovka: {
    name: "Бабовка",
    icon: "💣",
    wood: {
      "Дверь": [2, 240],
      "Стена": [4, 480],
      "Фундамент": [15, 1800]
    },
    stone: {
      "Дверь": [3, 360],
      "Стена": [10, 1200],
      "Фундамент": [40, 4800]
    },
    metal: {
      "Дверь": [30, 3600],
      "Стена": [100, 12000],
      "Фундамент": [400, 48000]
    }
  }
};

function showExplosives() {
  step = 0;
  title.textContent = "Выбери взрывчатку";
  backBtn.classList.add("hidden");
  result.classList.add("hidden");
  screen.innerHTML = "";

  for (let key in data) {
    screen.innerHTML += `
      <div class="card" onclick="selectExplosive('${key}')">
        <div class="icon">${data[key].icon}</div>
        ${data[key].name}
      </div>`;
  }
}

function selectExplosive(key) {
  explosive = key;
  step = 1;
  title.textContent = "Что рейдим?";
  backBtn.classList.remove("hidden");
  screen.innerHTML = `
    <div class="card" onclick="selectMaterial('wood')">🌲 Дерево</div>
    <div class="card" onclick="selectMaterial('stone')">🪨 Камень</div>
    <div class="card" onclick="selectMaterial('metal')">🔩 Металл</div>
  `;
}

function selectMaterial(mat) {
  material = mat;
  step = 2;
  title.textContent = "Выбери объект";
  screen.innerHTML = "";

  for (let obj in data[explosive][material]) {
    screen.innerHTML += `
      <div class="card" onclick="calculate('${obj}')">${obj}</div>`;
  }
}

function calculate(obj) {
  const [count, sulfur] = data[explosive][material][obj];
  screen.innerHTML = "";
  title.textContent = "Результат";
  result.classList.remove("hidden");
  result.innerHTML = `
    <b>${data[explosive].name}</b><br><br>
    Объект: ${obj}<br>
    Взрывчатка: ${count}<br>
    Сера: ${sulfur}
  `;
}

backBtn.onclick = () => {
  if (step === 1) showExplosives();
  if (step === 2) selectExplosive(explosive);
  if (step === 3) selectMaterial(material);
};

showExplosives();});
