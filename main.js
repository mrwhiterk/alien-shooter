let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let pauseButton = document.querySelector('#pause');
let playerSize = 20;
let killCounter = document.querySelector('#kill-count');
let killCount = 0;
let player = {
  y: canvas.height - playerSize,
  x: 0,
  height: playerSize,
  width: playerSize,
  speedX: 0,
  speedY: 0,
  newPos: function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
};
let bullets = [];
let frameRate = 1;
let renderId = setInterval(render, frameRate);
let enemies = [];
let healthBar = document.querySelector('#health');
let health = 4;
let highScoreList = document.querySelector('#high-scores');
const storage = JSON.parse(localStorage.getItem('highScores'));
let highScores = storage || [];
let myGameArea = {};

function printHighScores() {
  highScoreList.innerHTML = '';
  highScores = highScores.sort((a, b) => (a.score < b.score ? 1 : -1));
  highScores.forEach(item => {
    let li = document.createElement('li');
    li.innerHTML = `<div id="score-entry"><p>${
      item.username
    }</p> <p id="score-entry-points">${item.score}</p></div>`;
    highScoreList.appendChild(li);
  });
}

printHighScores();

function render() {
  resetCanvas();
  setController();
  player.newPos();
  renderPlayer();
  setBulletMovement();
  setEnemyMovement();
  checkEnemyPlayerCollision();
  checkBulletEnemyCollision();
}

function checkEnemyPlayerCollision() {
  enemies.forEach((enemy, enemyIndex) => {
    if (checkCollision(enemy, player)) {
      enemies = enemies.filter(e => e !== enemies[enemyIndex]);

      healthBar.innerText = healthBar.innerText.slice(0, -2);
      health -= 1;
      if (health <= 0) {
        pause();
        canvas.style.backgroundColor = 'red';
        setTimeout(function() {
          alert('You Lost the Home Front');
          let username = prompt(
            'Enter your initials: (If you want to post score)'
          );
          if (username) {
            highScores.push({ username, score: killCount });
            printHighScores();
            localStorage.setItem('highScores', JSON.stringify(highScores));
          }
        }, 1000);
      }
    }
  });
}

function checkBulletEnemyCollision() {
  enemies.forEach((enemy, enemyIndex) => {
    bullets.forEach((bullet, bulletIndex) => {
      if (checkCollision(enemy, bullet)) {
        enemies = enemies.filter(e => e !== enemies[enemyIndex]);
        bullets = bullets.filter(e => e !== bullets[bulletIndex]);
        killCounter.innerText = ++killCount;
      }
    });
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
      enemies[i].y += enemies[i].speed;
      enemies[i].x += enemies[i].direction;

      if (enemies[i].y > canvas.height) {
        enemies = enemies.filter(x => x !== enemies[i]);
      }
    }
  });
}

setInterval(function() {
  enemies.push(new Enemy(getRandomXcoordinate()));
}, 300);

function getRandomXcoordinate() {
  return Math.round(Math.random() * canvas.width);
}

function getRandInt(min, max) {
  return Math.floor(Math.random() * max - min) + min;
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
  this.speed = 1 + Math.random();
  this.direction = player.x <= 250 ? -0.2 : 0.2;
  this.render = function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('keydown', function(e) {
  myGameArea.keys = myGameArea.keys || [];
  myGameArea.keys[e.keyCode] = true;
});

window.addEventListener('keyup', function(e) {
  myGameArea.keys[e.keyCode] = false;
});

pauseButton.addEventListener('click', pause);

function pause() {
  clearInterval(renderId);
}

function setController() {
  player.speedX = 0;
  player.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[37]) {
    player.speedX = -1;
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    player.speedX = 1;
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    player.speedY = -1;
  }
  if (myGameArea.keys && myGameArea.keys[40]) {
    player.speedY = 1;
  }
  if (
    (myGameArea.keys && myGameArea.keys[20]) ||
    (myGameArea.keys && myGameArea.keys[32])
  ) {
    shoot();
    myGameArea.keys[20] = false;
    myGameArea.keys[32] = false;
  }
}
