body {
  font-family: Arial, sans-serif;
  background: #f0f0f0;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

h1 { text-align: center; }

.step { display: none; }
.step.active { display: block; }

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 140px;
  gap: 10px;
  margin: 10px 0;
}

.exp, .mat, .object-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #eee;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: 0.2s;
  height: 140px;
}

.exp img, .mat img, .object-row img {
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

.objects .counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

pre {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}
