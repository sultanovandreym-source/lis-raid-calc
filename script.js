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
  ladder:'Складная лестница', grate:'Решётка',
  tracker:'Устройство отслеживания стрельбы',
  auto_rifle:'Автоматическая винтовка',
  auto_shotgun:'Автоматическая картечь',
  trader_bot:'Торговый бот',
  em_turret:'Электромагнитная турель',
  rocket_launcher:'Ракетная установка'
};

const objectsByMaterial = {
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['object_tracker','object_auto_rifle','object_auto_shotgun','object_trader_bot','object_em_turret','object_rocket_launcher']
};

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
        <img src="${img}" alt="${objectNames[obj.replace('object_','')] || obj}">
        <span>${objectNames[obj.replace('object_','')] || obj}</span>
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

// Данные взрывчатки (пример)
const data = {
  bobovka:{ wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}}, metal:{door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000}, foundation:{count:400,sulfur:48000}, ladder:{count:46,sulfur:5520}, grate:{count:10,sulfur:1200} } },
  dynamite:{ wood:{door:{count:1,sulfur:500}, wall:{count:2,sulfur:1000}}, metal:{door:{count:4,sulfur:2000}, wall:{count:13,sulfur:6500}, foundation:{count:50,sulfur:25000}, ladder:{count:7,sulfur:3500}, grate:{count:2,sulfur:1000} } }
};

function calculate(){
  let totalSulfur=0;
  let output='';
  let hasObjects=false;

  Object.entries(selectedObjects).forEach(([key,val])=>{
    if(val===0) return;
    hasObjects=true;
    const [mat,obj]=key.split('_');
    output+=`${objectNames[obj.replace('object_','')] || obj} (${mat}) x${val}\n`;

    selectedExplosives.forEach(exp=>{
      const v = data[exp]?.[mat]?.[obj.replace('object_','')] || data[exp]?.[mat]?.[obj];
      if(v){
        output+=`• ${exp}: ${v.count*val} (Сера: ${v.sulfur*val})\n`;
        totalSulfur+=v.sulfur*val;
      } else {
        output+=`• ${exp}: Невозможно\n`;
      }
    });
    output+='\n';
  });

  if(!hasObjects){ alert("Выберите хотя бы один объект"); return; }

  output += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText = output;
  showStep(3);
}
