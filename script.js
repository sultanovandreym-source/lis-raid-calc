let selectedExp=[],selectedMat=[],selectedObjects={};
const steps=document.querySelectorAll('.step');
const objectsDiv=document.getElementById('objects');

function showStep(n){
steps.forEach(s=>s.classList.remove('active'));
steps[n].classList.add('active');
}
function nextStep(n){
if(n===1&&!selectedExp.length)return alert('Выберите взрывчатку');
if(n===2&&!selectedMat.length)return alert('Выберите материал');
if(n===2)loadObjects();
showStep(n);
}
function prevStep(n){showStep(n)}

document.querySelectorAll('.exp').forEach(e=>{
e.onclick=()=>{
e.classList.toggle('active');
const v=e.dataset.exp;
selectedExp.includes(v)?selectedExp.splice(selectedExp.indexOf(v),1):selectedExp.push(v);
};
});
document.querySelectorAll('.mat').forEach(e=>{
e.onclick=()=>{
e.classList.toggle('active');
const v=e.dataset.mat;
selectedMat.includes(v)?selectedMat.splice(selectedMat.indexOf(v),1):selectedMat.push(v);
};
});

const names={
wood:{door:'Деревянная дверь',wall:'Деревянная стена',foundation:'Деревянный фундамент'},
metal:{door:'Металлическая дверь',wall:'Металлическая стена',foundation:'Металлический фундамент'},
objects:{turret:'Электромагнитная турель'}
};

const data={
c4:{metal:{door:[2,3000]}},
dynamite:{metal:{door:[4,2000]}},
rocket:{metal:{door:[2,3000]}}
};

function loadObjects(){
objectsDiv.innerHTML='';
selectedObjects={};
selectedMat.forEach(mat=>{
Object.keys(names[mat]||{}).forEach(obj=>{
const key=mat+'_'+obj;
objectsDiv.innerHTML+=`
<div class="object-icon">
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

function chg(k,v){
selectedObjects[k]=Math.max(0,(selectedObjects[k]||0)+v);
document.getElementById('c_'+k).value=selectedObjects[k];
}

function calculate(){
let res='',totalSulfur=0,expTotals={};
Object.entries(selectedObjects).forEach(([k,v])=>{
if(!v)return;
const [mat,obj]=k.split('_');
res+=`${names[mat][obj]} x${v}\n`;
selectedExp.forEach(e=>{
const d=data[e]?.[mat]?.[obj];
if(!d)return;
const c=d[0]*v,s=d[1]*v;
expTotals[e]=(expTotals[e]||0)+c;
totalSulfur+=s;
res+=`${e.toUpperCase()}: ${c} шт (${s} серы)\n`;
});
res+='\n';
});
res+='Итого:\n';
Object.entries(expTotals).forEach(([e,v])=>res+=`${e.toUpperCase()} — ${v} шт\n`);
res+=`\nОбщее количество серы: ${totalSulfur}`;
document.getElementById('result').innerText=res;
showStep(3);
}
