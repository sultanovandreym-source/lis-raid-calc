const explosives = {
    bobovka: {
        name: "Бобовка",
        sulfur: 120,
        data: {
            wood: { door: 2, wall: 4, foundation: 15 },
            stone: { door: 3, wall: 10, foundation: 40 },
            metal: { door: 30, wall: 100, foundation: 400, ladder: 46 },
            mvp: { door: 200, wall: 667, foundation: 2667, ladder: 275 },
            titan: { door: 800, wall: 2667, ladder: 1112 }
        }
    },
    dynamite: {
        name: "Динамит",
        sulfur: 500,
        data: {
            wood: { door: 1, wall: 2, foundation: 8 },
            stone: { door: 2, wall: 5, foundation: 20 },
            metal: { door: 4, wall: 13, foundation: 50, ladder: 7 },
            mvp: { door: 20, wall: 67, foundation: 267, ladder: 28 },
            titan: { door: 80, wall: 200, foundation: 800, ladder: 112 }
        }
    }
};

let objects = [];

function addObject() {
    const material = document.getElementById("material").value;
    const object = document.getElementById("object").value;
    const count = parseInt(document.getElementById("count").value);

    objects.push({ material, object, count });
    renderList();
}

function renderList() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    for (let i = 0; i < objects.length; i++) {
        const o = objects[i];
        list.innerHTML += `${i + 1}) ${o.count} × ${o.object} (${o.material})<br>`;
    }
}

function calculate() {
    if (objects.length === 0) {
        document.getElementById("result").innerHTML =
            "❗ Добавь хотя бы один объект";
        return;
    }

    const explosiveKey = document.getElementById("explosive").value;
    const explosive = explosives[explosiveKey];

    let totalExplosives = 0;
    let totalSulfur = 0;
    let output = "";

    for (let o of objects) {
        const materialData = explosive.data[o.material];
        if (!materialData || materialData[o.object] === undefined) {
            output += `❌ Нельзя разрушить ${o.object} (${o.material})<br>`;
            continue;
        }

        const need = materialData[o.object] * o.count;
        totalExplosives += need;
        totalSulfur += need * explosive.sulfur;

        output += `✔ ${o.count} × ${o.object}: ${need} ${explosive.name}<br>`;
    }

    document.getElementById("result").innerHTML =
        output +
        "<hr>" +
        `<b>ИТОГО:</b><br>
         Взрывчатка: ${totalExplosives}<br>
         Сера: ${totalSulfur}`;
}
