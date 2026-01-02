let selectedExp=[], selectedMat=[], selectedObjects={};
const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');
const next1=document.getElementById('next1');
const next2=document.getElementById('next2');
const calcBtn=document.getElementById('calcBtn');

const names={
  wood:{door:'Деревянная дверь', wall:'Деревянная стена', foundation:'Деревянный фундамент'},
  stone:{door:'Каменная дверь', wall:'Каменная стена', foundation:'Каменный фундамент'},
  metal:{door:'Металлическая дверь', wall:'Металлическая стена', foundation:'Металлический фундамент'},
  steel:{door:'Стальная дверь', wall:'Стальная стена', foundation:'Стальной фундамент'},
  titan:{door:'Титановая дверь', wall:'Титановая стена', foundation:'Титановый фундамент'},
  objects:{
    tracker:'Устройство отслеживания стрельбы',
    auto_shotgun:'Установка с автоматической винтовкой',
    auto_cart:'Автоматическая установка для картечи',
    trader_bot:'Торговый бот',
    em_turret:'Электромагнитная турель',
    rocket_launcher:'Ракетная пусковая установка'
  }
};

// Взрывчатка и цифры
const data={
  bobovka:{
    wood:{door:[2,240],wall:[4,480],foundation:[15,1800]},
    stone:{door:[3,360],wall:[10,1200],foundation:[40,4800]},
    metal:{door:[30,3600],wall:[100,12000],foundation:[400,48000]},
    steel:{door:[200,24000],wall:[667,80040],foundation:[2667,320040]},
    titan:{door:[800,96000],wall:[2667,320040],foundation:[400,48000]},
    objects:{tracker:[50,6000], auto_shotgun:[50,6000], auto_cart:[50,6000], trader_bot:[668,80160], em_turret:[50,6000], rocket_launcher:[50,6000]}
  },
  dynamite:{ /* данные по твоим цифрам */ },
  c4:{ /* данные */ },
  hexogen:{ /* данные */ },
  rocket:{ /* данные */ }
};

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n===1 && !selectedExp.length){ alert('Выберите взрывчатку'); return; }
  if(n===2 && !selectedMat.length){ alert('Выберите материал'); return; }
  if(n===2) loadObjects();
  showStep(n);
}

function prevStep(n){showStep(n)}

document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.exp;
    selectedExp.includes(v)?selectedExp.splice(selectedExp.indexOf(v),1):selectedExp.push(v);
    next1.disabled = !selectedExp.length;
  };
});

document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{
    e.classList.toggle('active');
    const v=e.dataset.mat;
    selectedMat.includes(v)?selectedMat.splice(selectedMat.indexOf(v),1):selectedMat.push(v);
    next2.disabled = !selectedMat.length;
  };
});

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMat.forEach(mat=>{
    Object.keys(names[mat]||{}).forEach(obj=>{
      const key=mat+'_'+obj;
      objectsDiv.innerHTML+=`
      <div class="object-icon">
        <img src="images/${mat=='objects'?obj+'.png':mat+'.png'}">
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
  calcBtn.disabled = false;
}

function chg(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value=selectedObjects[k];
}

function calculate(){
  let res='', totalSulfur=0, expTotals={};
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
