const data = {
  bobovka: {
    name: "Бобовка",
    wood: {
      "Деревянная дверь": { b: 2, s: 240 },
      "Деревянная стена": { b: 4, s: 480 },
      "Деревянный фундамент": { b: 15, s: 1800 }
    },
    stone: {
      "Каменная дверь": { b: 3, s: 360 },
      "Каменная стена": { b: 10, s: 1200 },
      "Каменный фундамент": { b: 40, s: 4800 }
    },
    metal: {
      "Металлическая дверь": { b: 30, s: 3600 },
      "Металлическая стена": { b: 100, s: 12000 }
    },
    iron_cast: {
      "МВК дверь": { b: 200, s: 24000 },
      "МВК стена": { b: 667, s: 80040 }
    },
    titan: {
      "Титановая дверь": { b: 800, s: 96000 }
    }
  },

  dinamit: {
    name: "Динамит",
    wood: {
      "Деревянная дверь": { b: 1, s: 500 },
      "Деревянная стена": { b: 2, s: 1000 },
      "Деревянный фундамент": { b: 8, s: 4000 }
    },
    stone: {
      "Каменная дверь": { b: 2, s: 1000 },
      "Каменная стена": { b: 5, s: 2500 },
      "Каменный фундамент": { b: 20, s: 10000 }
    },
    metal: {
      "Железная дверь": { b: 4, s: 2000 },
      "Железная стена": { b: 13, s: 6500 }
    },
    iron_cast: {
      "МВК дверь": { b: 20, s: 10000 },
      "МВК стена": { b: 67, s: 33500 }
    },
    titan: {
      "Титановая дверь": { b: 80, s: 40000 }
    }
  }
};

const explosiveSel = document.getElementById('explosive');
const materialSel = document.getElementById('material');
const objectSel = document.getElementById('object');
const listDiv = document.getElementById('list');
const totalDiv = document.getElementById('total');

let raids = [];

function init() {
  for (let key in data) {
    explosiveSel.innerHTML += `<option value="${key}">${data[key].name}</option>`;
  }
  updateMaterials();
}

function updateMaterials() {
  materialSel.innerHTML = '';
  const mats = Object.keys(data[explosiveSel.value]).filter(k => k !== 'name');
  mats.forEach(m => {
    materialSel.innerHTML += `<option value="${m}">${m}</option>`;
  });
  updateObjects();
}

function updateObjects() {
  objectSel.innerHTML = '';
  const objs = data[explosiveSel.value][materialSel.value];
  for (let o in objs) {
    objectSel.innerHTML += `<option value="${o}">${o}</option>`;
  }
}

explosiveSel.onchange = updateMaterials;
materialSel.onchange = updateObjects;

function addItem() {
  const e = explosiveSel.value;
  const m = materialSel.value;
  const o = objectSel.value;
  const c = +document.getElementById('count').value;

  const d = data[e][m][o];
  raids.push({
    text: `${data[e].name} → ${o} ×${c}`,
    bombs: d.b * c,
    sulfur: d.s * c
  });

  render();
}

function render() {
  listDiv.innerHTML = '';
  let tb = 0, ts = 0;

  raids.forEach(r => {
    tb += r.bombs;
    ts += r.sulfur;
    listDiv.innerHTML += `
      <div class="raid">
        ${r.text}<br>
        💣 ${r.bombs} | 🧪 ${r.sulfur}
      </div>
    `;
  });

  totalDiv.innerHTML = `
    <div class="total">
      <b>ИТОГО</b><br>
      💣 ${tb}<br>
      🧪 ${ts}
    </div>
  `;
}

init();
