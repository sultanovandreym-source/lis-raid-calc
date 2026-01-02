let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n) {
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}

// Навигация
document.getElementById('next1').onclick = () => {
  if(selectedExplosives.length === 0){ alert('Выберите хотя бы одну взрывчатку'); return; }
  showStep(1);
};
document.getElementById('prev2').onclick = () => showStep(0);
document.getElementById('next2').onclick = () => {
  if(selectedMaterials.length === 0){ alert('Выберите хотя бы один материал'); return; }
  loadObjects();
  showStep(2);
};
document.getElementById('prev3').onclick = () => showStep(1);
document.getElementById('prev4').onclick = () => showStep(2);

// Выбор взрывчатки
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v = e.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives = selectedExplosives.filter(x=>x!==v)
      : selectedExplosives.push(v);
  }
});

// Выбор материалов
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v = e.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials = selectedMaterials.filter(x=>x!==v)
      : selectedMaterials.push(v);
  }
});

// Объекты
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
        <img src="${img}" alt="${objectNames[obj]}">
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

function change(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).innerText=selectedObjects[k];
}

// Данные взрывчатки (пример)
const data = {
  bobovka: { wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}}, metal:{door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000}, ladder:{count:46,sulfur:5520}, grate:{count:10,sulfur:1200}}, steel:{door:{count:200,sulfur:24000}, wall:{count:667,sulfur:80040}, foundation:{count:2667,sulfur:320040}, ladder:{count:275,sulfur:33000}, grate:{count:10,sulfur:1200}}, titan:{door:{count:800,sulfur:96000}, wall:{count:2667,sulfur:320040}, foundation:{count:5000,sulfur:600000}, ladder:{count:1112,sulfur:133440}, grate:{count:50,sulfur:6000}}, objects:{tracker:{count:50,sulfur:6000}, auto_rifle:{count:50,sulfur:6000}, auto_shotgun:{count:50,sulfur:6000}, trader_bot:{count:668,sulfur:80160}, em_turret:{count:50,sulfur:6000}, rocket_launcher:{count:50,sulfur:6000}} },
  dynamite: { wood:{door:{count:1,sulfur:500}, wall:{count:2,sulfur:1000}}, metal:{door:{count:4,sulfur:2000}, wall:{count:13,sulfur:6500}, ladder:{count:7,sulfur:3500}, grate:{count:2,sulfur:1000}} },
  c4: { wood:{door:{count:1,sulfur:1500}}, metal:{door:{count:2,sulfur:3000}} },
  hexogen: { wood:{door:{count:1,sulfur:2500}}, metal:{door:{count:1,sulfur:2500}} },
  rocket: { wood:{door:{count:1,sulfur:1500}}, metal:{door:{count:2,sulfur:3000}} }
};

// Расчёт
document.getElementById('calculateBtn').onclick = () => {
  const selectedQty = Object.values(selectedObjects).some(v => v>0);
  if(!selectedQty){ alert('Выберите хотя бы один объект с количеством'); return; }

  let res='';
  let totalSulfur=0;
  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(v===0) return;
    const [mat,obj]=k.split('_');
    res+=`${objectNames[obj]} (${mat}) x${v}\n`;
    selectedExplosives.forEach(exp=>{
      const val = data[exp]?.[mat]?.[obj];
      if(val){ res+=`• ${exp}: ${val.count*v} (Сера: ${val.sulfur*v})\n`; totalSulfur+=val.sulfur*v; }
      else res+=`• ${exp}: Невозможно\n`;
    });
    res+='\n';
  });
  res+=`Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText=res;
  showStep(3);
};
