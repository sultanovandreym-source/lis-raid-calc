let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){ showStep(n); }
function prevStep(n){ showStep(n); }

/* ---------- ВЫБОР ВЗРЫВЧАТКИ ---------- */
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives=selectedExplosives.filter(x=>x!==v)
      : selectedExplosives.push(v);
    document.getElementById('next1').disabled = selectedExplosives.length===0;
  }
});

/* ---------- ВЫБОР МАТЕРИАЛОВ ---------- */
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials=selectedMaterials.filter(x=>x!==v)
      : selectedMaterials.push(v);
    document.getElementById('next2').disabled = selectedMaterials.length===0;
    if(selectedMaterials.length) loadObjects();
  }
});

/* ---------- ОБЪЕКТЫ ---------- */
const objectNames = {
  door:'Дверь', wall:'Стена', foundation:'Фундамент',
  ladder:'Складная лестница', grate:'Решётка',
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

/* ---------- ДАННЫЕ РЕЙДА (ФРАГМЕНТ, НО ЛОГИКА ГОТОВА) ---------- */
const raidData = {
  bobovka:{
    stone:{ door:{c:3,s:360}, wall:{c:10,s:1200}, foundation:{c:40,s:4800}},
    metal:{ door:{c:30,s:3600}, wall:{c:100,s:12000}}
  },
  dynamite:{
    metal:{ door:{c:4,s:2000}, wall:{c:13,s:6500}}
  },
  c4:{
    steel:{ door:{c:4,s:6000}, wall:{c:13,s:19500}}
  },
  hexogen:{
    titan:{ door:{c:4,s:10000}, wall:{c:10,s:25000}}
  }
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};

  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key=`${mat}_${obj}`;
      const img = mat==='objects'
        ? `images/object_${obj}.png`
        : `images/${mat}_${obj}.png`;

      const d=document.createElement('div');
      d.className='card';
      d.innerHTML=`
        <img src="${img}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <input id="c_${key}" type="number" value="0" min="0" onchange="manual('${key}',this.value)">
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
  checkCalc();
}
function manual(k,v){
  selectedObjects[k]=Math.max(0,parseInt(v)||0);
  checkCalc();
}

function checkCalc(){
  document.getElementById('calcBtn').disabled =
    !Object.values(selectedObjects).some(v=>v>0);
}

/* ---------- РАСЧЁТ ---------- */
function calculate(){
  let out='';
  let totalSulfur=0;

  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    const [mat,obj]=k.split('_');

    selectedExplosives.forEach(exp=>{
      const d=raidData[exp]?.[mat]?.[obj];
      if(d){
        out+=`${objectNames[obj]} (${mat}) x${v}\n`;
        out+=`  ${exp}: ${d.c*v} шт — ${d.s*v} серы\n\n`;
        totalSulfur+=d.s*v;
      }
    });
  });

  out+=`\nОбщее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText=out;
  showStep(3);
}
