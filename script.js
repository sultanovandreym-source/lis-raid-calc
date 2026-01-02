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
  bobovka:{ /* данные как ранее */ },
  dynamite:{ /* данные как ранее */ },
  c4:{ /* данные как ранее */ },
  hexogen:{ /* данные как ранее */ },
  rocket:{} 
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
