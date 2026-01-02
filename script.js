let selectedExplosives = [];
let selectedMaterials = [];
let selectedObjects = {};

const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

// === Шаги ===
function showStep(n){
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}

// Кнопки "Далее" и "Назад"
document.getElementById('next1').onclick = () => {
  if(selectedExplosives.length === 0){
    alert('Выберите хотя бы одну взрывчатку!');
    return;
  }
  showStep(1);
};
document.getElementById('prev2').onclick = () => showStep(0);
document.getElementById('next2').onclick = () => {
  if(selectedMaterials.length === 0){
    alert('Выберите хотя бы один материал!');
    return;
  }
  loadObjects();
  showStep(2);
};
document.getElementById('prev3').onclick = () => showStep(1);
document.getElementById('calculate').onclick = () => {
  if(Object.values(selectedObjects).every(v => v===0)){
    alert('Выберите количество объектов!');
    return;
  }
  calculate();
};
document.getElementById('prev4').onclick = () => showStep(2);

// === Выбор взрывчатки ===
document.querySelectorAll('.exp').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const val = el.dataset.exp;
    selectedExplosives.includes(val)
      ? selectedExplosives = selectedExplosives.filter(x=>x!==val)
      : selectedExplosives.push(val);
  };
});

// === Выбор материалов ===
document.querySelectorAll('.mat').forEach(el => {
  el.onclick = () => {
    el.classList.toggle('active');
    const val = el.dataset.mat;
    selectedMaterials.includes(val)
      ? selectedMaterials = selectedMaterials.filter(x=>x!==val)
      : selectedMaterials.push(val);
  };
});

// === Объекты ===
const objectNames = {
  door:'Дверь', wall:'Стена', foundation:'Фундамент', ladder:'Лестница', grate:'Решётка',
  tracker:'Трекер', auto_rifle:'Автомат', auto_shotgun:'Картечница', trader_bot:'Торговый бот',
  em_turret:'Турель', rocket_launcher:'Ракетная установка'
};

const objectsByMaterial = {
  wood:['door','wall','foundation'],
  stone:['door','wall','foundation'],
  metal:['door','wall','foundation','ladder','grate'],
  steel:['door','wall','foundation','ladder','grate'],
  titan:['door','wall','foundation','ladder','grate'],
  objects:['tracker','auto_rifle','auto_shotgun','trader_bot','em_turret','rocket_launcher']
};

function loadObjects(){
  objectsDiv.innerHTML = '';
  selectedObjects = {};

  selectedMaterials.forEach(mat => {
    objectsByMaterial[mat].forEach(obj => {
      const key = `${mat}_${obj}`;
      selectedObjects[key] = 0;
      const img = mat==='objects' ? `images/${obj}.png` : `images/${mat}_${obj}.png`;

      const div = document.createElement('div');
      div.className = 'object-icon';
      div.innerHTML = `
        <img src="${img}" alt="${objectNames[obj]}">
        <span>${objectNames[obj]}</span>
        <div class="counter">
          <button onclick="change('${key}',-1)">-</button>
          <input type="number" id="c_${key}" value="0" min="0" onchange="inputChange('${key}')">
          <button onclick="change('${key}',1)">+</button>
        </div>`;
      objectsDiv.appendChild(div);
    });
  });
}

function change(k,v){
  const input = document.getElementById('c_'+k);
  selectedObjects[k] = Math.max(0,(selectedObjects[k]||0)+v);
  input.value = selectedObjects[k];
}

function inputChange(k){
  const input = document.getElementById('c_'+k);
  selectedObjects[k] = Math.max(0, parseInt(input.value) || 0);
  input.value = selectedObjects[k];
}

// === Данные взрывчатки ===
const data = {
  bobovka: { wood:{door:{count:2,sulfur:240}, wall:{count:4,sulfur:480}, foundation:{count:15,sulfur:1800}}, metal:{door:{count:30,sulfur:3600}, wall:{count:100,sulfur:12000}} },
  dynamite: { wood:{door:{count:1,sulfur:500}, wall:{count:2,sulfur:1000}}, metal:{door:{count:4,sulfur:2000}, wall:{count:13,sulfur:6500}} },
  c4: { wood:{door:{count:1,sulfur:1500}}, metal:{door:{count:2,sulfur:3000}} },
  hexogen: { wood:{door:{count:1,sulfur:2500}}, metal:{door:{count:1,sulfur:2500}} },
  rocket: { wood:{door:{count:1,sulfur:1500}}, metal:{door:{count:2,sulfur:3000}} }
};

// === Расчет ===
function calculate(){
  let res = '';
  let total = 0;

  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(v===0) return;
    const [mat,obj] = k.split('_');
    res += `${objectNames[obj]} (${mat}) x${v}\n`;

    selectedExplosives.forEach(exp=>{
      const val = data[exp]?.[mat]?.[obj];
      if(val){
        res += `  ${exp}: ${val.count*v} шт (Сера: ${val.sulfur*v})\n`;
        total += val.sulfur*v;
      } else {
        res += `  ${exp}: Невозможно\n`;
      }
    });
    res+='\n';
  });

  res += `Общее количество серы: ${total}`;
  document.getElementById('result').innerText = res;
  showStep(3);
        }
