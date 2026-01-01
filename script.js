const explosives = {
    bababka: {
        "wood_door": {count: 2, sulfur: 240},
        "wood_wall": {count: 4, sulfur: 480},
        "wood_foundation": {count: 15, sulfur: 1800},
        "stone_door": {count: 3, sulfur: 360},
        "stone_wall": {count: 10, sulfur: 1200},
        "stone_foundation": {count: 40, sulfur: 4800},
        "metal_door": {count: 30, sulfur: 3600},
        "metal_wall": {count: 100, sulfur: 12000},
        "metal_foundation": {count: 400, sulfur: 48000},
        "metal_ladder": {count: 46, sulfur: 5520},
        "titan_door": {count: 800, sulfur: 96000},
        "titan_wall": {count: 2667, sulfur: 320040},
        "titan_ladder": {count: 1112, sulfur: 133440},
        "tracking_device": {count: 50, sulfur: 6000},
        "auto_rifle": {count: 50, sulfur: 6000},
        "grapeshot": {count: 50, sulfur: 6000},
        "trading_bot": {count: 668, sulfur: 80160},
        "electric_turret": {count: 50, sulfur: 6000},
        "rocket_launcher": {count: 50, sulfur: 6000}
    }
    // Можно добавить остальные виды взрывчатки здесь
};

document.getElementById('calculate').addEventListener('click', () => {
    const explosive = document.getElementById('explosive').value;
    const target = document.getElementById('target').value;
    const resultDiv = document.getElementById('result');

    if (explosives[explosive] && explosives[explosive][target]) {
        const data = explosives[explosive][target];
        resultDiv.innerHTML = `
            <p>Для разрушения выбранного объекта потребуется:</p>
            <p>Количество взрывчатки: <b>${data.count}</b></p>
            <p>Серы: <b>${data.sulfur}</b></p>
        `;
    } else {
        resultDiv.innerHTML = `<p>Невозможно разрушить выбранный объект выбранной взрывчаткой.</p>`;
    }
});
