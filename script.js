let step=0;
let selectedExplosives=[];
let selectedMaterials=[];
let selectedObjects={}; // {Объект: количество}

const steps=document.querySelectorAll('.step');

function showStep(n){steps.forEach(s=>s.classList.remove('active'));steps[n].classList.add('active')}
function nextStep(n){showStep(n)}
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

// ===== Загрузка объектов =====
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
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(o=>{
      if(box.querySelector(`[data-obj='${o}']`)) return; // избегаем повторов
      const div=document.createElement('div');
      div.className='object-row';
      div.innerHTML=`<span>${o}</span>
      <div class="counter">
        <button onclick="changeObjectCount('${o}',-1)">-</button>
        <span id="count-${o}">1</span>
        <button onclick="changeObjectCount('${o}',1)">+</button>
      </div>`;
      div.dataset.obj=o;
      box.appendChild(div);
      selectedObjects[o]=1;
    })
  })
}

// ===== Счетчики объектов =====
function changeObjectCount(obj,v){
  selectedObjects[obj]=Math.max(1,(selectedObjects[obj]||1)+v);
  document.getElementById(`count-${obj}`).innerText=selectedObjects[obj];
}

// ===== Данные по взрывчатке =====
const data={
  bobovka:{wood:{'Дверь':{count:2,sulfur:240},'Стена':{count:4,sulfur:480},'Фундамент':{count:15,sulfur:1800}},
           stone:{'Дверь':{count:3,sulfur:360},'Стена':{count:10,sulfur:1200},'Фундамент':{count:40,sulfur:4800}},
           metal:{'Дверь':{count:30,sulfur:3600},'Стена':{count:100,sulfur:12000},'Фундамент':{count:400,sulfur:48000},'Складная лестница':{count:46,sulfur:5520},'Решетка':null},
           steel:{'Дверь':{count:200,sulfur:24000},'Стена':{count:667,sulfur:80040},'Фундамент':{count:2667,sulfur:320040},'Складная лестница':{count:275,sulfur:33000},'Решетка':null},
           titan:{'Дверь':{count:800,sulfur:96000},'Стена':{count:2667,sulfur:320040},'Фундамент':null,'Складная лестница':{count:1112,sulfur:133440},'Решетка':null},
           objects:{'Устройство отслеживания стрельбы':{count:50,sulfur:6000},'Установка с автоматической винтовкой':{count:50,sulfur:6000},'Автоматическая установка для картечи':{count:50,sulfur:6000},'Торговый бот':{count:668,sulfur:80160},'Электромагнитная турель':{count:50,sulfur:6000},'Ракетная пусковая установка':{count:50,sulfur:6000}}
          }
  // Другие взрывчатки: dynamite, c4, hexogen, rocket
};

// ===== Расчет =====
function calculate(){
  loadObjects(); // убедимся, что объекты загружены
  let resultText='';
  let totalSulfur=0;

  Object.keys(selectedObjects).forEach(obj=>{
    const qty=selectedObjects[obj];
    resultText+=`Объект: ${obj}\nКоличество: ${qty}\n`;
    selectedExplosives.forEach(exp=>{
      let val=data[exp] && ((data[exp].objects && data[exp].objects[obj]) || 
                            (data[exp][selectedMaterials[0]] && data[exp][selectedMaterials[0]][obj]));
      let c,s;
      if(!val) {c='Невозможно'; s='—';}
      else{c=val.count*sqty; s=val.sulfur*qty;}
      resultText+=`• ${exp}: ${c} (Сера: ${s})\n`;
      if(s!=='—') totalSulfur+=s;
    })
    resultText+='\n';
  });

  resultText+=`Общее количество серы: ${totalSulfur}\n`;
  document.getElementById('result').innerText=resultText;
  nextStep(3);
}

document.querySelector('[data-mat]').forEach(()=>loadObjects()); // Инициализация
