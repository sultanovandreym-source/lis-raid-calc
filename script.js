const steps = document.querySelectorAll('.step');
const objectsGrid = document.getElementById('objectsGrid');

let selectedExp = [];
let selectedMat = [];

function showStep(n){
steps.forEach(s=>s.classList.remove('active'));
steps[n].classList.add('active');
}

document.querySelectorAll('.exp').forEach(el=>{
el.onclick=()=>{
el.classList.toggle('active');
const v=el.dataset.exp;
selectedExp.includes(v)
? selectedExp.splice(selectedExp.indexOf(v),1)
: selectedExp.push(v);
};
});

document.querySelectorAll('.mat').forEach(el=>{
el.onclick=()=>{
el.classList.toggle('active');
const v=el.dataset.mat;
selectedMat.includes(v)
? selectedMat.splice(selectedMat.indexOf(v),1)
: selectedMat.push(v);
};
});

document.getElementById('toStep2').onclick=()=>{
if(!selectedExp.length) return alert('Выберите взрывчатку');
showStep(1);
};

document.getElementById('back1').onclick=()=>showStep(0);

document.getElementById('toStep3').onclick=()=>{
if(!selectedMat.length) return alert('Выберите материал');
loadObjects();
showStep(2);
};

document.getElementById('back2').onclick=()=>showStep(1);

const objectsByMat={
wood:[
['wood_door','Деревянная дверь'],
['wood_wall','Деревянная стена'],
['wood_foundation','Деревянный фундамент']
],
stone:[
['stone_door','Каменная дверь'],
['stone_wall','Каменная стена'],
['stone_foundation','Каменный фундамент']
],
metal:[
['metal_door','Железная дверь'],
['metal_wall','Железная стена'],
['metal_foundation','Железный фундамент'],
['metal_ladder','Железная складная лестница'],
['metal_grate','Железная решетка']
],
steel:[
['steel_door','Стальная дверь'],
['steel_wall','Стальная стена'],
['steel_foundation','Стальной фундамент'],
['steel_ladder','Стальная складная лестница'],
['steel_grate','Стальная решетка']
],
titan:[
['titan_door','Титановая дверь'],
['titan_wall','Титановая стена'],
['titan_foundation','Титановый фундамент'],
['titan_ladder','Титановая складная лестница'],
['titan_grate','Титановая решетка']
],
objects:[
['object_tracker','Устройство отслеживания стрельбы'],
['object_auto_rifle','Установка с автоматической винтовкой'],
['object_auto_shotgun','Автоматическая установка для картечи'],
['object_trader','Торговый бот'],
['object_em_turret','Электромагнитная турель'],
['object_rocket_launcher','Ракетная пусковая установка']
]
};

function loadObjects(){
objectsGrid.innerHTML='';
selectedMat.forEach(mat=>{
(objectsByMat[mat]||[]).forEach(o=>{
objectsGrid.innerHTML+=`
<div class="card">
<img src="images/${o[0]}.png">
<span>${o[1]}</span>
</div>`;
});
});
}
