let selectedExp = null;
let selectedMat = null;
let selectedObject = null;

const steps = document.querySelectorAll('.step');

function showStep(i) {
  steps.forEach(s => s.classList.remove('active'));
  steps[i].classList.add('active');
}

function nextStep(i){ showStep(i); }
function prevStep(i){ showStep(i); }

document.querySelectorAll('.exp').forEach(el=>{
  el.onclick=()=>{
    document.querySelectorAll('.exp').forEach(e=>e.classList.remove('active'));
    el.classList.add('active');
    selectedExp=el.dataset.exp;
  }
});

document.querySelectorAll('.mat').forEach(el=>{
  el.onclick=()=>{
    document.querySelectorAll('.mat').forEach(e=>e.classList.remove('active'));
    el.classList.add('active');
    selectedMat=el.dataset.mat;
    loadObjects();
  }
});

const objectsData = {
  wood: [
    ["wood_door","Деревянная дверь"],
    ["wood_wall","Деревянная стена"],
    ["wood_foundation","Деревянный фундамент"]
  ],
  stone: [
    ["stone_door","Каменная дверь"],
    ["stone_wall","Каменная стена"],
    ["stone_foundation","Каменный фундамент"]
  ],
  metal: [
    ["metal_door","Железная дверь"],
    ["metal_wall","Железная стена"],
    ["metal_foundation","Железный фундамент"]
  ],
  steel: [
    ["steel_door","Стальная дверь"],
    ["steel_wall","Стальная стена"],
    ["steel_foundation","Стальной фундамент"]
  ],
  titan: [
    ["titan_door","Титановая дверь"],
    ["titan_wall","Титановая стена"],
    ["titan_foundation","Титановый фундамент"]
  ],
  objects: [
    ["tracking_device","Устройство отслеживания"],
    ["auto_rifle_turret","Турель с автоматической винтовкой"],
    ["shotgun_turret","Турель для картечи"],
    ["trading_bot","Торговый бот"],
    ["em_turret","Электромагнитная турель"],
    ["rocket_launcher","Ракетная установка"]
  ]
};

function loadObjects(){
  const grid=document.getElementById("objectsGrid");
  grid.innerHTML="";
  if(!objectsData[selectedMat])return;

  objectsData[selectedMat].forEach(o=>{
    const div=document.createElement("div");
    div.className="object";
    div.innerHTML=`<img src="images/${o[0]}.png"><span>${o[1]}</span>`;
    div.onclick=()=>{
      document.querySelectorAll('.object').forEach(x=>x.classList.remove('active'));
      div.classList.add('active');
      selectedObject=o[1];
    };
    grid.appendChild(div);
  });
}

function calculate(){
  const result=document.getElementById("result");
  if(!selectedExp||!selectedMat||!selectedObject){
    result.textContent="Выбраны не все параметры";
  } else {
    result.textContent=
`Взрывчатка: ${selectedExp}
Материал: ${selectedMat}
Объект: ${selectedObject}

Расчет выполнен ✔`;
  }
  showStep(3);
}
