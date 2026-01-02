let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){
  steps.forEach(s => s.classList.remove('active'));
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
    selectedExplosives.includes(v)
      ? selectedExplosives.splice(selectedExplosives.indexOf(v),1)
      : selectedExplosives.push(v);
  }
});

// Выбор материалов
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials.splice(selectedMaterials.indexOf(v),1)
      : selectedMaterials.push(v);
  }
});

// Названия объектов
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

// Объекты по материалам
const objectsByMaterial = {
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['tracker','auto_rifle','auto_shotgun','trader_bot','em_turret','rocket_launcher']
};

// Данные по взрывчатке: количество и сера
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
    wood:{door:{count:1,sulfur:1500}, wall:{count:2,sulfur:3000}, foundation:{count:5,sulfur:7500}},
    stone:{door:{count:1,sulfur:1500}, wall:{count:4,sulfur:6000}, foundation:{count:13,sulfur:19500}},
    metal:{door:{count:2,sulfur:3000}, wall:{count:6,sulfur:9000}, foundation:{count:24,sulfur:36000}, ladder:{count:3,sulfur:4500}, grate:null},
    steel:{door:{count:4,sulfur:6000}, wall:{count:13,sulfur:19500}, foundation:{count:49,sulfur:73500}, ladder:{count:6,sulfur:9000}, grate:null},
    titan:{door:{count:14,sulfur:21000}, wall:{count:34,sulfur:51000}, foundation:{count:136,sulfur:204000}, ladder:{count:15,sulfur:22500}, grate:null},
    objects:{tracker:{count:3,sulfur:4500}, auto_rifle:{count:3,sulfur:4500}, auto_shotgun:{count:3,sulfur:4500}, trader_bot:{count:13,sulfur:19500}, em_turret:{count:3,sulfur:4500}, rocket_launcher:{count:3,sulfur:4500}}
  },
  hexogen:{
    wood:{door:{count:1,sulfur:2500}, wall:{count:1,sulfur:2500}, foundation:{count:2,sulfur:5000}},
    stone:{door:{count:1,sulfur:2500}, wall:{count:2,sulfur:5000}, foundation:{count:6,sulfur:15000}},
    metal:{door:{count:1,sulfur:2500}, wall:{count:3,sulfur:7500}, foundation:{count:10,sulfur:25000}, ladder:{count:1,sulfur:2500}, grate:{count:3,sulfur:7500}},
    steel:{door:{count:2,sulfur:5000}, wall:{count:6,sulfur:15000}, foundation:{count:17,sulfur:42500}, ladder:{count:3,sulfur:7500}, grate:{count:6,sulfur:15000}},
    titan:{door:{count:4,sulfur:10000}, wall:{count:10,sulfur:25000}, foundation:{count:40,sulfur:100000}, ladder:{count:7,sulfur:15000}, grate:null},
    objects:{tracker:{count:2,sulfur:5000}, auto_rifle:{count:2,sulfur:5000}, auto_shotgun:{count:2,sulfur:5000}, trader_bot:{count:6,sulfur:15000}, em_turret:{count:2,sulfur:5000}, rocket_launcher:{count:2,sulfur:5000}}
  },
  rocket:{
    wood:{door:{count:1,sulfur:1500}, wall:{count:2,sulfur:3000}, foundation:{count:5,sulfur:7500}},
    stone:{door:{count:1,sulfur:1500}, wall:{count:4,sulfur:6000}, foundation:{count:13,sulfur:19500}},
    metal:{door:{count:2,sulfur:3000}, wall:{count:6,sulfur:9000}, foundation:{count:24,sulfur:36000}, ladder:{count:3,sulfur:4500}, grate:null},
    steel:{door:{count:4,sulfur:6000}, wall:{count:13,sulfur:19500}, foundation:{count:49,sulfur:73500}, ladder:{count:6,sulfur:9000}, grate:null},
    titan:{door:{count:14,sulfur:21000}, wall:{count:34,sulfur:51000}, foundation:{count:136,sulfur:204000}, ladder:{count:15,sulfur:22500}, grate:null},
    objects:{tracker:{count:3,sulfur:4500}, auto_rifle:{count:3,sulfur:4500}, auto_shotgun:{count:3,sulfur:4500}, trader_bot:{count:13,sulfur:19500}, em_turret:{count:3,sulfur:4500}, rocket_launcher:{count:3,sulfur:4500}}
  }
};

// Загрузка объектов
function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};

  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key = `${mat}_${obj}`;
      const img = mat==='objects' ? `images/${obj}.png` : `images/${mat}_${obj}.png`;

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

// Расчет
function calculate(){
  let totalSulfur=0;
  let output='';
  let hasObjects=false;

  Object.entries(selectedObjects).forEach(([key,val])=>{
    if(val===0) return;
    hasObjects=true;
    const [mat,obj]=key.split('_');

    output+=`${objectNames[obj]} (${materialName(mat)}) x${val}\n`;

    selectedExplosives.forEach(exp=>{
      const v = data[exp]?.[mat]?.[obj];
      if(v){
        output+=`• ${explosiveName(exp)}: ${v.count*val} шт (Сера: ${v.sulfur*val})\n`;
        totalSulfur += v.sulfur*val;
      } else {
        output+=`• ${explosiveName(exp)}: Невозможно\n`;
      }
    });
    output+='\n';
  });

  if(!hasObjects){ alert("Выберите хотя бы один объект"); return; }

  output += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = output;
  showStep(3);
}

function materialName(mat){
  switch(mat){
    case 'wood': return 'Деревянная';
    case 'stone': return 'Каменная';
    case 'metal': return 'Железная';
    case 'steel': return 'Стальная';
    case 'titan': return 'Титановая';
    case 'objects': return '';
    default: return mat;
  }
}

function explosiveName(exp){
  switch(exp){
    case 'bobovka': return 'Бобовка';
    case 'dynamite': return 'Динамит';
    case 'c4': return 'C4';
    case 'hexogen': return 'Гексоген';
    case 'rocket': return 'Ракета';
    default: return exp;
  }
}
