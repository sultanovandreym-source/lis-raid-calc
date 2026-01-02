const steps=document.querySelectorAll(".step");
let step=0;

const selectedExp=new Set();
const selectedMat=new Set();
const objectsGrid=document.getElementById("objectsGrid");
const objectCounts={};

function showStep(i){
steps.forEach(s=>s.classList.remove("active"));
steps[i].classList.add("active");
step=i;
}

document.querySelectorAll("[data-exp]").forEach(el=>{
el.onclick=()=>{
el.classList.toggle("active");
el.classList.contains("active")
?selectedExp.add(el.dataset.exp)
:selectedExp.delete(el.dataset.exp);
};
});

document.querySelectorAll("[data-mat]").forEach(el=>{
el.onclick=()=>{
el.classList.toggle("active");
el.classList.contains("active")
?selectedMat.add(el.dataset.mat)
:selectedMat.delete(el.dataset.mat);
};
});

document.getElementById("toStep2").onclick=()=>{
if(!selectedExp.size)return alert("Выберите взрывчатку");
showStep(1);
};

document.getElementById("back1").onclick=()=>showStep(0);

document.getElementById("toStep3").onclick=()=>{
if(!selectedMat.size)return alert("Выберите материал");
loadObjects();
showStep(2);
};

document.getElementById("back2").onclick=()=>showStep(1);

const objects={
wood:["Деревянная дверь","Деревянная стена","Деревянный фундамент"],
stone:["Каменная дверь","Каменная стена","Каменный фундамент"],
metal:["Железная дверь","Железная стена","Железный фундамент","Складная лестница","Решетка"],
steel:["Стальная дверь","Стальная стена","Стальной фундамент","Складная лестница","Решетка"],
titan:["Титановая дверь","Титановая стена","Титановый фундамент","Складная лестница","Решетка"],
objects:[
"Устройство отслеживания стрельбы",
"Автоматическая винтовка",
"Картечная установка",
"Торговый бот",
"Электромагнитная турель",
"Ракетная установка"
]
};

function loadObjects(){
objectsGrid.innerHTML="";
Object.keys(objects).forEach(mat=>{
if(!selectedMat.has(mat))return;
objects[mat].forEach(name=>{
const id=mat+"_"+name;
objectCounts[id]=0;
objectsGrid.innerHTML+=`
<div class="card">
<span>${name}</span>
<div class="counter">
<button onclick="chg('${id}',-1)">−</button>
<input id="i_${id}" value="0" readonly>
<button onclick="chg('${id}',1)">+</button>
</div>
</div>`;
});
});
}

function chg(id,val){
objectCounts[id]=Math.max(0,objectCounts[id]+val);
document.getElementById("i_"+id).value=objectCounts[id];
}
