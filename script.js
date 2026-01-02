const steps = document.querySelectorAll('.step');
let step = 0;

const selectedExp = new Set();
const selectedMat = new Set();
const selectedObj = {};

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
  step = n;
}

function nextStep(n){
  if(n===1 && !selectedExp.size) return alert('Выберите взрывчатку');
  if(n===2 && !selectedMat.size) return alert('Выберите материал');
  if(n===2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

/* ================== ДАННЫЕ ================== */
const explosives = [
  ['bobovka','Бобовка'],
  ['dynamite','Динамит'],
  ['c4','C4'],
  ['hexogen','Гексоген'],
  ['rocket','Ракета']
];

const materials = [
  ['wood','Дерево'],
  ['stone','Камень'],
  ['metal','Железо'],
  ['steel','Сталь'],
  ['titan','Титан'],
  ['objects','Прочее']
];

const objectsByMat = {
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['tracker','auto_rifle','shotgun','trader','em_turret','rocket_launcher']
};

const names = {
  door:'Дверь',
  wall:'Стена',
  foundation:'Фундамент',
  ladder:'Складная лестница',
  grate:'Решетка',
  tracker:'Устройство отслеживания стрельбы',
  auto_rifle:'Установка с автоматической винтовкой',
  shotgun:'Автоматическая установка для картечи',
  trader:'Торговый бот',
  em_turret:'Электромагнитная турель',
  rocket_launcher:'Ракетная пусковая установка'
};

/* ================== РЕНДЕР ================== */
function renderGrid(id, data, set){
  const el=document.getElementById(id);
  el.innerHTML='';
  data.forEach(([key,label])=>{
    const c=document.createElement('div');
    c.className='card';
    c.innerHTML=`<img src="images/${key}.png"><span>${label}</span>`;
    c.onclick=()=>{
      c.classList.toggle('active');
      set.has(key)?set.delete(key):set.add(key);
    };
    el.appendChild(c);
  });
}

renderGrid('explosives', explosives, selectedExp);
renderGrid('materials', materials, selectedMat);

function loadObjects(){
  const el=document.getElementById('objects');
  el.innerHTML='';
  Object.keys(selectedObj).forEach(k=>delete selectedObj[k]);

  selectedMat.forEach(mat=>{
    objectsByMat[mat].forEach(obj=>{
      const key=`${mat}_${obj}`;
      selectedObj[key]=0;
      el.innerHTML+=`
      <div class="card">
        <img src="images/${mat}_${obj}.png">
        <span>${names[obj]}</span>
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
  selectedObj[k]=Math.max(0,(selectedObj[k]||0)+v);
  document.getElementById('c_'+k).value=selectedObj[k];
}

/* ================== ЦИФРЫ РЕЙДА ================== */
const RAID = {
  bobovka:{
    wood:{door:[2,240],wall:[4,480],foundation:[15,1800]},
    stone:{door:[3,360],wall:[10,1200],foundation:[40,4800]},
    metal:{door:[30,3600],wall:[100,12000],foundation:[400,48000],ladder:[46,5520]},
    steel:{door:[200,24000],wall:[667,80040],foundation:[2667,320040],ladder:[275,33000]},
    titan:{door:[800,96000],wall:[2667,320040],ladder:[1112,133440]},
    objects:{tracker:[50,6000],auto_rifle:[50,6000],shotgun:[50,6000],trader:[668,80160],em_turret:[50,6000],rocket_launcher:[50,6000]}
  },
  dynamite:{
    wood:{door:[1,500],wall:[2,1000],foundation:[8,4000]},
    stone:{door:[2,1000],wall:[5,2500],foundation:[20,10000]},
    metal:{door:[4,2000],wall:[13,6500],foundation:[50,25000],ladder:[7,3500]},
    steel:{door:[20,10000],wall:[67,33500],foundation:[267,133500],ladder:[28,14000]},
    titan:{door:[80,40000],wall:[200,100000],foundation:[800,800000],ladder:[112,56000]},
    objects:{tracker:[7,3500],auto_rifle:[7,3500],shotgun:[7,3500],trader:[68,34000],em_turret:[7,3500],rocket_launcher:[7,3500]}
  },
  c4:{
    wood:{door:[1,1500],wall:[2,3000],foundation:[5,7500]},
    stone:{door:[1,1500],wall:[4,6000],foundation:[13,19500]},
    metal:{door:[2,3000],wall:[6,9000],foundation:[24,36000],ladder:[3,4500]},
    steel:{door:[4,6000],wall:[13,19500],foundation:[49,73500],ladder:[6,9000]},
    titan:{door:[14,21000],wall:[34,51000],foundation:[136,204000],ladder:[15,22500]},
    objects:{tracker:[3,4500],auto_rifle:[3,4500],shotgun:[3,4500],trader:[13,19500],em_turret:[3,4500],rocket_launcher:[3,4500]}
  },
  hexogen:{
    wood:{door:[1,2500],wall:[1,2500],foundation:[2,5000]},
    stone:{door:[1,2500],wall:[2,5000],foundation:[6,15000]},
    metal:{door:[1,2500],wall:[3,7500],foundation:[10,25000],ladder:[1,2500],grate:[3,7500]},
    steel:{door:[2,5000],wall:[6,15000],foundation:[17,42500],ladder:[3,7500],grate:[6,15000]},
    titan:{door:[4,10000],wall:[10,25000],foundation:[40,100000],ladder:[7,15000]},
    objects:{tracker:[2,5000],auto_rifle:[2,5000],shotgun:[2,5000],trader:[6,15000],em_turret:[2,5000],rocket_launcher:[2,5000]}
  },
  rocket:{} // заполнится ниже
};
RAID.rocket = JSON.parse(JSON.stringify(RAID.c4));

/* ================== РАСЧЁТ ================== */
function calculate(){
  let out='';
  let sulfur=0;

  Object.entries(selectedObj).forEach(([k,c])=>{
    if(!c) return;
    const [mat,obj]=k.split('_');
    out+=`${names[obj]} × ${c}\n`;

    selectedExp.forEach(e=>{
      let d;
      if(mat==='objects'){
        d = RAID[e]?.objects?.[obj]; // теперь берём для «Прочее»
      } else {
        d = RAID[e]?.[mat]?.[obj];
      }

      if(d===null){
        out += `  ${e.toUpperCase()}: невозможно разрушить\n`;
      } else if(d){
        out += `  ${e.toUpperCase()}: ${d[0]*c} шт (${d[1]*c} серы)\n`;
        sulfur += d[1]*c;
      }
    });

    out+='\n';
  });

  document.getElementById('result').innerText = out ? out + `ИТОГО серы: ${sulfur}` : 'Ничего не выбрано';
  showStep(3);
}
