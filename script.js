let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

// запретить Далее, если ничего не выбрано
function nextStep(n){
  if(n===1 && selectedExplosives.length===0){ alert('Выберите взрывчатку'); return; }
  if(n===2 && selectedMaterials.length===0){ alert('Выберите материалы'); return; }
  if(n===2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

// выбор взрывчатки
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExplosives.includes(v)
      ? selectedExplosives=selectedExplosives.filter(x=>x!==v)
      : selectedExplosives.push(v);
  }
});

// выбор материалов
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMaterials.includes(v)
      ? selectedMaterials=selectedMaterials.filter(x=>x!==v)
      : selectedMaterials.push(v);
  }
});

const objectNames={
  door:'Дверь',wall:'Стена',foundation:'Фундамент',
  ladder:'Складная лестница',grate:'Решётка',
  tracker:'Устройство отслеживания',
  auto_rifle:'Автоматическая винтовка',
  auto_shotgun:'Автоматическая картечь',
  trader_bot:'Торговый бот',
  em_turret:'Турель',
  rocket_launcher:'Ракетная установка'
};

const objectsByMaterial={
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['tracker','auto_rifle','auto_shotgun','trader_bot','em_turret','rocket_launcher']
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};

  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat].forEach(obj=>{
      const key=`${mat}_${obj}`;
      const img = mat==='objects'
        ? `images/${obj}.png`
        : `images/${mat}_${obj}.png`;

      const d=document.createElement('div');
      d.className='object-icon';
      d.innerHTML=`
        <img src="${img}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <input type="number" id="c_${key}" value="0" min="0" oninput="update('${key')">
          <button onclick="change('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(d);
      selectedObjects[key]=0;

      // клик по всей карточке тоже выделяет белой обводкой
      d.onclick = function(e){
        if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT'){
          d.classList.toggle('active');
        }
      }
    });
  });
}

function change(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value = selectedObjects[k];
}

function update(k){
  const val = parseInt(document.getElementById('c_'+k).value);
  selectedObjects[k] = isNaN(val) || val<0 ? 0 : val;
}

function calculate(){
  let empty = Object.values(selectedObjects).every(v=>v===0);
  if(empty){ alert('Выберите хотя бы один объект'); return; }

  let res='';
  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    res+=`${k} x${v}\n`;
  });
  document.getElementById('result').innerText=res||'Ничего не выбрано';
  showStep(3);
}
