let step=0;
let selectedExplosives=[];
let selectedMaterials=[];
let selectedObjects={};

const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

function show(){steps.forEach(s=>s.classList.remove('active'));steps[step].classList.add('active')}
function next(){step++; if(step===2) loadObjects(); show()}
function prev(){step--; show()}

document.querySelectorAll('.exp').forEach(e=>{
  e.onclick=()=>{e.classList.toggle('active');toggle(selectedExplosives,e.dataset.exp)}
});

document.querySelectorAll('.mat').forEach(e=>{
  e.onclick=()=>{e.classList.toggle('active');toggle(selectedMaterials,e.dataset.mat)}
});

function toggle(arr,v){
  arr.includes(v)?arr.splice(arr.indexOf(v),1):arr.push(v);
}

const objectsByMaterial={
  wood:[
    {id:'door',name:'Деревянная дверь'},
    {id:'wall',name:'Деревянная стена'},
    {id:'foundation',name:'Деревянный фундамент'}
  ],
  metal:[
    {id:'door',name:'Железная дверь'},
    {id:'wall',name:'Железная стена'}
  ],
  objects:[
    {id:'turret',name:'Турель'},
    {id:'shotgun',name:'Картечница'}
  ]
};

function loadObjects(){
  objectsDiv.innerHTML='';
  selectedObjects={};
  selectedMaterials.forEach(mat=>{
    objectsByMaterial[mat]?.forEach(o=>{
      const key=`${mat}_${o.id}`;
      selectedObjects[key]=0;
      objectsDiv.innerHTML+=`
      <div class="card">
        <img src="images/${key}.png">
        <span>${o.name}</span>
        <div>
          <button onclick="chg('${key}',-1)">-</button>
          <span id="${key}">0</span>
          <button onclick="chg('${key}',1)">+</button>
        </div>
      </div>`;
    })
  })
}

function chg(k,v){
  selectedObjects[k]=Math.max(0,selectedObjects[k]+v);
  document.getElementById(k).innerText=selectedObjects[k];
}

const data={
  bobovka:{
    wood:{door:{count:2,sulfur:240},wall:{count:4,sulfur:480}}
  },
  dynamite:{
    wood:{door:{count:1,sulfur:500},wall:{count:2,sulfur:1000}}
  }
};

function calculate(){
  let res='',sum=0;
  for(let k in selectedObjects){
    let qty=selectedObjects[k];
    if(!qty)continue;
    let [mat,obj]=k.split('_');
    res+=`${k} x${qty}\n`;
    selectedExplosives.forEach(exp=>{
      let v=data[exp]?.[mat]?.[obj];
      if(v){
        sum+=v.sulfur*qty;
        res+=` ${exp}: ${v.count*qty}\n`;
      }
    })
  }
  res+=`\nСера всего: ${sum}`;
  document.getElementById('result').innerText=res;
  step=3;show();
}
