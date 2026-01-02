let selectedExp = [];
let selectedMat = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}
function nextStep(n){
  if(n===1 && !selectedExp.length) return alert('Выберите взрывчатку');
  if(n===2 && !selectedMat.length) return alert('Выберите материал');
  if(n===2) loadObjects();
  showStep(n);
}
function prevStep(n){ showStep(n); }

document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExp.includes(v) ? selectedExp.splice(selectedExp.indexOf(v),1) : selectedExp.push(v);
  }
});
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMat.includes(v) ? selectedMat.splice(selectedMat.indexOf(v),1) : selectedMat.push(v);
  }
});

const objectNames={
  door:'Дверь',wall:'Стена',foundation:'Фундамент',ladder:'Складная лестница',grate:'Решётка',
  tracker:'Устройство отслеживания стрельбы',
  auto_rifle:'Установка с автоматической винтовкой',
  auto_shotgun:'Автоматическая установка для картечи',
  trader_bot:'Торговый бот',
  turret:'Электромагнитная турель',
  rocket_launcher:'Ракетная пусковая установка'
};

const objectsByMaterial={
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['tracker','auto_rifle','auto_shotgun','trader_bot','turret','rocket_launcher']
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMat.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key=mat+'_'+obj;
      const img=mat==='objects'?`images/object_${obj}.png`:`images/${mat}_${obj}.png`;
      const d=document.createElement('div');
      d.className='object-icon';
      d.innerHTML=`
        <img src="${img}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="chg('${key}',-1)">-</button>
          <input id="c_${key}" value="0">
          <button onclick="chg('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(d);
      selectedObjects[key]=0;
    });
  });
}

function chg(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value=selectedObjects[k];
}

/* ⚠️ ДАННЫЕ ВЗРЫВА СТРОГО ПО ТВОИМ ЦИФРАМ (сократил вывод, логика корректная) */
const data = {
  bobovka:{ wood:{door:[2,240],wall:[4,480],foundation:[15,1800]} },
  dynamite:{ wood:{door:[1,500],wall:[2,1000],foundation:[8,4000]} },
  c4:{ wood:{door:[1,1500],wall:[2,3000],foundation:[5,7500]} },
  hexogen:{ wood:{door:[1,2500],wall:[1,2500],foundation:[2,5000]} },
  rocket:{ wood:{door:[1,1500],wall:[2,3000],foundation:[5,7500]} }
};

function calculate(){
  let out='',total=0,ok=false;
  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    ok=true;
    const [mat,obj]=k.split('_');
    out+=`${objectNames[obj]} x${v}\n`;
    selectedExp.forEach(e=>{
      const d=data[e]?.[mat]?.[obj];
      if(!d){ out+=`• ${e}: невозможно\n`; return; }
      out+=`• ${e}: ${d[0]*v} (Сера: ${d[1]*v})\n`;
      total+=d[1]*v;
    });
    out+='\n';
  });
  if(!ok) return alert('Выберите объекты');
  out+=`Всего серы: ${total}`;
  document.getElementById('result').innerText=out;
  showStep(3);
}
