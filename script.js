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

// ---------------- ВЫБОР ----------------
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives.splice(selectedExplosives.indexOf(v),1)
      : selectedExplosives.push(v);
  };
});

document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials.splice(selectedMaterials.indexOf(v),1)
      : selectedMaterials.push(v);
  };
});

// ---------------- НАЗВАНИЯ ОБЪЕКТОВ ----------------
const objectNames = {
  door:'Дверь',
  wall:'Стена',
  foundation:'Фундамент',
  ladder:'Складная лестница',
  grate:'Решётка',
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
  titan:['door','wall','foundation','ladder'],
  objects:['tracker','auto_rifle','auto_shotgun','trader_bot','em_turret','rocket_launcher']
};

// ---------------- ЗАГРУЗКА ОБЪЕКТОВ ----------------
function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};

  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key = `${mat}_${obj}`;
      const img = mat==='objects'
        ? `images/object_${obj}.png`
        : `images/${mat}_${obj}.png`;

      const d=document.createElement('div');
      d.className='object-icon';
      d.innerHTML=`
        <img src="${img}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <input type="number" id="c_${key}" value="0" min="0"
            onchange="manualChange('${key}',this.value)">
          <button onclick="change('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(d);
      selectedObjects[key]=0;
    });
  });
}

function change(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value=selectedObjects[k];
}
function manualChange(k,v){
  const val=Math.max(0,parseInt(v)||0);
  selectedObjects[k]=val;
}

// ---------------- ДАННЫЕ РАСЧЁТОВ ----------------
const data = {
  bobovka:{
    wood:{door:[2,240],wall:[4,480],foundation:[15,1800]},
    stone:{door:[3,360],wall:[10,1200],foundation:[40,4800]},
    metal:{door:[30,3600],wall:[100,12000],foundation:[400,48000],ladder:[46,5520]},
    steel:{door:[200,24000],wall:[667,80040],foundation:[2667,320040],ladder:[275,33000]},
    titan:{door:[800,96000],wall:[2667,320040],ladder:[1112,133440]},
    objects:{tracker:[50,6000],auto_rifle:[50,6000],auto_shotgun:[50,6000],trader_bot:[668,80160],em_turret:[50,6000],rocket_launcher:[50,6000]}
  },

  dynamite:{
    wood:{door:[1,500],wall:[2,1000],foundation:[8,4000]},
    stone:{door:[2,1000],wall:[5,2500],foundation:[20,10000]},
    metal:{door:[4,2000],wall:[13,6500],foundation:[50,25000],ladder:[7,3500]},
    steel:{door:[20,10000],wall:[67,33500],foundation:[267,133500],ladder:[28,14000]},
    titan:{door:[80,40000],wall:[200,100000],foundation:[800,800000],ladder:[112,56000]},
    objects:{tracker:[7,3500],auto_rifle:[7,3500],auto_shotgun:[7,3500],trader_bot:[68,34000],em_turret:[7,3500],rocket_launcher:[7,3500]}
  },

  c4:{
    wood:{door:[1,1500],wall:[2,3000],foundation:[5,7500]},
    stone:{door:[1,1500],wall:[4,6000],foundation:[13,19500]},
    metal:{door:[2,3000],wall:[6,9000],foundation:[24,36000],ladder:[3,4500]},
    steel:{door:[4,6000],wall:[13,19500],foundation:[49,73500],ladder:[6,9000]},
    titan:{door:[14,21000],wall:[34,51000],foundation:[136,204000],ladder:[15,22500]},
    objects:{tracker:[3,4500],auto_rifle:[3,4500],auto_shotgun:[3,4500],trader_bot:[13,19500],em_turret:[3,4500],rocket_launcher:[3,4500]}
  },

  hexogen:{
    wood:{door:[1,2500],wall:[1,2500],foundation:[2,5000]},
    stone:{door:[1,2500],wall:[2,5000],foundation:[6,15000]},
    metal:{door:[1,2500],wall:[3,7500],foundation:[10,25000],ladder:[1,2500],grate:[3,7500]},
    steel:{door:[2,5000],wall:[6,15000],foundation:[17,42500],ladder:[3,7500],grate:[6,15000]},
    titan:{door:[4,10000],wall:[10,25000],foundation:[40,100000],ladder:[7,15000]},
    objects:{tracker:[2,5000],auto_rifle:[2,5000],auto_shotgun:[2,5000],trader_bot:[6,15000],em_turret:[2,5000],rocket_launcher:[2,5000]}
  },

  rocket:{
    wood:{door:[1,1500],wall:[2,3000],foundation:[5,7500]},
    stone:{door:[1,1500],wall:[4,6000],foundation:[13,19500]},
    metal:{door:[2,3000],wall:[6,9000],foundation:[24,36000],ladder:[3,4500]},
    steel:{door:[4,6000],wall:[13,19500],foundation:[49,73500],ladder:[6,9000]},
    titan:{door:[14,21000],wall:[34,51000],foundation:[136,204000],ladder:[15,22500]},
    objects:{tracker:[3,4500],auto_rifle:[3,4500],auto_shotgun:[3,4500],trader_bot:[13,19500],em_turret:[3,4500],rocket_launcher:[3,4500]}
  }
};

// ---------------- РАСЧЁТ ----------------
function calculate(){
  let out='';
  let totalSulfur=0;
  let has=false;

  Object.entries(selectedObjects).forEach(([key,val])=>{
    if(!val) return;
    has=true;
    const [mat,obj]=key.split('_');
    out+=`${objectNames[obj]} (${mat}) x${val}\n`;

    selectedExplosives.forEach(exp=>{
      const d=data[exp]?.[mat]?.[obj];
      if(!d){
        out+=`• ${exp}: Невозможно\n`;
      }else{
        out+=`• ${exp}: ${d[0]*val} (Сера ${d[1]*val})\n`;
        totalSulfur+=d[1]*val;
      }
    });
    out+='\n';
  });

  if(!has){ alert("Выберите объекты"); return; }
  out+=`ИТОГО СЕРЫ: ${totalSulfur}`;
  document.getElementById('result').innerText=out;
  showStep(3);
    }
