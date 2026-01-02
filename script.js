let selectedExp=[],selectedMat=[],selectedObjects={};
const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

const names={
  wood:{door:'Деревянная дверь',wall:'Деревянная стена',foundation:'Деревянный фундамент'},
  stone:{door:'Каменная дверь',wall:'Каменная стена',foundation:'Каменный фундамент'},
  metal:{door:'Железная дверь',wall:'Железная стена',foundation:'Железный фундамент',ladder:'Железная складная лестница',grate:'Железная решетка'},
  steel:{door:'Стальная дверь',wall:'Стальная стена',foundation:'Стальной фундамент',ladder:'Стальная складная лестница',grate:'Стальная решетка'},
  titan:{door:'Титановая дверь',wall:'Титановая стена',foundation:'Титановый фундамент',ladder:'Титановая складная лестница',grate:'Титановая решетка'},
  objects:{tracker:'Устройство отслеживания стрельбы',auto_shotgun:'Установка с автоматической винтовкой',shotgun_turret:'Автоматическая установка для картечи',trader_bot:'Торговый бот',em_turret:'Электромагнитная турель',rocket_launcher:'Ракетная пусковая установка'}
};

const data={
  bobovka:{wood:{door:[1,10],wall:[2,20],foundation:[3,30]},stone:{door:[2,30],wall:[3,50],foundation:[4,70]}},
  dynamite:{metal:{door:[2,40],wall:[3,60],foundation:[4,80],ladder:[2,20],grate:[2,25]}},
  c4:{steel:{door:[1,50],wall:[2,80],foundation:[3,100],ladder:[1,30],grate:[1,40]}},
  hexogen:{titan:{door:[1,70],wall:[2,100],foundation:[3,120],ladder:[1,50],grate:[1,60]}},
  rocket:{steel:{door:[2,60],wall:[3,90],foundation:[4,110],ladder:[2,40],grate:[2,50]}}
};

// Навигация между вкладками
function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n===1 && !selectedExp.length)return alert('Выберите взрывчатку');
  if(n===2 && !selectedMat.length)return alert('Выберите материал');
  if(n===2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

// Выбор взрывчатки
document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExp.includes(v)?selectedExp.splice(selectedExp.indexOf(v),1):selectedExp.push(v);
  };
});

// Выбор материалов
document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMat.includes(v)?selectedMat.splice(selectedMat.indexOf(v),1):selectedMat.push(v);
  };
});

// Загрузка объектов для выбранных материалов
function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMat.forEach(mat=>{
    Object.keys(names[mat]||{}).forEach(obj=>{
      const key=mat+'_'+obj;
      objectsDiv.innerHTML+=`
      <div class="object-icon">
        <img src="images/${mat}_${obj}.png">
        <span>${names[mat][obj]}</span>
        <div class="counter">
          <button onclick="chg('${key}',-1)">-</button>
          <input id="c_${key}" value="0">
          <button onclick="chg('${key}',1)">+</button>
        </div>
      </div>`;
      selectedObjects[key]=0;
    });
  });
}

// Изменение количества объекта
function chg(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value=selectedObjects[k];
}

// Расчет результатов
function calculate(){
  let res='',totalSulfur=0,expTotals={};
  Object.entries(selectedObjects).forEach(([k,v])=>{
    if(!v) return;
    const [mat,obj]=k.split('_');
    res+=`${names[mat][obj]} x${v}\n`;
    selectedExp.forEach(e=>{
      const d=data[e]?.[mat]?.[obj];
      if(!d) return;
      const c=d[0]*v, s=d[1]*v;
      expTotals[e]=(expTotals[e]||0)+c;
      totalSulfur+=s;
      res+=`${e}: ${c} шт (${s} серы)\n`;
    });
    res+='\n';
  });
  res+='Итого:\n';
  Object.entries(expTotals).forEach(([e,v])=>res+=`${e} — ${v} шт\n`);
  res+=`\nОбщее количество серы: ${totalSulfur}`;
  document.getElementById('result').innerText=res;
  showStep(3);
}
