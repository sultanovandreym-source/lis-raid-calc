let step=0;
let selectedExplosives=[];
let selectedMaterial=null;
let selectedObjects=[];
let count=1;

const steps=document.querySelectorAll('.step');

function showStep(n){steps.forEach(s=>s.classList.remove('active'));steps[n].classList.add('active')}
function nextStep(n){showStep(n)}
function prevStep(n){showStep(n)}
function changeCount(v){count=Math.max(1,count+v);document.getElementById('count').innerText=count}

// Выбор взрывчатки
document.querySelectorAll('[data-exp]').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    const v=el.dataset.exp;
    selectedExplosives.includes(v)?selectedExplosives=selectedExplosives.filter(x=>x!==v):selectedExplosives.push(v);
  }
});

// Выбор материала
document.querySelectorAll('[data-mat]').forEach(el=>{
  el.onclick=()=>{
    document.querySelectorAll('[data-mat]').forEach(x=>x.classList.remove('active'));
    el.classList.add('active');
    selectedMaterial=el.dataset.mat;
    loadObjects();
  }
});

// ===== Объекты =====
const objectsByMaterial={
  wood:['Дверь','Стена','Фундамент'],
  stone:['Дверь','Стена','Фундамент'],
  metal:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  steel:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  titan:['Дверь','Стена','Фундамент','Складная лестница','Решетка'],
  objects:['Устройство отслеживания стрельбы','Установка с автоматической винтовкой','Автоматическая установка для картечи','Торговый бот','Электромагнитная турель','Ракетная пусковая установка']
};

function loadObjects(){
  const box=document.getElementById('objects');
  box.innerHTML='';
  objectsByMaterial[selectedMaterial].forEach(o=>{
    const d=document.createElement('div');
    d.className='card';
    d.innerHTML=o;
    d.onclick=()=>{
      d.classList.toggle('active');
      if(selectedObjects.includes(o)) selectedObjects=selectedObjects.filter(x=>x!==o);
      else selectedObjects.push(o);
    }
    box.appendChild(d);
  });
}

// ===== Данные по взрывчатке =====
const data={
  bobovka:{wood:{'Дверь':{count:2,sulfur:240},'Стена':{count:4,sulfur:480},'Фундамент':{count:15,sulfur:1800}},stone:{'Дверь':3,'Стена':10,'Фундамент':40},metal:{'Дверь':30,'Стена':100,'Фундамент':400,'Складная лестница':46,'Решетка':null},steel:{'Дверь':200,'Стена':667,'Фундамент':2667,'Складная лестница':275,'Решетка':null},titan:{'Дверь':800,'Стена':2667,'Фундамент':null,'Складная лестница':1112,'Решетка':null},objects:{'Устройство отслеживания стрельбы':50,'Установка с автоматической винтовкой':50,'Автоматическая установка для картечи':50,'Торговый бот':668,'Электромагнитная турель':50,'Ракетная пусковая установка':50}},
  dynamite:{/*... данные ...*/},
  c4:{/*... данные ...*/},
  hexogen:{/*... данные ...*/},
  rocket:{/*... данные ...*/}
};

// ===== Расчет =====
function calculate(){
  let resultText='';
  let totalSulfur=0;

  selectedObjects.forEach(obj=>{
    resultText+=`Объект: ${obj}\n`;
    resultText+=`Количество: ${count}\n`;

    selectedExplosives.forEach(exp=>{
      let val;
      if(selectedMaterial==='objects') val=data[exp].objects[obj] || 0;
      else{
        val=data[exp][selectedMaterial][obj];
        if(val===null) val='Невозможно разрушить';
        else if(typeof val==='object') val=val.count;
      }
      resultText+=`• ${exp}: ${val}\n`;
      if(selectedMaterial!=='objects' && val!=='Невозможно разрушить'){
        totalSulfur+=data[exp][selectedMaterial][obj].sulfur*count||0;
      }
    });
    resultText+='\n';
  });

  resultText+=`Общее количество серы: ${totalSulfur}\n`;
  document.getElementById('result').innerText=resultText;
  showStep(3);
}

showStep(0);
