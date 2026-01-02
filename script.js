let selectedExp = [], selectedMat = [], selectedObjects = {};
const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

// Навигация между вкладками
function showStep(n){
  steps.forEach(s => s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n === 1 && !selectedExp.length) return alert('Выберите взрывчатку');
  if(n === 2 && !selectedMat.length) return alert('Выберите материал');
  if(n === 2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

// Обработчики выбора взрывчатки и материалов
document.addEventListener('click', function(e){
  // Выбор взрывчатки
  let expDiv = e.target.closest('.exp');
  if(expDiv){
    const v = expDiv.dataset.exp;
    expDiv.classList.toggle('active');
    if(selectedExp.includes(v)){
      selectedExp.splice(selectedExp.indexOf(v),1);
    } else selectedExp.push(v);
  }

  // Выбор материала
  let matDiv = e.target.closest('.mat');
  if(matDiv){
    const v = matDiv.dataset.mat;
    matDiv.classList.toggle('active');
    if(selectedMat.includes(v)){
      selectedMat.splice(selectedMat.indexOf(v),1);
    } else selectedMat.push(v);
  }
});

// Объекты для каждого материала
const names = {
  wood:{door:'Деревянная дверь', wall:'Деревянная стена', foundation:'Деревянный фундамент'},
  stone:{door:'Каменная дверь', wall:'Каменная стена', foundation:'Каменный фундамент'},
  metal:{door:'Железная дверь', wall:'Железная стена', foundation:'Железный фундамент', ladder:'Железная складная лестница', grate:'Железная решетка'},
  steel:{door:'Стальная дверь', wall:'Стальная стена', foundation:'Стальной фундамент', ladder:'Стальная складная лестница', grate:'Стальная решетка'},
  titan:{door:'Титановая дверь', wall:'Титановая стена', foundation:'Титановый фундамент', ladder:'Титановая складная лестница', grate:'Титановая решетка'},
  objects:{tracker:'Устройство отслеживания стрельбы', auto_shotgun:'Установка с автоматической винтовкой', shotgun_turret:'Автоматическая установка для картечи', trader_bot:'Торговый бот', em_turret:'Электромагнитная турель', rocket_launcher:'Ракетная пусковая установка'}
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects = {};
  selectedMat.forEach(mat=>{
    Object.keys(names[mat]||{}).forEach(obj=>{
      const key = mat+'_'+obj;
      objectsDiv.innerHTML += `
      <div class="object-icon">
        <img src="images/${mat}_${obj}.png">
        <span>${names[mat][obj]}</span>
        <div class="counter">
          <button onclick="chg('${key}',-1)">-</button>
          <input id="c_${key}" value="0">
          <button onclick="chg('${key}',1)">+</button>
        </div>
      </div>`;
      selectedObjects[key] = 0;
    });
  });
}

// Управление количеством
function chg(k,v){
  selectedObjects[k] = Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value = selectedObjects[k];
}

// Расчет (пока простая демонстрация)
function calculate(){
  let res='', totalSulfur = 0, expTotals = {};
  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    const [mat,obj] = k.split('_');
    res += `${names[mat][obj]} x${v}\n`;
  });
  document.getElementById('result').innerText = res;
  showStep(3);
}
