let selectedExp = [];
let selectedMat = [];
let selectedObjects = {};
const steps = document.querySelectorAll('.step');
const objectsDiv = document.getElementById('objects');

function showStep(n){
    steps.forEach(s => s.classList.remove('active'));
    steps[n].classList.add('active');
}

function nextStep(n){
    if(n===1 && selectedExp.length===0) return alert('Выберите взрывчатку');
    if(n===2 && selectedMat.length===0) return alert('Выберите материал');
    if(n===2) loadObjects();
    showStep(n);
}

function prevStep(n){ showStep(n); }

// Выбор взрывчатки
document.querySelectorAll('.exp').forEach(e=>{
    e.onclick = ()=>{
        e.classList.toggle('active');
        const v = e.dataset.exp;
        selectedExp.includes(v) ? selectedExp.splice(selectedExp.indexOf(v),1) : selectedExp.push(v);
    };
});

// Выбор материала
document.querySelectorAll('.mat').forEach(e=>{
    e.onclick = ()=>{
        e.classList.toggle('active');
        const v = e.dataset.mat;
        selectedMat.includes(v) ? selectedMat.splice(selectedMat.indexOf(v),1) : selectedMat.push(v);
    };
});

// Объекты для 3 вкладки
const names = {
    wood: {door:'Деревянная дверь', wall:'Деревянная стена', foundation:'Деревянный фундамент'},
    stone: {door:'Каменная дверь', wall:'Каменная стена', foundation:'Каменный фундамент'},
    metal: {door:'Железная дверь', wall:'Железная стена', foundation:'Железный фундамент', ladder:'Железная складная лестница', grate:'Железная решетка'},
    steel: {door:'Стальная дверь', wall:'Стальная стена', foundation:'Стальной фундамент', ladder:'Стальная складная лестница', grate:'Стальная решетка'},
    titan: {door:'Титановая дверь', wall:'Титановая стена', foundation:'Титановый фундамент', ladder:'Титановая складная лестница', grate:'Титановая решетка'},
    objects: {tracker:'Устройство отслеживания стрельбы', auto:'Установка с автоматической винтовкой', shotgun:'Автоматическая установка для картечи', trader:'Торговый бот', em:'Электромагнитная турель', rocket:'Ракетная пусковая установка'}
};

function loadObjects(){
    objectsDiv.innerHTML = '';
    selectedObjects = {};
    selectedMat.forEach(mat=>{
        Object.keys(names[mat] || {}).forEach(obj=>{
            const key = mat+'_'+obj;
            objectsDiv.innerHTML += `
            <div class="object-icon">
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

function chg(k,v){
    selectedObjects[k] = Math.max(0, (selectedObjects[k]||0)+v);
    document.getElementById('c_'+k).value = selectedObjects[k];
}
