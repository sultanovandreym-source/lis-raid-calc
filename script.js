let step=0;
let selectedExplosives=[];
let selectedMaterials=[];
let selectedObjects={};

const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

function showStep(n){steps.forEach(s=>s.classList.remove('active'));steps[n].classList.add('active')}
function nextStep(n){ 
  if(n===2) loadObjects(); 
  showStep(n)
}
function prevStep(n){showStep(n)}

// ===== Выбор взрывчатки =====
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.exp;
    selectedExplosives.includes(v)?selectedExplosives=selectedExplosives.filter(x=>x!==v):selectedExplosives.push(v);
  }
});

// ===== Выбор материалов =====
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.mat;
    selectedMaterials.includes(v)?selectedMaterials=selectedMaterials.filter(x=>x!==v):selectedMaterials.push(v);
  }
});

// ===== Объекты по материалу =====
const objectsByMaterial={
  wood:['Дверь','Стена','Фундамент'],
  stone:['Дверь','Стена','Фундамент'],
  metal:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  steel:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  titan:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  objects:['Устройство отслеживания стрельбы','Установка с автоматической винтовкой','Автоматическая установка для картечи','Торговый бот','Электромагнитная турель','Ракетная пусковая установка']
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(o=>{
      const key = `${mat}_${o}`;
      if(objectsDiv.querySelector(`[data-obj='${key}']`)) return;
      const div=document.createElement('div');
      div.className='object-row';
      div.dataset.obj=key;
      div.innerHTML=`<span>${mat} ${o}</span>
        <div class="counter">
          <button onclick="changeObjectCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeObjectCount('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(div);
      selectedObjects[key]=0; // теперь с 0
    })
  })
}

function changeObjectCount(obj,v){
  selectedObjects[obj]=Math.max(0,(selectedObjects[obj]||0)+v);
  document.getElementById(`count-${obj}`).innerText=selectedObjects[obj];
}

// ===== Данные взрывчатки =====
const data={
  bobovka:{
    wood:{'Дверь':{count:2,sulfur:240},'Стена':{count:4,sulfur:480},'Фундамент':{count:15,sulfur:1800}},
    stone:{'Дверь':{count:3,sulfur:360},'Стена':{count:10,sulfur:1200},'Фундамент':{count:40,sulfur:4800}},
    metal:{'Дверь':{count:30,sulfur:3600},'Стена':{count:100,sulfur:12000},'Фундамент':{count:400,sulfur:48000},'Складная лестница':{count:46,sulfur:5520},'Решетка':null},
    steel:{'Дверь':{count:200,sulfur:24000},'Стена':{count:667,sulfur:80040},'Фундамент':{count:2667,sulfur:320040},'Складная лестница':{count:275,sulfur:33000},'Решетка':null},
    titan:{'Дверь':{count:800,sulfur:96000},'Стена':{count:2667,sulfur:320040},'Фундамент':null,'Складная лестница':{count:1112,sulfur:133440},'Решетка':null},
    objects:{'Устройство отслеживания стрельбы':{count:50,sulfur:6000},'Установка с автоматической винтовкой':{count:50,sulfur:6000},'Автоматическая установка для картечи':{count:50,sulfur:6000},'Торговый бот':{count:668,sulfur:80160},'Электромагнитная турель':{count:50,sulfur:6000},'Ракетная пусковая установка':{count:50,sulfur:6000}}
  },
  dynamite:{
    wood:{'Дверь':{count:1,sulfur:500},'Стена':{count:2,sulfur:1000},'Фундамент':{count:8,sulfur:4000}},
    stone:{'Дверь':{count:2,sulfur:1000},'Стена':{count:5,sulfur:2500},'Фундамент':{count:20,sulfur:10000}},
    metal:{'Дверь':{count:4,sulfur:2000},'Стена':{count:13,sulfur:6500},'Фундамент':{count:50,sulfur:25000},'Складная лестница':{count:7,sulfur:3500},'Решетка':null},
    steel:{'Дверь':{count:20,sulfur:10000},'Стена':{count:67,sulfur:33500},'Фундамент':{count:267,sulfur:133500},'Складная лестница':{count:28,sulfur:14000},'Решетка':null},
    titan:{'Дверь':{count:80,sulfur:40000},'Стена':{count:200,sulfur:100000},'Фундамент':{count:800,sulfur:800000},'Складная лестница':{count:112,sulfur:56000},'Решетка':null},
    objects:{'Устройство отслеживания стрельбы':{count:7,sulfur:3500},'Установка с автоматической винтовкой':{count:7,sulfur:3500},'Автоматическая установка для картечи':{count:7,sulfur:3500},'Торговый бот':{count:68,sulfur:34000},'Электромагнитная турель':{count:7,sulfur:3500},'Ракетная пусковая установка':{count:7,sulfur:3500}}
  },
  c4:{
    wood:{'Дверь':{count:1,sulfur:1500},'Стена':{count:2,sulfur:3000},'Фундамент':{count:5,sulfur:7500}},
    stone:{'Дверь':{count:1,sulfur:1500},'Стена':{count:4,sulfur:6000},'Фундамент':{count:13,sulfur:19500}},
    metal:{'Дверь':{count:2,sulfur:3000},'Стена':{count:6,sulfur:9000},'Фундамент':{count:24,sulfur:36000},'Складная лестница':{count:3,sulfur:4500},'Решетка':null},
    steel:{'Дверь':{count:4,sulfur:6000},'Стена':{count:13,sulfur:19500},'Фундамент':{count:49,sulfur:73500},'Складная лестница':{count:6,sulfur:9000},'Решетка':null},
    titan:{'Дверь':{count:14,sulfur:21000},'Стена':{count:34,sulfur:51000},'Фундамент':{count:136,sulfur:204000},'Складная лестница':{count:15,sulfur:22500},'Решетка':null},
    objects:{'Устройство отслеживания стрельбы':{count:3,sulfur:4500},'Установка с автоматической винтовкой':{count:3,sulfur:4500},'Автоматическая установка для картечи':{count:3,sulfur:4500},'Торговый бот':{count:13,sulfur:19500},'Электромагнитная турель':{count:3,sulfur:4500},'Ракетная пусковая установка':{count:3,sulfur:4500}}
  },
  hexogen:{
    wood:{'Дверь':{count:1,sulfur:2500},'Стена':{count:1,sulfur:2500},'Фундамент':{count:2,sulfur:5000}},
    stone:{'Дверь':{count:1,sulfur:2500},'Стена':{count:2,sulfur:5000},'Фундамент':{count:6,sulfur:15000}},
    metal:{'Дверь':{count:1,sulfur:2500},'Стена':{count:3,sulfur:7500},'Фундамент':{count:10,sulfur:25000},'Складная лестница':{count:1,sulfur:2500},'Решетка':{count:3,sulfur:7500}},
    steel:{'Дверь':{count:2,sulfur:5000},'Стена':{count:6,sulfur:15000},'Фундамент':{count:17,sulfur:42500},'Складная лестница':{count:3,sulfur:7500},'Решетка':{count:6,sulfur:15000}},
    titan:{'Дверь':{count:4,sulfur:10000},'Стена':{count:10,sulfur:25000},'Фундамент':{count:40,sulfur:100000},'Складная лестница':{count:7,sulfur:15000},'Решетка':null},
    objects:{'Устройство отслеживания стрельбы':{count:2,sulfur:5000},'Установка с автоматической винтовкой':{count:2,sulfur:5000},'Автоматическая установка для картечи':{count:2,sulfur:5000},'Торговый бот':{count:6,sulfur:15000},'Электромагнитная турель':{count:2,sulfur:5000},'Ракетная пусковая установка':{count:2,sulfur:5000}}
  },
  rocket:{
    wood:{'Дверь':{count:1,sulfur:1500},'Стена':{count:2,sulfur:3000},'Фундамент':{count:5,sulfur:7500}},
    stone:{'Дверь':{count:1,sulfur:1500},'Стена':{count:4,sulfur:6000},'Фундамент':{count:13,sulfur:19500}},
    metal:{'Дверь':{count:2,sulfur:3000},'Стена':{count:6,sulfur:9000},'Фундамент':{count:24,sulfur:36000},'Складная лестница':{count:3,sulfur:4500},'Решетка':null},
    steel:{'Дверь':{count:4,sulfur:6000},'Стена':{count:13,sulfur:19500},'Фундамент':{count:49,sulfur:73500},'Складная лестница':{count:6,sulfur:9000},'Решетка':null},
    titan:{'Дверь':{count:14,sulfur:21000},'Стена':{count:34,sulfur:51000},'Фундамент':{count:136,sulfur:204000},'Складная лестница':{count:15,sulfur:22500},'Решетка':null},
    objects:{'Устройство отслеживания стрельбы':{count:3,sulfur:4500},'Установка с автоматической винтовкой':{count:3,sulfur:4500},'Автоматическая установка для картечи':{count:3,sulfur:4500},'Торговый бот':{count:13,sulfur:19500},'Электромагнитная турель':{count:3,sulfur:4500},'Ракетная пусковая установка':{count:3,sulfur:4500}}
  }
};

// ===== Расчет =====
function calculate(){
  let result='';
  let totalSulfur=0;
  Object.keys(selectedObjects).forEach(key=>{
    const qty=selectedObjects[key];
    if(qty===0) return; 
    const [mat,obj]=key.split('_');
    result+=`Объект: ${obj} (${mat})\nКоличество: ${qty}\n`;
    selectedExplosives.forEach(exp=>{
      let val=null;
      if(data[exp] && data[exp][mat] && data[exp][mat][obj]){
        val=data[exp][mat][obj];
      }
      let c,s;
      if(!val){c='Невозможно'; s='—';}
      else{c=val.count*qty; s=val.sulfur*qty; totalSulfur+=s;}
      result+=`• ${exp}: ${c} (Сера: ${s})\n`;
    })
    result+='\n';
  })
  result+=`Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText=result;
  showStep(3);
}
