let selectedExplosives = [];
let selectedMaterials = [];

const screens = document.querySelectorAll('.screen');
const objectsDiv = document.getElementById('objects');
const outputDiv = document.getElementById('output');

/* ОБЪЕКТЫ ПО МАТЕРИАЛАМ */
const objectsByMaterial = {
  wood: ["Дверь", "Стена", "Фундамент"],
  stone: ["Дверь", "Стена", "Фундамент"],
  metal: ["Дверь", "Стена"],
  iron: ["Дверь", "Стена"],
  titan: ["Дверь"]
};

/* СТОИМОСТЬ (БАЗА, МОЖНО РАСШИРЯТЬ) */
const costs = {
  bobovka: {
    stone: {
      "Стена": { b: 10, s: 1200 }
    }
  },
  dinamit: {
    metal: {
      "Стена": { b: 13, s: 6500 }
    }
  }
};

function goTo(step) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(step === 4 ? 'result' : 'step' + step).classList.add('active');
  if (step === 3) loadObjects();
}

function toggleExplosive(e) {
  if (selectedExplosives.includes(e))
    selectedExplosives = selectedExplosives.filter(x => x !== e);
  else
    selectedExplosives.push(e);
  updateCards();
}

function toggleMaterial(m) {
  if (selectedMaterials.includes(m))
    selectedMaterials = selectedMaterials.filter(x => x !== m);
  else
    selectedMaterials.push(m);
  updateCards();
}

function updateCards() {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.card').forEach(c => {
    const t = c.innerText.toLowerCase();
    selectedExplosives.forEach(e => { if (t.includes(e)) c.classList.add('active'); });
    selectedMaterials.forEach(m => { if (t.includes(m)) c.classList.add('active'); });
  });
}

function loadObjects() {
  objectsDiv.innerHTML = '';
  selectedMaterials.forEach(m => {
    objectsByMaterial[m].forEach(o => {
      objectsDiv.innerHTML += `
        <div class="object-row">
          ${o} (${m})
          <input type="number" min="1" value="1" data-m="${m}" data-o="${o}">
        </div>`;
    });
  });
}

function calculate() {
  let totalB = 0;
  let totalS = 0;
  let result = "";

  document.querySelectorAll('#objects input').forEach(inp => {
    const count = +inp.value;
    const m = inp.dataset.m;
    const o = inp.dataset.o;

    let best = null;

    const explosives = selectedExplosives.length ? selectedExplosives : Object.keys(costs);

    explosives.forEach(e => {
      if (costs[e][m] && costs[e][m][o]) {
        const c = costs[e][m][o];
        const sulfur = c.s * count;
        if (!best || sulfur < best.sulfur) {
          best = { e, b: c.b * count, s: sulfur };
        }
      }
    });

    if (best) {
      result += `🔹 ${o} (${m}) → ${best.e}<br>💣 ${best.b} | 🧪 ${best.s}<br><br>`;
      totalB += best.b;
      totalS += best.s;
    }
  });

  result += `<hr><b>ИТОГО</b><br>💣 ${totalB}<br>🧪 ${totalS}`;

  outputDiv.innerHTML = result;
  goTo(4);
}
