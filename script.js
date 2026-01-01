let step = 0;
const steps = document.querySelectorAll('.step');
function showStep(i){ steps.forEach(s=>s.classList.remove('active')); steps[i].classList.add('active'); }
function nextStep(i){ 
  if(i===2) loadObjects();
  showStep(i);
}
function prevStep(i){ showStep(i); }

/* ---------- ВЗРЫВЧАТКА ---------- */
const explosives = [
  {ru:'Бобовка', en:'bobovka'},
  {ru:'Динамит', en:'dynamite'},
  {ru:'C4', en:'c4'},
  {ru:'Гексоген', en:'hexogen'},
  {ru:'Ракета', en:'rocket'}
];
const selectedExplosives = [];
const explosivesDiv = document.getElementById('explosives');
explosives.forEach(e=>{
  const d=document.createElement('div');
  d.className='card';
  d.innerHTML=`<img src="images/explosives/${e.en}.png"><span>${e.ru}</span>`;
  d.onclick=()=>{
    d.classList.toggle('active');
    selectedExplosives.includes(e.ru)
      ? selectedExplosives.splice(selectedExplosives.indexOf(e.ru),1)
      : selectedExplosives.push(e.ru);
  };
  explosivesDiv.appendChild(d);
});

/* ---------- МАТЕРИАЛЫ ---------- */
const materials = [
  {ru:'Дерево', en:'wood'},
  {ru:'Камень', en:'stone'},
  {ru:'Металл', en:'metal'},
  {ru:'Сталь', en:'steel'},
  {ru:'Титан', en:'titan'},
  {ru:'Объекты', en:'objects'}
];
const selectedMaterials=[];
const materialsDiv=document.getElementById('materials');
materials.forEach(m=>{
  const d=document.createElement('div');
  d.className='card';
  d.innerHTML=`<img src="images/materials/${m.en}.png"><span>${m.ru}</span>`;
  d.onclick=()=>{
    d.classList.toggle('active');
    selectedMaterials.includes(m.ru)
      ? selectedMaterials.splice(selectedMaterials.indexOf(m.ru),1)
      : selectedMaterials.push(m.ru);
  };
  materialsDiv.appendChild(d);
});

/* ---------- ОБЪЕКТЫ ---------- */
const objectsByMaterial = {
  'Дерево':[
    {ru:'Дверь', en:'door'},
    {ru:'Стена', en:'wall'},
    {ru:'Фундамент', en:'foundation'}
  ],
  'Камень':[
    {ru:'Дверь', en:'door'},
    {ru:'Стена', en:'wall'},
    {ru:'Фундамент', en:'foundation'}
  ],
  'Металл':[
    {ru:'Дверь', en:'door'},
    {ru:'Стена', en:'wall'},
    {ru:'Фундамент', en:'foundation'},
    {ru:'Лестница', en:'ladder'},
    {ru:'Решетка', en:'grate'}
  ],
  'Сталь':[
    {ru:'Дверь', en:'door'},
    {ru:'Стена', en:'wall'},
    {ru:'Фундамент', en:'foundation'},
    {ru:'Лестница', en:'ladder'},
    {ru:'Решетка', en:'grate'}
  ],
  'Титан':[
    {ru:'Дверь', en:'door'},
    {ru:'Стена', en:'wall'},
    {ru:'Лестница', en:'ladder'},
    {ru:'Решетка', en:'grate'}
  ],
  'Объекты':[
    {ru:'Устройство отслеживания стрельбы', en:'tracking_device'},
    {ru:'Установка с автоматической винтовкой', en:'auto_rifle_turret'},
    {ru:'Автоматическая установка для картечи', en:'auto_shotgun_turret'},
    {ru:'Торговый бот', en:'trade_bot'},
    {ru:'Электромагнитная турель', en:'em_turret'},
    {ru:'Ракетная пусковая установка', en:'rocket_launcher'}
  ]
};

const objectsDiv=document.getElementById('objects');
const selectedObjects={};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key=`${mat}_${obj.ru}`;
      selectedObjects[key]=0;
      const d=document.createElement('div');
      d.className='card';
      let imgPath = (mat==='Объекты') ? `images/objects/${obj.en}.png` : `images/objects/${materials.find(m=>m.ru===mat).en}_${obj.en}.png`;
      d.innerHTML=`
        <img src="${imgPath}">
        <span>${mat} ${obj.ru}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <span id="${key}">0</span>
          <button onclick="change('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(d);
    });
  });
}

function change(k,v){
  selectedObjects[k]=Math.max(0,selectedObjects[k]+v);
  document.getElementById(k).innerText=selectedObjects[k];
}

/* ---------- РАСЧЁТ ---------- */
const data = {
  'Бобовка':{ /* пример данных для всех материалов/объектов */
    'Дерево':{'Дверь':2,'Стена':4,'Фундамент':15},
    'Камень':{'Дверь':3,'Стена':10,'Фундамент':40},
    'Металл':{'Дверь':30,'Стена':100,'Фундамент':400,'Лестница':46,'Решетка':0},
    'Сталь':{'Дверь':200,'Стена':667,'Фундамент':2667,'Лестница':275,'Решетка':0},
    'Титан':{'Дверь':800,'Стена':2667,'Фундамент':0,'Лестница':1112,'Решетка':0},
    'Объекты':{
      'Устройство отслеживания стрельбы':50,
      'Установка с автоматической винтовкой':50,
      'Автоматическая установка для картечи':50,
      'Торговый бот':668,
      'Электромагнитная турель':50,
      'Ракетная пусковая установка':50
    }
  },
  'Динамит':{ /* пример */
    'Дерево':{'Дверь':1,'Стена':2,'Фундамент':8},
    'Камень':{'Дверь':2,'Стена':5,'Фундамент':20},
    'Металл':{'Дверь':4,'Стена':13,'Фундамент':50,'Лестница':7,'Решетка':0},
    'Сталь':{'Дверь':20,'Стена':67,'Фундамент':267,'Лестница':28,'Решетка':0},
    'Титан':{'Дверь':80,'Стена':200,'Фундамент':800,'Лестница':112,'Решетка':0},
    'Объекты':{
      'Устройство отслеживания стрельбы':7,
      'Установка с автоматической винтовкой':7,
      'Автоматическая установка для картечи':7,
      'Торговый бот':68,
      'Электромагнитная турель':7,
      'Ракетная пусковая установка':7
    }
  }
  /* Добавить C4, Hexogen, Rocket аналогично */
};

function calculate(){
  let out='';
  for(const k in selectedObjects){
    const qty=selectedObjects[k];
    if(!qty) continue;
    const [mat,obj]=k.split('_');
    out+=`${mat} ${obj} x${qty}\n`;
    selectedExplosives.forEach(e=>{
      const val = data[e]?.[mat]?.[obj];
      out+=`  ${e}: ${val!==undefined?val*qty:'Невозможно'}\n`;
    });
    out+='\n';
  }
  document.getElementById('result').innerText=out||'Ничего не выбрано';
  showStep(3);
}
