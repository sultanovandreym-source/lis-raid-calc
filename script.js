let selectedExplosives=[];
let selectedMaterials=[];
let selectedObjects={};

const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}
function nextStep(n){
  if(n===2) loadObjects();
  showStep(n);
}
function prevStep(n){ showStep(n); }

// взрывчатка
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives=selectedExplosives.filter(x=>x!==v)
      : selectedExplosives.push(v);
  }
});

// материалы
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
  door:'Дверь',wall:'Стена',foundation:'Фундамент',
  ladder:'Лестница',grate:'Решётка',
  tracker:'Трекер стрельбы',
  auto_rifle:'Автоматическая винтовка',
  auto_shotgun:'Картечница',
  trader_bot:'Торговый бот',
  em_turret:'ЭМ Турель',
  rocket_launcher:'Ракетная установка'
};

const objectImages={
  tracker:'tracker.png',
  auto_rifle:'auto_rifle.png',
  auto_shotgun:'auto_shotgun.png',
  trader_bot:'trader_bot.png',
  em_turret:'em_turret.png',
  rocket_launcher:'rocket_launcher.png'
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
    objectsByMaterial[mat]?.forEach(obj=>{
      const key=`${mat}_${obj}`;
      const img = mat==='objects'
        ? `images/${objectImages[obj]}`
        : `images/${mat}_${obj}.png`;

      objectsDiv.innerHTML+=`
        <div class="object-icon">
          <img src="${img}">
          <span>${objectNames[obj]}</span>
          <div class="counter">
            <button onclick="change('${key}',-1)">-</button>
            <span id="c_${key}">0</span>
            <button onclick="change('${key}',1)">+</button>
          </div>
        </div>`;
      selectedObjects[key]=0;
    });
  });
}

function change(k,v){
  selectedObjects[k]=Math.max(0,selectedObjects[k]+v);
  document.getElementById('c_'+k).innerText=selectedObjects[k];
}

const data={
  bobovka:{
    wood:{door:{count:2,sulfur:240}},
    stone:{door:{count:6,sulfur:720}},
    metal:{door:{count:30,sulfur:3600}},
    steel:{door:{count:40,sulfur:4800}},
    titan:{door:{count:60,sulfur:7200}}
  }
};

function calculate(){
  let out='';
  let total=0;

  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    const [mat,obj]=k.split('_');

    selectedExplosives.forEach(exp=>{
      const d=data[exp]?.[mat]?.[obj];
      if(d){
        out+=`${objectNames[obj]} (${mat}) x${v}\n`;
        out+=`  ${exp}: ${d.count*v}\n`;
        total+=d.sulfur*v;
      }
    });
  });

  document.getElementById('result').innerText=
    out? out+`\nВсего серы: ${total}`:'Ничего не выбрано';

  showStep(3);
}
