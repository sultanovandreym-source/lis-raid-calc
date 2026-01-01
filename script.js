body {
  font-family: Arial, sans-serif;
  background: #181818;
  color: #fff;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: #222;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

h1, h2 { text-align: center; }

.step { display: none; }
.step.active { display: block; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-auto-rows: 120px;
  gap: 10px;
  margin: 10px 0;
}

.exp, .mat {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}

.exp img, .mat img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 5px;
}

.exp.active, .mat.active {
  background: #66f;
  color: #fff;
  font-weight: bold;
}

button {
  padding: 10px 20px;
  margin: 10px 5px;
  cursor: pointer;
  border: none;
  background: #66f;
  color: #fff;
  border-radius: 5px;
  transition: 0.2s;
}

button:hover { background: #55c; }

.objects .object-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #444;
}

.object-row img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.counter button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}

pre {
  background: #333;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}
