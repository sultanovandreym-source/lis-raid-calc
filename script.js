let step = 0;
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');
const nextButtons = document.querySelectorAll('button');

function showStep(n){
  steps.forEach((s,i)=>{
    if(i===n){
      s.classList.add('active');
      setTimeout(()=>{ s.style.opacity=1; s.style.transform='translateY(0)'; },10);
    } else {
      s.classList.remove('active');
      s.style.opacity=0;
      s.style.transform='translateY(10px)';
    }
  });
}

function nextStep(n){
  if(n===1 && selectedExplosives.length===0){ alert("Выберите хотя бы одну взрывчатку!"); return; }
  if(n===2 && selectedMaterials.length===0){ alert("Выберите хотя бы один материал!"); return; }
  if(n===2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

// ===== Выбор взрывчатки =====
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick = ()=>{
    e.classList.toggle('active');
    const v = e.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives = selectedExplosives.filter(x=>x!==v)
      : selectedExplosives.push(v);
  }
});

// ===== Выбор материалов =====
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick = ()=>{
    e.classList.toggle('active');
    const v = e.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials = selectedMaterials.filter(x=>x!==v)
      : selectedMaterials.push(v);
  }
});

// ===== Объекты =====
const objectNames={
  door:'Дверь', wall:'Стена', foundation:'Фундамент',
  ladder:'Складная лестница', grate:'Решётка',
  tracker:'Устройство отслеживания стрельбы',
  auto_rifle:'Автоматическая винтовка',
  auto_shotgun:'Автоматическая картечь',
  trader_bot:'Торговый бот',
  em_turret:'Электромагнитная турель',
  rocket_launcher:'Ракетная установка'
};

const objectsByMaterial={
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
      const key=`${mat}_${obj}`;
      const img = mat==='objects'
        ? `images/${obj}.png`
        : `images/${mat}_${obj}.png`;

      const d=document.createElement('div');
      d.className='object-icon';
      d.innerHTML=`
        <img src="${img}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <span id="c_${key}">0</span>
          <button onclick="change('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(d);
      selectedObjects[key]=0;
    });
  });
}

// ===== Изменение количества =====
function change(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).innerText=selectedObjects[k];
}

// ===== Данные взрывчатки =====
const data = {
  bobovka: {
    wood: {door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}},
    stone:{door:{count:3,sulfur:360}, wall:{count:10,sulfur:1200}, foundation:{count:40,sulfur:4800}},
    metal:{door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000}, foundation:{count:400,sulfur:48000}, ladder:{count:46,sulfur:5520}, grate:{count:0,sulfur:0}},
    steel:{door:{count:200,sulfur:24000}, wall:{count:667,sulfur:80040}, foundation:{count:2667,sulfur:320040}, ladder:{count:275,sulfur:33000}, grate:{count:0,sulfur:0}},
    titan:{door:{count:800,sulfur:96000}, wall:{count:2667,sulfur:320040}, foundation:{count:0,sulfur:0}, ladder:{count:1112,sulfur:133440}, grate:{count:0,sulfur:0}},
    objects:{tracker:{count:50,sulfur:6000}, auto_rifle:{count:50,sulfur:6000}, auto_shotgun:{count:50,sulfur:6000}, trader_bot:{count:668,sulfur:80160}, em_turret:{count:50,sulfur:6000}, rocket_launcher:{count:50,sulfur:6000}}
  },
  dynamite: { /* данные аналогично */ },
  c4: { /* данные аналогично */ },
  hexogen: { /* данные аналогично */ },
  rocket: { /* данные аналогично */ }
};

// ===== Расчет =====
function calculate(){
  let totalSulfur = 0;
  let res = '';

  // Проверка, что есть выбранные объекты с количеством
  const hasObjects = Object.values(selectedObjects).some(v=>v>0);
  if(!hasObjects){
    alert("Выберите хотя бы один объект и его количество!");
    return;
  }

  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(v===0) return;
    const [mat,obj] = k.split('_');
    res += `${objectNames[obj]} (${mat}) x${v}\n`;
    selectedExplosives.forEach(exp=>{
      const val = data[exp]?.[mat]?.[obj];
      if(val){
        res += `• ${exp}: ${val.count * v} (Сера: ${val.sulfur * v})\n`;
        totalSulfur += val.sulfur*v;
      } else {
        res += `• ${exp}: Невозможно (Сера: —)\n`;
      }
    });
    res+='\n';
  });

  res += `Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText=res;
  showStep(3);
}

// Инициализация
showStep(0);
