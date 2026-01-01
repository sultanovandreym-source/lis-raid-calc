let step=0;
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

// ===== Объекты =====
const objectsByMaterial={
  wood:['Дверь','Стена','Фундамент'],
  stone:['Дверь','Стена','Фундамент'],
  metal:['Дверь','Стена','Фундамент','Складная_лестница','Решетка'],
  steel:['Дверь','Стена','Фундамент','Складная_лестница','Решетка'],
  titan:['Дверь','Стена','Фундамент','Складная_лестница','Решетка'],
  objects:['Устройство_отслеживания_стрельбы','Установка_с_автоматической_винтовкой','Автоматическая_установка_для_картечи','Торговый_бот','Электромагнитная_турель','Ракетная_пусковая_установка']
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key=`${mat}_${obj}`;
      const div=document.createElement('div');
      div.className='object-row';
      div.dataset.obj=key;
      div.innerHTML=`
        <img src="img/${mat}_${obj}.png" alt="${obj}">
        <span>${obj.replace(/_/g,' ')}</span>
        <div class="counter">
          <button onclick="changeObjectCount('${key}',-1)">-</button>
          <span id="count-${key}">0</span>
          <button onclick="changeObjectCount('${key}',1)">+</button>
        </div>
      `;
      objectsDiv.appendChild(div);
      selectedObjects[key]=0;
    });
  });
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
    metal:{'Дверь':{count:30,sulfur:3600},'Стена':{count:100,sulfur:12000},'Фундамент':{count:400,sulfur:48000},'Складная_лестница':{count:46,sulfur:5520},'Решетка':null},
    steel:{'Дверь':{count:200,sulfur:24000},'Стена':{count:667,sulfur:80040},'Фундамент':{count:2667,sulfur:320040},'Складная_лестница':{count:275,sulfur:33000},'Решетка':null},
    titan:{'Дверь':{count:800,sulfur:96000},'Стена':{count:2667,sulfur:320040},'Фундамент':null,'Складная_лестница':{count:1112,sulfur:133440},'Решетка':null},
    objects:{'Устройство_отслеживания_стрельбы':{count:50,sulfur:6000},'Установка_с_автоматической_винтовкой':{count:50,sulfur:6000},'Автоматическая_установка_для_картечи':{count:50,sulfur:6000},'Торговый_бот':{count:668,sulfur:80160},'Электромагнитная_турель':{count:50,sulfur:6000},'Ракетная_пусковая_установка':{count:50,sulfur:6000}}
  },
  // добавьте остальные взрывчатки...
};

// ===== Расчет =====
function calculate(){
  let result='';
  let totalSulfur=0;
  Object.keys(selectedObjects).forEach(key=>{
    const qty=selectedObjects[key];
    if(qty===0) return;
    const [mat,obj]=key.split('_');
    result+=`Объект: ${obj.replace(/_/g,' ')} (${mat})\nКоличество: ${qty}\n`;
    selectedExplosives.forEach(exp=>{
      let val=data[exp]?.[mat]?.[obj]||null;
      let c,s;
      if(!val){c='Невозможно'; s='—';}
      else{c=val.count*qty; s=val.sulfur*qty; totalSulfur+=s;}
      result+=`• ${exp}: ${c} (Сера: ${s})\n`;
    });
    result+='\n';
  });
  result+=`Общее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText=result;
  showStep(3);
}
