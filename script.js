let selectedExplosives=[];
let selectedMaterials=[];
let selectedObjects={};

const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

function showStep(n){ steps.forEach(s=>s.classList.remove('active')); steps[n].classList.add('active'); }
function nextStep(n){ if(n===2) loadObjects(); showStep(n); }
function prevStep(n){ showStep(n); }

// выбор взрывчатки
document.querySelectorAll('.exp').forEach(e=>{ e.onclick=()=>toggle(e,selectedExplosives,e.dataset.exp); });
// выбор материалов
document.querySelectorAll('.mat').forEach(e=>{ e.onclick=()=>toggle(e,selectedMaterials,e.dataset.mat); });

function toggle(el, arr, val){ el.classList.toggle('active'); arr.includes(val)?arr.splice(arr.indexOf(val),1):arr.push(val); }

const objectNames={
  door:'Дверь', wall:'Стена', foundation:'Фундамент',
  ladder:'Складная лестница', grate:'Решётка',
  tracker:'Устройство отслеживания стрельбы',
  auto_rifle:'Автоматическая винтовка',
  auto_shotgun:'Автоматическая картечь',
  trader_bot:'Торговый бот',
  em_turret:'Электромагнитная турель',
  rocket_launcher:'Ракетная установка'
};

const objectsByMaterial={
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder'],
  objects:['tracker','auto_rifle','auto_shotgun','trader_bot','em_turret','rocket_launcher']
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat]?.forEach(obj=>{
      const key=`${mat}_${obj}`;
      const img=mat==='objects'?`images/${obj}.png`:`images/${mat}_${obj}.png`;
      const d=document.createElement('div');
      d.className='object-icon';
      d.innerHTML=`
        <img src="${img}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <span id="c_${key}">0</span>
          <button onclick="change('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(d);
      selectedObjects[key]=0;
    });
  });
}

function change(k,v){ selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v); document.getElementById('c_'+k).innerText=selectedObjects[k]; }

// Простейшие данные взрывчатки для теста
const data={
  bobovka:{ wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}}, metal:{door:{count:30,sulfur:3600}} },
  dynamite:{ wood:{door:{count:1,sulfur:500}}, metal:{door:{count:4,sulfur:2000}} },
  c4:{ wood:{door:{count:1,sulfur:1500}}, metal:{door:{count:2,sulfur:3000}} },
  hexogen:{ wood:{door:{count:1,sulfur:2500}}, metal:{door:{count:1,sulfur:2500}} },
  rocket:{ wood:{door:{count:1,sulfur:1500}}, metal:{door:{count:2,sulfur:3000}} }
};

function calculate(){
  let res='', total=0;
  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    const [mat,obj]=k.split('_');
    res+=`${objectNames[obj]} (${mat}) x${v}\n`;
    selectedExplosives.forEach(exp=>{
      const val=data[exp]?.[mat]?.[obj];
      if(val){ res+=`• ${exp}: ${val.count*v} (Сера: ${val.sulfur*v})\n`; total+=val.sulfur*v; }
      else res+=`• ${exp}: Невозможно\n`;
    });
    res+='\n';
  });
  res+=`Общее количество серы: ${total}`;
  document.getElementById('result').innerText=res||'Ничего не выбрано';
  showStep(3);
}
