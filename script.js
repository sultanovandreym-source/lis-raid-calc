let step = 0;
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){ steps.forEach(s=>s.classList.remove('active')); steps[n].classList.add('active'); }
function nextStep(n){ if(n===2) loadObjects(); showStep(n); }
function prevStep(n){ showStep(n); }

// ===== Выбор взрывчатки =====
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.exp;
    selectedExplosives.includes(v)?selectedExplosives=selectedExplosives.filter(x=>x!==v):selectedExplosives.push(v);
  }
});

// ===== Выбор материалов =====
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.mat;
    selectedMaterials.includes(v)?selectedMaterials=selectedMaterials.filter(x=>x!==v):selectedMaterials.push(v);
  }
});

// ===== Объекты по материалу =====
const objectsByMaterial = {
  wood:['Door','Wall','Foundation'],
  stone:['Door','Wall','Foundation'],
  metal:['Door','Wall','Foundation','Ladder','Grate'],
  steel:['Door','Wall','Foundation','Ladder','Grate'],
  titan:['Door','Wall','Foundation','Ladder','Grate'],
  objects:['TrackingDevice','AutoRifle','AutoShotgun','TraderBot','EMTurret','RocketLauncher']
};

function loadObjects(){
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(o=>{
      const key = `${mat}_${o}`;
      if(objectsDiv.querySelector(`[data-obj='${key}']`)) return;

      const div = document.createElement('div');
      div.className = 'object-item';
      div.dataset.obj = key;

      let imgSrc = (mat === 'objects') ? `images/objects_${o}.png` : `images/${mat}_${o}.png`;

      div.innerHTML = `
        <img src="${imgSrc}" alt="${o}">
        <span>${o}</span>
        <div class="counter">
          <button onclick="changeObjectCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeObjectCount('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(div);
      selectedObjects[key] = 0;
    });
  });
}

function changeObjectCount(obj,v){
  selectedObjects[obj] = Math.max(0,(selectedObjects[obj]||0)+v);
  document.getElementById(`count-${obj}`).innerText = selectedObjects[obj];
}

// ===== Данные взрывчатки =====
const data = {
  bobovka: { /* данные как раньше */ },
  dynamite: { /* данные как раньше */ },
  c4: { /* данные как раньше */ },
  hexogen: { /* данные как раньше */ },
  rocket: { /* данные как раньше */ }
};

// ===== Расчет =====
function calculate(){
  let result='';
  let totalSulfur=0;

  Object.keys(selectedObjects).forEach(key=>{
    const qty=selectedObjects[key];
    if(qty===0) return;
    const [mat,obj]=key.split('_');
    result += `Объект: ${obj} (${mat})\nКоличество: ${qty}\n`;

    selectedExplosives.forEach(exp=>{
      let val = data[exp]?.[mat]?.[obj] || null;
      let c,s;
      if(!val){ c='Невозможно'; s='—'; }
      else{ c=val.count*qty; s=val.sulfur*qty; totalSulfur+=s; }
      result += `• ${exp}: ${c} (Сера: ${s})\n`;
    });

    result+='\n';
  });

  result += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = result;
  showStep(3);
}
