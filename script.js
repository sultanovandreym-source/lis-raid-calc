/* ===== ДАННЫЕ ===== */

const explosives = {
  bobovka:{name:"Бобовка", img:"bobovka.png"},
  dynamite:{name:"Динамит", img:"dynamite.png"},
  c4:{name:"С4", img:"c4.png"},
  hexogen:{name:"Гексоген", img:"hexogen.png"},
  rocket:{name:"Ракета", img:"rocket.png"}
};

const materials = {
  wood:{name:"Дерево", img:"wood.png"},
  stone:{name:"Камень", img:"stone.png"},
  metal:{name:"Металл", img:"metal.png"},
  steel:{name:"Сталь", img:"steel.png"},
  titan:{name:"Титан", img:"titan.png"},
  objects:{name:"Объекты", img:"objects.png"}
};

const buildObjects = {
  door:"Дверь",
  wall:"Стена",
  foundation:"Фундамент",
  ladder:"Складная лестница",
  grate:"Решётка"
};

const specialObjects = {
  tracker:"Устройство отслеживания стрельбы",
  auto_shotgun:"Автоматическая установка для картечи",
  em_turret:"Электромагнитная турель",
  trader_bot:"Торговый бот",
  rocket_launcher:"Ракетная пусковая установка"
};

/* ===== ЦИФРЫ ===== */

const raid = {
  bobovka:{wood:{door:[2,240], wall:[4,480]}, stone:{door:[3,360], wall:[10,1200]}},
  dynamite:{metal:{door:[4,480], wall:[10,1200]}},
  c4:{steel:{door:[4,6000], wall:[13,19500]}},
  hexogen:{titan:{door:[4,10000], wall:[10,25000]}}
};

const objectRaid = {
  bobovka:{tracker:[50,6000], auto_shotgun:[50,6000], em_turret:[50,6000], trader_bot:[668,80160], rocket_launcher:[50,6000]},
  dynamite:{tracker:[7,3500], auto_shotgun:[7,3500], em_turret:[7,3500], trader_bot:[68,34000], rocket_launcher:[7,3500]},
  c4:{tracker:[3,4500], auto_shotgun:[3,4500], em_turret:[3,4500], trader_bot:[13,19500], rocket_launcher:[3,4500]},
  hexogen:{tracker:[2,5000], auto_shotgun:[2,5000], em_turret:[2,5000], trader_bot:[6,15000], rocket_launcher:[2,5000]},
  rocket:{tracker:[3,4500], auto_shotgun:[3,4500], em_turret:[3,4500], trader_bot:[13,19500], rocket_launcher:[3,4500]}
};

/* ===== СОСТОЯНИЕ ===== */

let step = 1;
let selExp = [];
let selMat = [];
let counts = {};

/* ===== РЕНДЕР КАРТОЧЕК ===== */

function render(id,data,type){
  const el=document.getElementById(id);
  el.innerHTML="";
  Object.entries(data).forEach(([k,v])=>{
    el.innerHTML+=`<div class="card" onclick="toggle('${type}','${k}',this)">
      <img src="images/${v.img}">
      <div class="title">${v.name}</div>
    </div>`;
  });
}

render("explosives",explosives,"exp");
render("materials",materials,"mat");

/* ===== ОБЪЕКТЫ ===== */

function renderObjects(){
  const el=document.getElementById("objects");
  el.innerHTML="";
  selMat.forEach(mat=>{
    if(mat==="objects"){
      Object.entries(specialObjects).forEach(([o,n])=>{
        drawObject(el,o,n,`object_${o}.png`);
      });
    } else {
      Object.entries(buildObjects).forEach(([o,n])=>{
        drawObject(el,`${mat}_${o}`,`${n}`,`${mat}_${o}.png`);
      });
    }
  });
}

function drawObject(el,key,title,img){
  const val=counts[key]||0;
  el.innerHTML+=`<div class="card">
    <img src="images/${img}">
    <div class="title">${title}</div>
    <div class="counter">
      <button onclick="chg('${key}',-1)">−</button>
      <input value="${val}" oninput="setv('${key}',this.value)">
      <button onclick="chg('${key}',1)">+</button>
    </div>
  </div>`;
}

/* ===== ВЫБОР ===== */

function toggle(type,k,el){
  const arr=type==="exp"?selExp:selMat;
  if(arr.includes(k)){arr.splice(arr.indexOf(k),1);el.classList.remove("active");}
  else {arr.push(k);el.classList.add("active");}
  update();
}

function chg(k,d){ counts[k]=Math.max(0,(counts[k]||0)+d); renderObjects(); update(); }
function setv(k,v){ counts[k]=Math.max(0,Number(v)||0); update(); }

function update(){
  next1.disabled=!selExp.length;
  next2.disabled=!selMat.length;
  calc.disabled=!Object.values(counts).some(v=>v>0);
}

/* ===== НАВИГАЦИЯ ===== */

function go(n){
  document.querySelector(".step.active").classList.remove("active");
  step=n;
  document.getElementById(`step-${step}`).classList.add("active");
  if(step===3) renderObjects();
}

next1.onclick=()=>go(2);
next2.onclick=()=>go(3);
calc.onclick=calculate;

/* ===== РАСЧЕТ ===== */

function calculate(){
  let out="", total=0;
  selExp.forEach(exp=>{
    Object.entries(counts).forEach(([k,c])=>{
      if(!c) return;
      const [m,o]=k.split("_");
      let data=raid[exp]?.[m]?.[o] || objectRaid[exp]?.[o];
      if(!data){
        // логика выгодного рейда
        if(m==="wood"||m==="stone") data=raid["bobovka"]?.[m]?.[o];
        else if(m==="metal") data=raid["dynamite"]?.[m]?.[o];
        else if(m==="steel") data=raid["c4"]?.[m]?.[o];
        else if(m==="titan") data=raid["hexogen"]?.[m]?.[o];
      }
      if(!data) return;
      out+=`${data[0]*c} ${explosives[exp].name} — ${data[1]*c} серы\n`;
      total+=data[1]*c;
    });
  });
  out+=`\nОбщее количество серы: ${total}`;
  document.getElementById("result").textContent=out;
  go(4);
}
