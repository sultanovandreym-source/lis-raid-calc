
let step = 1;
let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  document.getElementById(`step${n}`).classList.add('active');
}

function nextStep(n){ showStep(n); if(n===3) loadObjects(); }
function prevStep(n){ showStep(n); }

// ===== ВЫБОР =====
document.querySelectorAll('.exp').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    toggle(selectedExplosives, el.dataset.exp);
  }
});

document.querySelectorAll('.mat').forEach(el=>{
  el.onclick=()=>{
    el.classList.toggle('active');
    toggle(selectedMaterials, el.dataset.mat);
  }
});

function toggle(arr,val){
  arr.includes(val) ? arr.splice(arr.indexOf(val),1) : arr.push(val);
}

// ===== ОБЪЕКТЫ =====
const objects = {
  wood:["door","wall","foundation"],
  stone:["door","wall","foundation"],
  metal:["door","wall","foundation","ladder","grate"],
  steel:["door","wall","foundation","ladder","grate"],
  titan:["door","wall","foundation","ladder"]
};

const namesRU = {
  door:"Дверь",
  wall:"Стена",
  foundation:"Фундамент",
  ladder:"Лестница",
  grate:"Решётка"
};

function loadObjects(){
  const grid=document.getElementById('objectsGrid');
  grid.innerHTML="";
  selectedObjects={};

  selectedMaterials.forEach(mat=>{
    if(!objects[mat]) return;
    objects[mat].forEach(obj=>{
      const key=`${mat}_${obj}`;
      selectedObjects[key]=0;

      const div=document.createElement('div');
      div.className="card";
      div.innerHTML=`
        <img src="images/objects/${key}.png">
        <span>${namesRU[obj]} (${mat})</span>
      `;
      div.onclick=()=>{
        selectedObjects[key]++;
        div.classList.add("active");
      }
      grid.appendChild(div);
    });
  });
}

// ===== ДАННЫЕ (ПРИМЕР, РАБОТАЕТ ДЛЯ ВСЕХ) =====
const sulfurPer = {
  bobovka:10,
  dynamite:50,
  c4:150,
  hexogen:250,
  rocket:150
};

function calculate(){
  let res="";
  let total=0;

  for(let key in selectedObjects){
    let qty=selectedObjects[key];
    if(qty===0) continue;

    res+=`Объект: ${key}\n`;
    selectedExplosives.forEach(exp=>{
      let s = sulfurPer[exp]*qty;
      total+=s;
      res+=`  ${exp}: ${s} серы\n`;
    });
    res+="\n";
  }

  res+=`ИТОГО СЕРЫ: ${total}`;
  document.getElementById("result").innerText=res;
  showStep(4);
}
