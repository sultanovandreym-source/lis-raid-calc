// ----------------- DATA -----------------
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

const bestExplosive = {
  wood:'bobovka', stone:'bobovka', metal:'dynamite', steel:'C4', titan:'hexogen'
};

const raidData = {
  bobovka:{ wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}}, stone:{door:{count:3,sulfur:360}, wall:{count:10,sulfur:1200}, foundation:{count:40,sulfur:4800}}, metal:{door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000}, foundation:{count:400,sulfur:48000}, ladder:{count:46,sulfur:5520}, grate:{count:10,sulfur:1200}} },
  dynamite:{ metal:{door:{count:4,sulfur:2000}, wall:{count:13,sulfur:6500}, foundation:{count:50,sulfur:25000}, ladder:{count:7,sulfur:3500}, grate:{count:2,sulfur:1000}} },
  C4:{ steel:{door:{count:4,sulfur:6000}, wall:{count:13,sulfur:19500}, foundation:{count:49,sulfur:73500}, ladder:{count:6,sulfur:9000}, grate:{count:0,sulfur:0}} },
  hexogen:{ titan:{door:{count:4,sulfur:10000}, wall:{count:10,sulfur:25000}, foundation:{count:40,sulfur:100000}, ladder:{count:7,sulfur:15000}, grate:{count:0,sulfur:0}} },
  rocket:{objects:{tracker:{count:3,sulfur:4500}, auto_rifle:{count:3,sulfur:4500}, auto_shotgun:{count:3,sulfur:4500}, trader_bot:{count:13,sulfur:19500}, em_turret:{count:3,sulfur:4500}, rocket_launcher:{count:3,sulfur:4500}}}
};

// ----------------- STEPS -----------------
const steps = document.querySelectorAll('.step');
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

function showStep(n){ steps.forEach(s=>s.classList.remove('active')); steps[n].classList.add('active'); }

// ----------------- BUTTONS -----------------
document.getElementById('next1').onclick = ()=>{ 
  if(selectedExplosives.length===0){ alert('Выберите взрывчатку'); return; }
  showStep(1); 
};
document.getElementById('next2').onclick = ()=>{
  if(selectedMaterials.length===0){ alert('Выберите материалы'); return; }
  loadObjects();
  showStep(2);
};
document.getElementById('prev2').onclick = ()=>showStep(0);
document.getElementById('prev3').onclick = ()=>showStep(1);
document.getElementById('prev4').onclick = ()=>showStep(2);

// ----------------- SELECT CARDS -----------------
document.querySelectorAll('.explosive').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v)?selectedExplosives.splice(selectedExplosives.indexOf(v),1):selectedExplosives.push(v);
  }
});
document.querySelectorAll('.material').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v)?selectedMaterials.splice(selectedMaterials.indexOf(v),1):selectedMaterials.push(v);
  }
});

// ----------------- LOAD OBJECTS -----------------
function loadObjects(){
  const objectsDiv = document.getElementById('objects');
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key = `${mat}_${obj}`;
      const img = mat==='objects'?`images/${obj}.png`:`images/${mat}_${obj}.png`;
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML=`<img src="${img}"><span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="changeCount('${key}',-1)">-</button>
          <input type="number" id="${key}" value="0" min="0" onchange="manualInput('${key}',this.value)">
          <button onclick="changeCount('${key}',1)">+</button>
        </div>`;
      card.onclick=()=>{ card.classList.toggle('active'); };
      objectsDiv.appendChild(card);
      selectedObjects[key]=0;
    });
  });
}

// ----------------- COUNTERS -----------------
function changeCount(k,v){ selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v); document.getElementById(k).value=selectedObjects[k]; updateCalcButton(); }
function manualInput(k,v){ selectedObjects[k]=Math.max(0,parseInt(v)||0); document.getElementById(k).value=selectedObjects[k]; updateCalcButton(); }
function updateCalcButton(){ document.getElementById('calculate').disabled = !Object.values(selectedObjects).some(v=>v>0); }

// ----------------- CALCULATE -----------------
document.getElementById('calculate').onclick = ()=>{
  let result='';
  let totalSulfur=0;
  let summary={};
  for(let key in selectedObjects){
    const count = selectedObjects[key];
    if(!count) continue;
    const [mat,obj]=key.split('_');
    const explosive = bestExplosive[mat] || selectedExplosives[0];
    const data = raidData[explosive]?.[mat]?.[obj];
    if(!data) continue;
    const expCount = data.count*count;
    const sulfur = data.sulfur*count;
    result+=`На ${count} ${objectNames[obj]} из ${mat}:\n`;
    result+=`— ${explosive} × ${expCount}\n— Сера: ${sulfur}\n\n`;
    totalSulfur+=sulfur;
    summary[explosive]=(summary[explosive]||0)+expCount;
  }
  result+='ИТОГО:\n';
  Object.entries(summary).forEach(([e,c])=>{ result+=`${e}: ${c}\n`; });
  result+=`\nОбщая сера: ${totalSulfur}`;
  document.getElementById('result').innerText=result;
  showStep(3);
}// ----------------- DATA -----------------
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

const bestExplosive = {
  wood:'bobovka', stone:'bobovka', metal:'dynamite', steel:'C4', titan:'hexogen'
};

const raidData = {
  bobovka:{ wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}}, stone:{door:{count:3,sulfur:360}, wall:{count:10,sulfur:1200}, foundation:{count:40,sulfur:4800}}, metal:{door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000}, foundation:{count:400,sulfur:48000}, ladder:{count:46,sulfur:5520}, grate:{count:10,sulfur:1200}} },
  dynamite:{ metal:{door:{count:4,sulfur:2000}, wall:{count:13,sulfur:6500}, foundation:{count:50,sulfur:25000}, ladder:{count:7,sulfur:3500}, grate:{count:2,sulfur:1000}} },
  C4:{ steel:{door:{count:4,sulfur:6000}, wall:{count:13,sulfur:19500}, foundation:{count:49,sulfur:73500}, ladder:{count:6,sulfur:9000}, grate:{count:0,sulfur:0}} },
  hexogen:{ titan:{door:{count:4,sulfur:10000}, wall:{count:10,sulfur:25000}, foundation:{count:40,sulfur:100000}, ladder:{count:7,sulfur:15000}, grate:{count:0,sulfur:0}} },
  rocket:{objects:{tracker:{count:3,sulfur:4500}, auto_rifle:{count:3,sulfur:4500}, auto_shotgun:{count:3,sulfur:4500}, trader_bot:{count:13,sulfur:19500}, em_turret:{count:3,sulfur:4500}, rocket_launcher:{count:3,sulfur:4500}}}
};

// ----------------- STEPS -----------------
const steps = document.querySelectorAll('.step');
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

function showStep(n){ steps.forEach(s=>s.classList.remove('active')); steps[n].classList.add('active'); }

// ----------------- BUTTONS -----------------
document.getElementById('next1').onclick = ()=>{ 
  if(selectedExplosives.length===0){ alert('Выберите взрывчатку'); return; }
  showStep(1); 
};
document.getElementById('next2').onclick = ()=>{
  if(selectedMaterials.length===0){ alert('Выберите материалы'); return; }
  loadObjects();
  showStep(2);
};
document.getElementById('prev2').onclick = ()=>showStep(0);
document.getElementById('prev3').onclick = ()=>showStep(1);
document.getElementById('prev4').onclick = ()=>showStep(2);

// ----------------- SELECT CARDS -----------------
document.querySelectorAll('.explosive').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v)?selectedExplosives.splice(selectedExplosives.indexOf(v),1):selectedExplosives.push(v);
  }
});
document.querySelectorAll('.material').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v)?selectedMaterials.splice(selectedMaterials.indexOf(v),1):selectedMaterials.push(v);
  }
});

// ----------------- LOAD OBJECTS -----------------
function loadObjects(){
  const objectsDiv = document.getElementById('objects');
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key = `${mat}_${obj}`;
      const img = mat==='objects'?`images/${obj}.png`:`images/${mat}_${obj}.png`;
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML=`<img src="${img}"><span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="changeCount('${key}',-1)">-</button>
          <input type="number" id="${key}" value="0" min="0" onchange="manualInput('${key}',this.value)">
          <button onclick="changeCount('${key}',1)">+</button>
        </div>`;
      card.onclick=()=>{ card.classList.toggle('active'); };
      objectsDiv.appendChild(card);
      selectedObjects[key]=0;
    });
  });
}

// ----------------- COUNTERS -----------------
function changeCount(k,v){ selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v); document.getElementById(k).value=selectedObjects[k]; updateCalcButton(); }
function manualInput(k,v){ selectedObjects[k]=Math.max(0,parseInt(v)||0); document.getElementById(k).value=selectedObjects[k]; updateCalcButton(); }
function updateCalcButton(){ document.getElementById('calculate').disabled = !Object.values(selectedObjects).some(v=>v>0); }

// ----------------- CALCULATE -----------------
document.getElementById('calculate').onclick = ()=>{
  let result='';
  let totalSulfur=0;
  let summary={};
  for(let key in selectedObjects){
    const count = selectedObjects[key];
    if(!count) continue;
    const [mat,obj]=key.split('_');
    const explosive = bestExplosive[mat] || selectedExplosives[0];
    const data = raidData[explosive]?.[mat]?.[obj];
    if(!data) continue;
    const expCount = data.count*count;
    const sulfur = data.sulfur*count;
    result+=`На ${count} ${objectNames[obj]} из ${mat}:\n`;
    result+=`— ${explosive} × ${expCount}\n— Сера: ${sulfur}\n\n`;
    totalSulfur+=sulfur;
    summary[explosive]=(summary[explosive]||0)+expCount;
  }
  result+='ИТОГО:\n';
  Object.entries(summary).forEach(([e,c])=>{ result+=`${e}: ${c}\n`; });
  result+=`\nОбщая сера: ${totalSulfur}`;
  document.getElementById('result').innerText=result;
  showStep(3);
}
