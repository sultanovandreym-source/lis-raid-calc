const steps = document.querySelectorAll('.step');

const selectedExp = new Set();
const selectedMat = new Set();
const selectedObj = {};

function showStep(n){
  steps.forEach(s=>s.classList.remove('active'));
  steps[n].classList.add('active');
}

function nextStep(n){
  if(n===1 && !selectedExp.size) return alert('Выберите взрывчатку');
  if(n===2 && !selectedMat.size) return alert('Выберите материал');
  if(n===2) loadObjects();
  showStep(n);
}

function prevStep(n){ showStep(n); }

/* ====== ДАННЫЕ ДЛЯ ИНТЕРФЕЙСА ====== */

const EXPLOSIVES = [
  ['bobovka','Бабовка'],
  ['dynamite','Динамит'],
  ['c4','C4'],
  ['hexogen','Гексоген'],
  ['rocket','Ракета']
];

const MATERIALS = [
  ['wood','Дерево'],
  ['stone','Камень'],
  ['metal','Железо'],
  ['steel','Сталь'],
  ['titan','Титан'],
  ['objects','Прочее']
];

const OBJECTS = {
  wood:[
    ['door','Деревянная дверь'],
    ['wall','Деревянная стена'],
    ['foundation','Деревянный фундамент']
  ],
  stone:[
    ['door','Каменная дверь'],
    ['wall','Каменная стена'],
    ['foundation','Каменный фундамент']
  ],
  metal:[
    ['door','Железная дверь'],
    ['wall','Железная стена'],
    ['foundation','Железный фундамент'],
    ['ladder','Складная лестница'],
    ['grate','Решётка']
  ],
  steel:[
    ['door','Стальная дверь'],
    ['wall','Стальная стена'],
    ['foundation','Стальной фундамент'],
    ['ladder','Складная лестница'],
    ['grate','Решётка']
  ],
  titan:[
    ['door','Титановая дверь'],
    ['wall','Титановая стена'],
    ['foundation','Титановый фундамент'],
    ['ladder','Складная лестница'],
    ['grate','Решётка']
  ],
  objects:[
    ['tracker','Устройство отслеживания'],
    ['auto_rifle','Автоматическая винтовка'],
    ['shotgun','Картечница'],
    ['trader','Торговый бот'],
    ['em_turret','ЭМ турель'],
    ['rocket_launcher','Ракетная установка']
  ]
};

/* ====== СОЗДАНИЕ КАРТОЧЕК ====== */

function createCard(name, key, set){
  const div=document.createElement('div');
  div.className='card';
  div.innerHTML=`<img src="images/${key}.png"><span>${name}</span>`;
  div.onclick=()=>{
    div.classList.toggle('active');
    div.classList.contains('active') ? set.add(key) : set.delete(key);
  };
  return div;
}

/* ====== ЗАГРУЗКА 1 И 2 ВКЛАДКИ ====== */

EXPLOSIVES.forEach(e=>{
  explosives.appendChild(createCard(e[1],e[0],selectedExp));
});

MATERIALS.forEach(m=>{
  materials.appendChild(createCard(m[1],m[0],selectedMat));
});

/* ====== 3 ВКЛАДКА ====== */

function loadObjects(){
  objects.innerHTML='';
  Object.keys(selectedObj).forEach(k=>delete selectedObj[k]);

  selectedMat.forEach(mat=>{
    OBJECTS[mat].forEach(o=>{
      const key=mat+'_'+o[0];
      selectedObj[key]=0;

      const c=document.createElement('div');
      c.className='card';
      c.innerHTML=`
        <img src="images/${o[0]}.png">
        <span>${o[1]}</span>
        <div class="counter">
          <button>-</button>
          <input value="0">
          <button>+</button>
        </div>
      `;

      const inp=c.querySelector('input');
      c.querySelectorAll('button')[0].onclick=()=>{
        inp.value=Math.max(0,+inp.value-1);
        selectedObj[key]=+inp.value;
      };
      c.querySelectorAll('button')[1].onclick=()=>{
        inp.value=+inp.value+1;
        selectedObj[key]=+inp.value;
      };
      inp.onchange=()=>selectedObj[key]=+inp.value||0;

      objects.appendChild(c);
    });
  });
}

/* ====== РАСЧЁТ (RAID_DATA У ТЕБЯ УЖЕ ЕСТЬ) ====== */

function calculate(){
  let out='';
  let sulfur=0;

  Object.entries(selectedObj).forEach(([k,c])=>{
    if(!c) return;
    const [mat,obj]=k.split('_');

    selectedExp.forEach(exp=>{
      const d=RAID_DATA[exp]?.[mat]?.[obj];
      if(d===null){
        out+=`${obj}: ${exp} — невозможно\n`;
      }else if(d){
        out+=`${obj}: ${exp} ${d[0]*c} шт (${d[1]*c} серы)\n`;
        sulfur+=d[1]*c;
      }
    });
    out+='\n';
  });

  result.textContent=out+`\nИТОГО СЕРЫ: ${sulfur}`;
  showStep(3);
}
