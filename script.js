let selectedExplosives=[], selectedMaterials=[], selectedObjects={};
const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

function showStep(n){ 
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n===1 && selectedExplosives.length===0){ alert("Выберите хотя бы одну взрывчатку"); return; }
  if(n===2 && selectedMaterials.length===0){ alert("Выберите хотя бы один материал"); return; }
  if(n===2) loadObjects();
  showStep(n);
}
function prevStep(n){ showStep(n); }

// Выбор взрывчатки
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives=selectedExplosives.filter(x=>x!==v)
      : selectedExplosives.push(v);
  }
});

// Выбор материалов
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials=selectedMaterials.filter(x=>x!==v)
      : selectedMaterials.push(v);
  }
});

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
      const img = mat==='objects' ? `images/${obj}.png` : `images/${mat}_${obj}.png`;
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

const data={
  bobovka:{ wood:{door:{count:2,sulfur:240},wall:{count:4,sulfur:480},foundation:{count:15,sulfur:1800}}, metal:{door:{count:30,sulfur:3600},wall:{count:100,sulfur:12000},foundation:{count:400,sulfur:48000},ladder:{count:46,sulfur:5520},grate:{count:10,sulfur:1200}} },
  dynamite:{ wood:{door:{count:1,sulfur:500},wall:{count:2,sulfur:1000}}, metal:{door:{count:4,sulfur:2000},wall:{count:13,sulfur:6500},foundation:{count:50,sulfur:25000},ladder:{count:7,sulfur:3500},grate:{count:5,sulfur:2500}} }
  // Добавьте остальные взрывчатки
};

function calculate(){
  let res=''; let total=0;
  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    const [mat,obj]=k.split('_');
    res+=`${objectNames[obj]} (${mat}) x${v}\n`;
    selectedExplosives.forEach(exp=>{
      const val=data[exp]?.[mat]?.[obj];
      if(val){ res+=`• ${exp}: ${val.count*v} (Сера: ${val.sulfur*v})\n`; total+=val.sulfur*v; }
      else res+=`• ${exp}: Невозможно\n`;
    });
    res+='\n';
  });
  res+=`Общее количество серы: ${total}`;
  document.getElementById('result').innerText=res||'Ничего не выбрано';
  showStep(3);
}
