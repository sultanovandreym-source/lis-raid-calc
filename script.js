body{font-family:sans-serif;background:#f5f5f5;margin:0;padding:0}
.container{max-width:600px;margin:0 auto;padding:20px;background:#fff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1)}
h1{text-align:center;margin-bottom:20px}
.cards{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0;justify-content:center}
.card{flex:0 1 28%;display:flex;flex-direction:column;align-items:center;padding:10px;background:#ddd;border-radius:10px;cursor:pointer;user-select:none;transition:0.2s; text-align:center;}
.card img{width:50px;height:50px;margin-bottom:5px}
.card.active{background:#4CAF50;color:white;font-weight:bold;transform:scale(1.05)}
.step{display:none}
.step.active{display:block}
button{padding:10px 20px;margin:5px;border:none;border-radius:5px;background:#4CAF50;color:white;cursor:pointer}
button:hover{background:#45a049}
pre{background:#eee;padding:10px;border-radius:5px;overflow:auto}
.counter{display:flex;align-items:center;gap:10px;margin:10px 0;justify-content:center}
