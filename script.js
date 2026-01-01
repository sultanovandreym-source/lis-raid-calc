const steps = document.querySelectorAll('.step');
let selectedExplosives = [];
let selectedMaterials = [];

// ===== Переключение шагов =====
function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}
function nextStep(n) {
  if (n === 2) loadObjects();
  showStep(n);
}
function prevStep(n) { showStep(n); }

// ===== Выбор взрывчатки =====
document.querySelectorAll('.exp').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives = selectedExplosives.filter(x => x !== v)
      : selectedExplosives.push(v);
  };
});

// ===== Выбор материалов =====
document.querySelectorAll('.mat').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials = selectedMaterials.filter(x => x !== v)
      : selectedMaterials.push(v);
  };
});

// ===== Объекты по выбранным материалам =====
const objectsByMaterial = {
  wood: ['door','wall','foundation'],
  stone: ['door','wall','foundation'],
  metal: ['door','wall','foundation','ladder','grate'],
  steel: ['door','wall','foundation','ladder','grate'],
  titan: ['door','wall','foundation','ladder','grate'],
  objects: [
    'tracking_device',
    'auto_rifle',
    'auto_shotgun',
    'trading_bot',
    'turret',
    'rocket_launcher'
  ]
};

function loadObjects() {
  const grid = document.getElementById('objectsGrid');
  grid.innerHTML = '';

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(obj => {
      const div = document.createElement('div');
      div.className = 'obj';
      div.dataset.mat = mat;
      div.dataset.obj = obj;
      div.innerHTML = `<img src="img/${mat}_${obj}.png"><span>${mat} ${obj}</span>`;
      grid.appendChild(div);
    });
  });
}
