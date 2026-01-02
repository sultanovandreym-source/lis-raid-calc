let step = 0;
const steps = document.querySelectorAll('.step');

const selectedExplosives = new Set();
const selectedMaterials = new Set();
const objectCounts = {};

/* ===== ВЗРЫВЧАТКА ===== */
const explosives = [
  { id: 'bobovka', name: 'Бобовка' },
  { id: 'dynamite', name: 'Динамит' },
  { id: 'c4', name: 'C4' },
  { id: 'hexogen', name: 'Гексоген' },
  { id: 'rocket', name: 'Ракета' }
];

/* ===== МАТЕРИАЛЫ ===== */
const materials = [
  { id: 'wood', name: 'Дерево' },
  { id: 'stone', name: 'Камень' },
  { id: 'metal', name: 'Железо' },
  { id: 'steel', name: 'Сталь' },
  { id: 'titan', name: 'Титан' },
  { id: 'other', name: 'Прочее' }
];

/* ===== ОБЪЕКТЫ ===== */
const objectsByMaterial = {
  wood: ['door', 'wall', 'foundation'],
  stone: ['door', 'wall', 'foundation'],
  metal: ['door', 'wall', 'foundation', 'ladder', 'grate'],
  steel: ['door', 'wall', 'foundation', 'ladder', 'grate'],
  titan: ['door', 'wall', 'foundation', 'ladder', 'grate'],
  other: ['sensor', 'rifle', 'shotgun', 'bot', 'turret', 'launcher']
};

const objectNames = {
  door: 'Дверь',
  wall: 'Стена',
  foundation: 'Фундамент',
  ladder: 'Складная лестница',
  grate: 'Решетка',
  sensor: 'Устройство отслеживания стрельбы',
  rifle: 'Установка с автоматической винтовкой',
  shotgun: 'Автоматическая установка для картечи',
  bot: 'Торговый бот',
  turret: 'Электромагнитная турель',
  launcher: 'Ракетная пусковая установка'
};

/* ===== ЦИФРЫ (ВСЕ) ===== */
const raid = {
  bobovka: {
    wood:{door:[2,240],wall:[4,480],foundation:[15,1800]},
    stone:{door:[3,360],wall:[10,1200],foundation:[40,4800]},
    metal:{door:[30,3600],wall:[100,12000],foundation:[400,48000],ladder:[46,5520],grate:null},
    steel:{door:[200,24000],wall:[667,80040],foundation:[2667,320040],ladder:[275,33000],grate:null},
    titan:{door:[800,96000],wall:[2667,320040],foundation:null,ladder:[1112,133440],grate:null},
    other:{sensor:[50,6000],rifle:[50,6000],shotgun:[50,6000],bot:[668,80160],turret:[50,6000],launcher:[50,6000]}
  },
  dynamite: {
    wood:{door:[1,500],wall:[2,1000],foundation:[8,4000]},
    stone:{door:[2,1000],wall:[5,2500],foundation:[20,10000]},
    metal:{door:[4,2000],wall:[13,6500],foundation:[50,25000],ladder:[7,3500],grate:null},
    steel:{door:[20,10000],wall:[67,33500],foundation:[267,133500],ladder:[28,14000],grate:null},
    titan:{door:[80,40000],wall:[200,100000],foundation:[800,800000],ladder:[112,56000],grate:null},
    other:{sensor:[7,3500],rifle:[7,3500],shotgun:[7,3500],bot:[68,34000],turret:[7,3500],launcher:[7,3500]}
  },
  c4: {
    wood:{door:[1,1500],wall:[2,3000],foundation:[5,7500]},
    stone:{door:[1,1500],wall:[4,6000],foundation:[13,19500]},
    metal:{door:[2,3000],wall:[6,9000],foundation:[24,36000],ladder:[3,4500],grate:null},
    steel:{door:[4,6000],wall:[13,19500],foundation:[49,73500],ladder:[6,9000],grate:null},
    titan:{door:[14,21000],wall:[34,51000],foundation:[136,204000],ladder:[15,22500],grate:null},
    other:{sensor:[3,4500],rifle:[3,4500],shotgun:[3,4500],bot:[13,19500],turret:[3,4500],launcher:[3,4500]}
  },
  hexogen: {
    wood:{door:[1,2500],wall:[1,2500],foundation:[2,5000]},
    stone:{door:[1,2500],wall:[2,5000],foundation:[6,15000]},
    metal:{door:[1,2500],wall:[3,7500],foundation:[10,25000],ladder:[1,2500],grate:[3,7500]},
    steel:{door:[2,5000],wall:[6,15000],foundation:[17,42500],ladder:[3,7500],grate:[6,15000]},
    titan:{door:[4,10000],wall:[10,25000],foundation:[40,100000],ladder:[7,17500],grate:null},
    other:{sensor:[2,5000],rifle:[2,5000],shotgun:[2,5000],bot:[6,15000],turret:[2,5000],launcher:[2,5000]}
  },
  rocket: {
    wood:{door:[1,1500],wall:[2,3000],foundation:[5,7500]},
    stone:{door:[1,1500],wall:[4,6000],foundation:[13,19500]},
    metal:{door:[2,3000],wall:[6,9000],foundation:[24,36000],ladder:[3,4500],grate:null},
    steel:{door:[4,6000],wall:[13,19500],foundation:[49,73500],ladder:[6,9000],grate:null},
    titan:{door:[14,21000],wall:[34,51000],foundation:[136,204000],ladder:[15,22500],grate:null},
    other:{sensor:[3,4500],rifle:[3,4500],shotgun:[3,4500],bot:[13,19500],turret:[3,4500],launcher:[3,4500]}
  }
};

/* ===== НАВИГАЦИЯ ===== */
function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n===1 && !selectedExplosives.size) return alert('Выберите взрывчатку');
  if(n===2 && !selectedMaterials.size) return alert('Выберите материал');
  if(n===2) renderObjects();
  showStep(n);
}
function prevStep(n){showStep(n);}

/* ===== РЕНДЕР ===== */
function renderExplosives(){
  const el=document.getElementById('explosives');
  explosives.forEach(e=>{
    const d=document.createElement('div');
    d.className='cell';
    d.innerText=e.name;
    d.onclick=()=>{
      d.classList.toggle('active');
      selectedExplosives.has(e.id)?selectedExplosives.delete(e.id):selectedExplosives.add(e.id);
    };
    el.appendChild(d);
  });
}

function renderMaterials(){
  const el=document.getElementById('materials');
  materials.forEach(m=>{
    const d=document.createElement('div');
    d.className='cell';
    d.innerText=m.name;
    d.onclick=()=>{
      d.classList.toggle('active');
      selectedMaterials.has(m.id)?selectedMaterials.delete(m.id):selectedMaterials.add(m.id);
    };
    el.appendChild(d);
  });
}

function renderObjects(){
  const el=document.getElementById('objects');
  el.innerHTML='';
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key=mat+'_'+obj;
      objectCounts[key]=0;
      el.innerHTML+=`
        <div class="cell compact">
          <div>${objectNames[obj]}</div>
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
  objectCounts[k]=Math.max(0,(objectCounts[k]||0)+v);
  document.getElementById('c_'+k).value=objectCounts[k];
}

/* ===== РАСЧЕТ ===== */
function calculate(){
  let out='',sulfur=0;
  for(const [k,c] of Object.entries(objectCounts)){
    if(!c) continue;
    const [m,o]=k.split('_');
    out+=`${objectNames[o]} x${c}\n`;
    selectedExplosives.forEach(e=>{
      const d=raid[e][m][o];
      if(d===null) out+=' ❌ Невозможно\n';
      else{
        sulfur+=d[1]*c;
        out+=` ${e.toUpperCase()}: ${d[0]*c} (${d[1]*c} серы)\n`;
      }
    });
    out+='\n';
  }
  out+=`ИТОГО СЕРЫ: ${sulfur}`;
  document.getElementById('result').innerText=out;
  showStep(3);
}

/* ===== СТАРТ ===== */
renderExplosives();
renderMaterials();
