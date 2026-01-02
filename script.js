let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

// ------------------- СТЕПЫ -------------------
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

// ------------------- ВЫБОР КАРТОЧЕК -------------------
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

// ------------------- ОБЪЕКТЫ -------------------
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

// ------------------- РЕЙД ДАННЫЕ -------------------
const bestExplosive = { wood:'бобовка', stone:'бобовка', metal:'динамит', steel:'С4', titan:'гексоген', objects:'гексоген' };
const raidData = { /* сюда вставь данные из твоих таблиц для всех взрывов и материалов */ };

// ------------------- ФУНКЦИИ -------------------
function showStep(n){ steps.forEach(s=>s.classList.remove('active')); steps[n].classList.add('active'); }

function loadObjects(){
  objectsDiv.innerHTML=''; selectedObjects={};
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
      objectsDiv.appendChild(card);
      selectedObjects[key]=0;
    });
  });
  updateCalcButton();
}

function changeCount(k,v){ 
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById(k).value = selectedObjects[k];
  updateCalcButton();
}
function manualInput(k,v){ 
  selectedObjects[k]=Math.max(0,parseInt(v)||0);
  document.getElementById(k).value=selectedObjects[k];
  updateCalcButton();
}
function updateCalcButton(){ 
  document.getElementById('calculate').disabled = !Object.values(selectedObjects).some(v=>v>0); 
}

// ------------------- РАСЧЕТ -------------------
document.getElementById('calculate').onclick = ()=>{
  let result=''; let totalSulfur=0; let summary={};
  for(let key in selectedObjects){
    const count = selectedObjects[key];
    if(count===0) continue;
    const [mat,obj]=key.split('_');
    const explosive = bestExplosive[mat] || selectedExplosives[0];
    const data = raidData[explosive]?.[mat]?.[obj];
    if(!data) continue;
    const expCount = data.count*count;
    const sulfur = data.sulfur*count;
    result+=`На ${count} ${objectNames[obj]} (${getMaterialName(mat)}):\n— ${explosive} × ${expCount}\n— Сера: ${sulfur}\n\n`;
    totalSulfur+=sulfur;
    summary[explosive]=(summary[explosive]||0)+expCount;
  }
  result+='ИТОГО:\n';
  for(const e in summary) result+=`${e}: ${summary[e]}\n`;
  result+=`\nОбщая сера: ${totalSulfur}`;
  document.getElementById('result').innerText=result;
  showStep(3);
};

function getMaterialName(mat){
  switch(mat){
    case 'wood': return 'Дерево';
    case 'stone': return 'Камень';
    case 'metal': return 'Металл';
    case 'steel': return 'Сталь';
    case 'titan': return 'Титан';
    case 'objects': return 'Объекты';
    default: return mat;
  }
}
