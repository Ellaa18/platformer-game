const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  color: 'red',
};

const platform = {
  x: 0,
  y: 350,
  width: 800,
  height: 50,
  color: 'green',
};

function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(platform);
  drawRect(player);

  requestAnimationFrame(gameLoop);
}

gameLoop();
