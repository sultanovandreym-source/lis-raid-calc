let selectedExp = [];
let selectedMat = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n === 1 && !selectedExp.length) return alert('Выберите взрывчатку');
  if(n === 2 && !selectedMat.length) return alert('Выберите материал');
  if(n === 2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

/* ================= ВЫБОР ================= */

document.querySelectorAll('.exp').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.exp;
    selectedExp.includes(v)
      ? selectedExp.splice(selectedExp.indexOf(v),1)
      : selectedExp.push(v);
  };
});

document.querySelectorAll('.mat').forEach(el=>{
  el.onclick = () => {
    el.classList.toggle('active');
    const v = el.dataset.mat;
    selectedMat.includes(v)
      ? selectedMat.splice(selectedMat.indexOf(v),1)
      : selectedMat.push(v);
  };
});

/* ================= ЛОГИКА ВЫБОРА ВЗРЫВЧАТКИ ================= */

const preferredExp = {
  wood: ['bobovka'],
  stone: ['bobovka'],
  metal: ['dynamite'],
  steel: ['c4','rocket'],
  titan: ['hexogen','c4'],
  objects: []
};

function getExplosivesForMaterial(mat){
  const pref = preferredExp[mat] || [];

  // если выбрана 1 взрывчатка — считаем только её
  if(selectedExp.length === 1) return selectedExp;

  // если есть выгодная среди выбранных
  const good = pref.filter(e => selectedExp.includes(e));
  if(good.length) return good;

  // иначе считаем все выбранные
  return selectedExp;
}

/* ================= ОБЪЕКТЫ ================= */

const names = {
  wood:{door:'Деревянная дверь',wall:'Деревянная стена'},
  stone:{door:'Каменная дверь',wall:'Каменная стена'},
  metal:{door:'Металлическая дверь',wall:'Металлическая стена'},
  steel:{door:'Стальная дверь',wall:'Стальная стена'},
  titan:{door:'Титановая дверь',wall:'Титановая стена'},
  objects:{turret:'Турель'}
};

const data = {
  bobovka:{ wood:{wall:[4,480]} },
  dynamite:{ metal:{wall:[4,2000]} },
  c4:{ steel:{wall:[2,3000], titan:{wall:[8,12000]}} },
  hexogen:{ titan:{wall:[4,8000]} }
};

function loadObjects(){
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMat.forEach(mat=>{
    Object.keys(names[mat]||{}).forEach(obj=>{
      const key = mat+'_'+obj;
      selectedObjects[key] = 0;

      objectsDiv.innerHTML += `
        <div class="object-icon">
          <span>${names[mat][obj]}</span>
          <div class="counter">
            <button onclick="chg('${key}',-1)">-</button>
            <input id="c_${key}" value="0">
            <button onclick="chg('${key}',1)">+</button>
          </div>
        </div>`;
    });
  });
}

function chg(k,v){
  selectedObjects[k] = Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value = selectedObjects[k];
}

/* ================= РАСЧЁТ ================= */

function calculate(){
  let out = '';
  let sulfur = 0;

  Object.entries(selectedObjects).forEach(([key,count])=>{
    if(!count) return;
    const [mat,obj] = key.split('_');

    const explosives = getExplosivesForMaterial(mat);
    out += `${names[mat][obj]} x${count}\n`;

    explosives.forEach(exp=>{
      const d = data[exp]?.[mat]?.[obj];
      if(!d) return;
      const c = d[0]*count;
      const s = d[1]*count;
      sulfur += s;
      out += `  ${exp}: ${c} шт (${s} серы)\n`;
    });

    out += '\n';
  });

  out += `ИТОГО серы: ${sulfur}`;
  document.getElementById('result').innerText = out;
  showStep(3);
}
