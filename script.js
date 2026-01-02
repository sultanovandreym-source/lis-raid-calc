let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n===1 && selectedExplosives.length===0){ alert("Выберите взрывчатку"); return; }
  if(n===2 && selectedMaterials.length===0){ alert("Выберите материалы"); return; }

  if(n===2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

// Выбор взрывчатки
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v) ? selectedExplosives.splice(selectedExplosives.indexOf(v),1) : selectedExplosives.push(v);
  }
});

// Выбор материалов
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v) ? selectedMaterials.splice(selectedMaterials.indexOf(v),1) : selectedMaterials.push(v);
  }
});

// Объекты
const objectNames = {
  door:'Дверь', wall:'Стена', foundation:'Фундамент',
  ladder:'Складная лестница', grate:'Решетка',
  tracker:'Устройство отслеживания стрельбы',
  auto_rifle:'Установка с автоматической винтовкой',
  auto_shotgun:'Автоматическая установка для картечи',
  trader_bot:'Торговый бот',
  em_turret:'Электромагнитная турель',
  rocket_launcher:'Ракетная пусковая установка'
};

const objectsByMaterial = {
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['tracker','auto_rifle','auto_shotgun','trader_bot','em_turret','rocket_launcher']
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};

  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key = `${mat}_${obj}`;
      const img = mat==='objects' ? `images/object_${obj}.png` : `images/${mat}_${obj}.png`;

      const d = document.createElement('div');
      d.className='object-icon';
      d.innerHTML=`
        <img src="${img}" alt="${objectNames[obj]}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <input type="number" id="c_${key}" value="0" min="0" onchange="manualChange('${key}',this.value)">
          <button onclick="change('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(d);
      selectedObjects[key]=0;
    });
  });
}

function change(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value = selectedObjects[k];
}

function manualChange(k,v){
  const val = Math.max(0, parseInt(v)||0);
  selectedObjects[k] = val;
  document.getElementById('c_'+k).value = val;
}

// Данные для расчета взрывчатки (бобовка, динамит, C4, гексоген, ракета)
// Здесь вставьте все значения, которые вы прислали для всех материалов и объектов
const data = {
  bobovka:{
    wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}},
    stone:{door:{count:3,sulfur:360}, wall:{count:10,sulfur:1200}, foundation:{count:40,sulfur:4800}},
    metal:{door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000}, foundation:{count:400,sulfur:48000}, ladder:{count:46,sulfur:5520}, grate:null},
    steel:{door:{count:200,sulfur:24000}, wall:{count:667,sulfur:80040}, foundation:{count:2667,sulfur:320040}, ladder:{count:275,sulfur:33000}, grate:null},
    titan:{door:{count:800,sulfur:96000}, wall:{count:2667,sulfur:320040}, foundation:null, ladder:{count:1112,sulfur:133440}, grate:null},
    objects:{tracker:{count:50,sulfur:6000}, auto_rifle:{count:50,sulfur:6000}, auto_shotgun:{count:50,sulfur:6000}, trader_bot:{count:668,sulfur:80160}, em_turret:{count:50,sulfur:6000}, rocket_launcher:{count:50,sulfur:6000}}
  },
  dynamite:{
    wood:{door:{count:1,sulfur:500}, wall:{count:2,sulfur:1000}, foundation:{count:8,sulfur:4000}},
    stone:{door:{count:2,sulfur:1000}, wall:{count:5,sulfur:2500}, foundation:{count:20,sulfur:10000}},
    metal:{door:{count:4,sulfur:2000}, wall:{count:13,sulfur:6500}, foundation:{count:50,sulfur:25000}, ladder:{count:7,sulfur:3500}, grate:null},
    steel:{door:{count:20,sulfur:10000}, wall:{count:67,sulfur:33500}, foundation:{count:267,sulfur:133500}, ladder:{count:28,sulfur:14000}, grate:null},
    titan:{door:{count:80,sulfur:40000}, wall:{count:200,sulfur:100000}, foundation:{count:800,sulfur:800000}, ladder:{count:112,sulfur:56000}, grate:null},
    objects:{tracker:{count:7,sulfur:3500}, auto_rifle:{count:7,sulfur:3500}, auto_shotgun:{count:7,sulfur:3500}, trader_bot:{count:68,sulfur:34000}, em_turret:{count:7,sulfur:3500}, rocket_launcher:{count:7,sulfur:3500}}
  },
  c4:{
    // Аналогично вставьте данные по C4
  },
  hexogen:{
    // Аналогично вставьте данные по гексоген
  },
  rocket:{
    // Аналогично вставьте данные по ракете
  }
};

function calculate(){
  let totalSulfur=0;
  let output='';
  let hasObjects=false;

  Object.entries(selectedObjects).forEach(([key,val])=>{
    if(val===0) return;
    hasObjects=true;
    const [mat,obj]=key.split('_');
    output+=`${objectNames[obj]} (${mat}) x${val}\n`;

    selectedExplosives.forEach(exp=>{
      const v = data[exp]?.[mat]?.[obj];
      if(v){
        output+=`• ${exp}: ${v.count*val} (Сера: ${v.sulfur*val})\n`;
        totalSulfur+=v.sulfur*val;
      } else {
        output+=`• ${exp}: Невозможно разрушить выбранный объект данной взрывчаткой\n`;
      }
    });
    output+='\n';
  });

  if(!hasObjects){ alert("Выберите хотя бы один объект"); return; }

  output += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = output;
  showStep(3);
}
