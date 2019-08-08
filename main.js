let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let pauseButton = document.querySelector('#pause');
let playerSize = 20;
let player = {
  y: canvas.height - playerSize,
  x: 0,
  height: playerSize,
  width: playerSize
};
let bullets = [];
let frameRate = 1;
let renderId = setInterval(render, frameRate);
let enemies = [];

function render() {
  resetCanvas();
  renderPlayer();
  setBulletMovement();
  setEnemyMovement();
  checkEnemyPlayerCollision();
}

function checkEnemyPlayerCollision() {
  enemies.forEach(enemy => {
    if (checkCollision(enemy, player)) {
      pause();
      alert('You Lost the Homefront');
    }
  });
}

function checkCollision(item1, item2) {
  let item1LeftSide = item1.x;
  let item1RightSide = item1.x + item1.width;
  let item1Bottom = item1.y + item1.height;
  let item1Top = item1.y;

  let item2LeftSide = item2.x;
  let item2RightSide = item2.x + item2.width;
  let item2Bottom = item2.y + item2.height;
  let item2Top = item2.y;

  if (
    item1RightSide > item2LeftSide &&
    item1LeftSide < item2RightSide &&
    item1Bottom > item2Top &&
    item1Top < item2Bottom
  ) {
    return true;
  }
  return false;
}

function setEnemyMovement() {
  enemies.forEach((enemy, i) => {
    if (enemies[i]) {
      enemy.render();
      enemies[i].y += 1;

      if (enemies[i].y > canvas.height) {
        enemies = enemies.filter(x => x !== enemies[i]);
      }
    }
  });
}

setInterval(function() {
  enemies.push(new Enemy(getRandomXcoordinate()));
}, 2000);

function getRandomXcoordinate() {
  return Math.round(Math.random() * canvas.width - player.width);
}

function setBulletMovement() {
  bullets.forEach((bullet, i) => {
    bullet.render();
    if (bullets[i]) {
      bullets[i].y -= 1;
      setTopBulletBoundary(i);
    }
  });
}

function setTopBulletBoundary(i) {
  if (bullets[i].y < 0) {
    bullets = bullets.filter(x => x != bullets[i]);
  }
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
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function Enemy(x) {
  this.x = x;
  this.y = 0;
  this.width = 20;
  this.height = 20;
  this.render = function() {
    ctx.fillStyle = 'red';
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

pauseButton.addEventListener('click', pause);

function pause() {
  clearInterval(renderId);
}
