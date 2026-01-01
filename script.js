const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

let selectedExplosives=[];
let selectedMaterials=[];
let selectedObjects={};

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}
function nextStep(n){
  if(n===2) loadObjects();
  showStep(n);
}
function prevStep(n){ showStep(n); }

// ===== ВЫБОР ВЗРЫВЧАТКИ =====
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives=selectedExplosives.filter(x=>x!==v)
      : selectedExplosives.push(v);
  }
});

// ===== ВЫБОР МАТЕРИАЛОВ =====
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials=selectedMaterials.filter(x=>x!==v)
      : selectedMaterials.push(v);
  }
});

// ===== ОБЪЕКТЫ =====
const objectsByMaterial={
  wood:['Дверь','Стена','Фундамент'],
  stone:['Дверь','Стена','Фундамент'],
  metal:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  steel:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  titan:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  objects:[
    'Устройство отслеживания стрельбы',
    'Установка с автоматической винтовкой',
    'Автоматическая установка для картечи',
    'Торговый бот',
    'Электромагнитная турель',
    'Ракетная пусковая установка'
  ]
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};

  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key=`${mat}_${obj}`;
      if(document.getElementById(`count-${key}`)) return;

      const div=document.createElement('div');
      div.className='object-row';
      div.innerHTML=`
        <span>${obj} (${mat})</span>
        <div class="counter">
          <button onclick="changeObjectCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeObjectCount('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(div);
      selectedObjects[key]=0;
    });
  });
}

function changeObjectCount(key,val){
  selectedObjects[key]=Math.max(0,selectedObjects[key]+val);
  document.getElementById(`count-${key}`).innerText=selectedObjects[key];
}

// ===== ДАННЫЕ =====
/* (ДАННЫЕ ТЕ ЖЕ, ЧТО ТЫ ПРИСЫЛАЛ — Я ИХ НЕ МЕНЯЛ) */
const data = /* ← здесь остаётся ТВОЙ БОЛЬШОЙ ОБЪЕКТ data
   ОН У ТЕБЯ УЖЕ ПРАВИЛЬНЫЙ, МЕНЯТЬ НЕ НУЖНО */;

// ===== РАСЧЁТ =====
function calculate(){
  let text='';
  let total=0;

  for(const key in selectedObjects){
    const qty=selectedObjects[key];
    if(qty===0) continue;

    const [mat,obj]=key.split('_');
    text+=`Объект: ${obj} (${mat}) x${qty}\n`;

    selectedExplosives.forEach(exp=>{
      const d=data?.[exp]?.[mat]?.[obj];
      if(!d){
        text+=`• ${exp}: Невозможно\n`;
      } else {
        const c=d.count*qty;
        const s=d.sulfur*qty;
        total+=s;
        text+=`• ${exp}: ${c} (Сера ${s})\n`;
      }
    });
    text+='\n';
  }

  text+=`ИТОГО СЕРЫ: ${total}`;
  document.getElementById('result').innerText=text;
  showStep(3);
}
