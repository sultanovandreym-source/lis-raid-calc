/* ================= ДАННЫЕ ================= */

const EXPLOSIVES = [
  { id: "bobovka", name: "Бобовка", img: "bobovka.png" },
  { id: "dynamite", name: "Динамит", img: "dynamite.png" },
  { id: "c4", name: "C4", img: "c4.png" },
  { id: "rocket", name: "Ракета", img: "rocket.png" },
  { id: "hexogen", name: "Гексоген", img: "hexogen.png" }
];

const MATERIALS = [
  { id: "wood", name: "Дерево", img: "wood_wall.png" },
  { id: "stone", name: "Камень", img: "stone_wall.png" },
  { id: "metal", name: "Металл", img: "metal_wall.png" },
  { id: "steel", name: "Сталь", img: "steel_wall.png" },
  { id: "titan", name: "Титан", img: "titan_wall.png" },
  { id: "objects", name: "Объекты", img: "objects.png" }
];

const OBJECTS = [
  { id: "wall", name: "Стена", img: "stone_wall.png" },
  { id: "door", name: "Дверь", img: "stone_door.png" },
  { id: "foundation", name: "Фундамент", img: "stone_foundation.png" },
  { id: "turret", name: "Турель", img: "object_shotgun_turret.png", mat: "objects" }
];

/* ================= ЦИФРЫ РЕЙДА ================= */

const RAID = {
  bobovka: { wood: { wall: 2, door: 3 }, stone: { wall: 5, door: 6 } },
  dynamite: { metal: { wall: 4, door: 2 } },
  c4: { steel: { wall: 2, door: 1 }, titan: { wall: 3 } },
  rocket: { steel: { wall: 3 } },
  hexogen: { titan: { wall: 2, door: 2 } }
};

const SULFUR = {
  bobovka: 120,
  dynamite: 570,
  c4: 2200,
  rocket: 1400,
  hexogen: 3000
};

/* ================= СОСТОЯНИЕ ================= */

let selectedExp = [];
let selectedMat = null;
let selectedObjects = {};

/* ================= РЕНДЕР ================= */

function renderCards(list, container, click) {
  container.innerHTML = "";
  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="images/${item.img}"><div>${item.name}</div>`;
    div.onclick = () => click(item, div);
    container.appendChild(div);
  });
}

/* ================= ШАГИ ================= */

const steps = [...document.querySelectorAll(".step")];
const showStep = i => {
  steps.forEach(s => s.classList.remove("active"));
  steps[i].classList.add("active");
};

/* ================= ИНИЦИАЛИЗАЦИЯ ================= */

const expBox = document.getElementById("explosives");
renderCards(EXPLOSIVES, expBox, (item, el) => {
  el.classList.toggle("selected");
  selectedExp.includes(item.id)
    ? selectedExp = selectedExp.filter(x => x !== item.id)
    : selectedExp.push(item.id);
  document.getElementById("to-step-2").disabled = !selectedExp.length;
});

const matBox = document.getElementById("materials");
renderCards(MATERIALS, matBox, (item, el) => {
  [...matBox.children].forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  selectedMat = item.id;
  document.getElementById("to-step-3").disabled = false;
});

document.getElementById("to-step-2").onclick = () => showStep(1);
document.getElementById("to-step-3").onclick = () => showStep(2);
document.getElementById("back-1").onclick = () => showStep(0);
document.getElementById("back-2").onclick = () => showStep(1);

/* ================= ОБЪЕКТЫ ================= */

const objBox = document.getElementById("objects");

function renderObjects() {
  objBox.innerHTML = "";
  OBJECTS.forEach(obj => {
    if (obj.mat && obj.mat !== selectedMat) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="images/${obj.img}">
      <div>${obj.name}</div>
      <div class="counter">
        <button>-</button>
        <input value="0">
        <button>+</button>
      </div>
    `;

    const input = card.querySelector("input");
    card.querySelectorAll("button")[0].onclick = () => input.value = Math.max(0, +input.value - 1);
    card.querySelectorAll("button")[1].onclick = () => input.value++;

    input.oninput = () => {
      selectedObjects[obj.id] = +input.value;
      document.getElementById("calculate").disabled =
        !Object.values(selectedObjects).some(v => v > 0);
    };

    objBox.appendChild(card);
  });
}

document.getElementById("to-step-3").onclick = () => {
  renderObjects();
  showStep(2);
};

/* ================= РАСЧЁТ ================= */

document.getElementById("calculate").onclick = () => {
  let html = "";
  let totalSulfur = 0;

  for (const [obj, count] of Object.entries(selectedObjects)) {
    if (!count) continue;

    selectedExp.forEach(exp => {
      const cost = RAID[exp]?.[selectedMat]?.[obj];
      if (!cost) return;

      const need = cost * count;
      const sulfur = need * SULFUR[exp];
      totalSulfur += sulfur;

      html += `<p>${obj}: ${need} ${exp}, сера ${sulfur}</p>`;
    });
  }

  html += `<hr><b>Всего серы: ${totalSulfur}</b>`;
  document.getElementById("result-content").innerHTML = html;
  showStep(3);
};

document.getElementById("restart").onclick = () => location.reload();
