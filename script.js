const objectMap = {
  wood: [
    {id:'door', name:'Деревянная дверь'},
    {id:'wall', name:'Деревянная стена'},
    {id:'foundation', name:'Деревянный фундамент'}
  ],
  stone: [
    {id:'door', name:'Каменная дверь'},
    {id:'wall', name:'Каменная стена'},
    {id:'foundation', name:'Каменный фундамент'}
  ],
  metal: [
    {id:'door', name:'Металлическая дверь'},
    {id:'wall', name:'Металлическая стена'},
    {id:'foundation', name:'Металлический фундамент'},
    {id:'grate', name:'Металлическая решётка'}
  ],
  steel: [
    {id:'door', name:'Стальная дверь'},
    {id:'wall', name:'Стальная стена'},
    {id:'foundation', name:'Стальной фундамент'},
    {id:'grate', name:'Стальная решётка'}
  ],
  titan: [
    {id:'door', name:'Титановая дверь'},
    {id:'wall', name:'Титановая стена'},
    {id:'foundation', name:'Титановый фундамент'},
    {id:'ladder', name:'Титановая лестница'}
  ],
  objects: [
    {id:'em_turret', name:'Электромагнитная турель'},
    {id:'trader_bot', name:'Торговый бот'},
    {id:'tracker', name:'Устройство отслеживания'},
    {id:'rocket_launcher', name:'Ракетная пусковая установка'}
  ]
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};

  selectedMat.forEach(mat=>{
    (objectMap[mat]||[]).forEach(o=>{
      const key=`${mat}_${o.id}`;
      const img = mat==='objects'
        ? `images/object_${o.id}.png`
        : `images/${mat}_${o.id}.png`;

      objectsDiv.innerHTML+=`
      <div class="object-icon">
        <img src="${img}">
        <span>${o.name}</span>
        <div class="counter">
          <button onclick="chg('${key}',-1)">−</button>
          <input id="c_${key}" value="0" oninput="manual('${key}',this.value)">
          <button onclick="chg('${key}',1)">+</button>
        </div>
      </div>`;
      selectedObjects[key]=0;
    });
  });
}

function chg(k,v){
  selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
  document.getElementById('c_'+k).value=selectedObjects[k];
}

function manual(k,val){
  const n=parseInt(val)||0;
  selectedObjects[k]=Math.max(0,n);
}
