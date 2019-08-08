let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let pauseButton = document.querySelector('#pause');
let player = {
  y: canvas.height - 25,
  x: 0,
  height: 20,
  width: 20
};
let bullets = [];
let renderId = setInterval(render, 1);

function render() {
  resetCanvas();
  renderPlayer();

  bullets.forEach((bullet, i) => {
    bullet.render();
    if (bullets[i]) {
      bullets[i].y -= 1;
      if (bullets[i].y < 0) {
        bullets = bullets.filter(x => x != bullets[i]);
      }
    }
  });
}

function renderPlayer() {
  ctx.fillStyle = 'green';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function shoot() {
  bullets.push(new Bullet(player.x + 5, player.y - 10));
}

function Bullet(x, y) {
  this.x = x;
  this.y = y;
  this.width = 10;
  this.height = 10;
  this.render = function() {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('keydown', key => {
  switch (key.which) {
    case 37: //left
      if (player.x > 0) player.x -= 10;
      break;
    case 65: //left
      if (player.x > 0) player.x -= 10;
      break;
    case 39: //right
      if (player.x < canvas.width - player.width) player.x += 10;
      break;
    case 68: //right
      if (player.x < canvas.width - player.width) player.x += 10;
      break;
  }
});

document.addEventListener('keyup', key => {
  if (key.which === 32) shoot();
});

pauseButton.addEventListener('click', () => {
  clearInterval(renderId);
});
