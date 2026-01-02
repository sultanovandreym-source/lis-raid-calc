const steps = document.querySelectorAll('.step');
let selectedExp = [];
let selectedMat = [];
let selectedObjects = {};

function showStep(n){
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n === 1 && selectedExp.length === 0){
    alert('Выберите взрывчатку');
    return;
  }
  if(n === 2 && selectedMat.length === 0){
    alert('Выберите материал');
    return;
  }
  if(n === 2) loadObjects();
  showStep(n);
}

function prevStep(n){
  showStep(n);
}

/* ================== ВЗРЫВЧАТКА ================== */
document.querySelectorAll('.exp').forEach(el=>{
  el.onclick = ()=>{
    const v = el.dataset.exp;
    el.classList.toggle('active');

    if(selectedExp.includes(v)){
      selectedExp = selectedExp.filter(x=>x!==v);
    } else {
      selectedExp.push(v);
    }
  };
});

/* ================== МАТЕРИАЛЫ ================== */
document.querySelectorAll('.mat').forEach(el=>{
  el.onclick = ()=>{
    const v = el.dataset.mat;
    el.classList.toggle('active');

    if(selectedMat.includes(v)){
      selectedMat = selectedMat.filter(x=>x!==v);
    } else {
      selectedMat.push(v);
    }
  };
});

/* ================== ОБЪЕКТЫ ================== */
const objectMap = {
  wood: [
    ['door','Деревяная дверь'],
    ['wall','Деревяная стена'],
    ['foundation','Деревяный фундамент']
  ],
  stone: [
    ['door','Каменая дверь'],
    ['wall','Каменая стена'],
    ['foundation','Каменый фундамент']
  ],
  metal: [
    ['door','Железная дверь'],
    ['wall','Железная стена'],
    ['foundation','Железный фундамент'],
    ['ladder','Железная складная лестница'],
    ['grate','Железная решетка']
  ],
  steel: [
    ['door','Стальная дверь'],
    ['wall','Стальная стена'],
    ['foundation','Стальной фундамент'],
    ['ladder','Стальная складная лестница'],
    ['grate','Стальная решетка']
  ],
  titan: [
    ['door','Титановая дверь'],
    ['wall','Титановая стена'],
    ['foundation','Титановый фундамент'],
    ['ladder','Титановая складная лестница'],
    ['grate','Титановая решетка']
  ],
  objects: [
    ['sensor','Устройство отслеживания стрельбы'],
    ['rifle','Установка с автоматической винтовкой'],
    ['shotgun','Автоматическая установка для картечи'],
    ['bot','Торговый бот'],
    ['turret','Электромагнитная турель'],
    ['launcher','Ракетная пусковая установка']
  ]
};

function loadObjects(){
  const wrap = document.getElementById('objects');
  wrap.innerHTML = '';
  selectedObjects = {};

  selectedMat.forEach(mat=>{
    objectMap[mat].forEach(o=>{
      const key = mat+'_'+o[0];
      selectedObjects[key] = 0;

      wrap.innerHTML += `
      <div class="object-icon">
        <span>${o[1]}</span>
        <div class="counter">
          <button onclick="chg('${key}',-1)">-</button>
          <input id="c_${key}" value="0" readonly>
          <button onclick="chg('${key}',1)">+</button>
        </div>
      </div>`;
    });
  });
}

function chg(k,v){
  selectedObjects[k] = Math.max(0, selectedObjects[k] + v);
  document.getElementById('c_'+k).value = selectedObjects[k];
}
