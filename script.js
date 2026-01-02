body {
  background: url('images/my_background.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: Arial, sans-serif;
  color: #fff;
  margin: 0;
}

.container {
  max-width: 900px;
  margin: 20px auto;
  background: rgba(0,0,0,0.75);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px #000;
}

h1,h2{text-align:center;}

.step { display:none; opacity:0; transition: opacity 0.4s ease; }
.step.active { display:block; opacity:1; }

.grid {
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
  margin:10px 0;
  justify-items:center;
}

.explosive, .material, .card {
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding:10px;
  text-align:center;
  cursor:pointer;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  transition:0.3s;
  width:100%;
}

.explosive img, .material img, .card img { width:70px; height:70px; object-fit:contain; margin-bottom:5px; }

.explosive.active, .material.active, .card.active { border:2px solid #fff; }

.btn {
  margin:10px auto;
  padding:10px 20px;
  background:#333;
  border:2px solid #fff;
  color:#fff;
  border-radius:6px;
  cursor:pointer;
  display:block;
  transition:0.3s;
}
.btn:hover { background:#444; }
.btn:disabled { background:#555; cursor:not-allowed; }

.counter { display:flex; align-items:center; gap:5px; margin-top:5px; }
.counter input { width:40px; text-align:center; border-radius:4px; border:none; }

pre { background: rgba(0,0,0,0.5); padding:10px; border-radius:5px; overflow:auto; }

/* Мобильная адаптация */
@media(max-width:600px){
  .grid { grid-template-columns:repeat(2,1fr); }
  .explosive img, .material img, .card img { width:60px; height:60px; }
    }
function renderObjects() {
  objBox.innerHTML = "";
  OBJECTS.forEach(obj => {
    if (obj.mat && obj.mat !== selectedMat) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="images/${obj.img}">
      <div>${obj.name}</div>
      <div class="counter">
        <button>-</button>
        <input value="0">
        <button>+</button>
      </div>
    `;

    const input = card.querySelector("input");
    card.querySelectorAll("button")[0].onclick = () => input.value = Math.max(0, +input.value - 1);
    card.querySelectorAll("button")[1].onclick = () => input.value++;

    input.oninput = () => {
      selectedObjects[obj.id] = +input.value;
      document.getElementById("calculate").disabled =
        !Object.values(selectedObjects).some(v => v > 0);
    };

    objBox.appendChild(card);
  });
}

document.getElementById("to-step-3").onclick = () => {
  renderObjects();
  showStep(2);
};

/* ================= РАСЧЁТ ================= */

document.getElementById("calculate").onclick = () => {
  let html = "";
  let totalSulfur = 0;

  for (const [obj, count] of Object.entries(selectedObjects)) {
    if (!count) continue;

    selectedExp.forEach(exp => {
      const cost = RAID[exp]?.[selectedMat]?.[obj];
      if (!cost) return;

      const need = cost * count;
      const sulfur = need * SULFUR[exp];
      totalSulfur += sulfur;

      html += `<p>${obj}: ${need} ${exp}, сера ${sulfur}</p>`;
    });
  }

  html += `<hr><b>Всего серы: ${totalSulfur}</b>`;
  document.getElementById("result-content").innerHTML = html;
  showStep(3);
};

document.getElementById("restart").onclick = () => location.reload();
