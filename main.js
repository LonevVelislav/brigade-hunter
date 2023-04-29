const gameStart = document.querySelector(".game-start");
const gameArea = document.querySelector(".game-area");
const gameOver = document.querySelector(".game-over");
const gameScore = document.querySelector(".game-score span");
const helthBar = document.querySelector(".helth");
const helthBarHag = document.querySelector(".helth-hag");
const healthBorder = document.querySelector(".helth-border");
const hagHelthBorder = document.querySelector(".helth-border-hag");
const coolDownBackground = document.querySelector(".cooldown");
const endScore = document.querySelector(".endScore");
const newGame = document.querySelector(".new-game");
const controls = document.querySelector(".controls");

gameStart.addEventListener("click", onGameStart);
newGame.addEventListener("click", startNewGame);

function onGameStart() {
  gameStart.classList.add("hidden");
  controls.classList.add("hidden");
  healthBorder.classList.remove("hidden");

  const hunter = document.createElement("div");
  hunter.classList.add("hunter");
  hunter.style.top = player.y + "px";
  hunter.style.left = player.x + "px";
  gameArea.appendChild(hunter);

  const dog = document.createElement("div");
  dog.classList.add("dog");
  dog.style.top = player.y + "px";
  dog.style.left = player.x + "px";
  gameArea.appendChild(dog);

  const hag = document.createElement("div");
  hag.classList.add("hag");
  hag.line = player.currentLine;
  hag.style.top = boss.y + "px";
  hag.style.left = boss.x + "px";
  gameArea.appendChild(hag);

  const couldron = document.createElement("div");
  couldron.classList.add("couldron");
  couldron.classList.add("hidden");
  couldron.style.top = boss.y + "px";
  couldron.style.left = boss.x - 250 + "px";
  gameArea.appendChild(couldron);

  player.width = hunter.offsetWidth;
  player.height = hunter.offsetHeight;
  window.addEventListener("keydown", (e) => {
    const hunter = document.querySelector(".hunter");
    const dog = document.querySelector(".dog");
    if (e.code === "ArrowDown" && player.jumping === false) {
      if (player.currentLine < 4) {
        player.currentLine++;
        player.currentZIndex++;
        player.y =
          document
            .querySelector(`.grass-line-${player.currentLine}`)
            .getBoundingClientRect().bottom - hunter.clientHeight;

        dog.style.zIndex = player.currentZIndex - 1;
        hunter.style.zIndex = player.currentZIndex;
        dog.style.top = player.y + "px";
        hunter.style.top = player.y + "px";
      }
    }
    if (e.code === "ArrowUp" && player.jumping === false) {
      if (player.currentLine > 1) {
        player.currentLine--;
        player.currentZIndex--;
        player.y =
          document
            .querySelector(`.grass-line-${player.currentLine}`)
            .getBoundingClientRect().bottom - hunter.clientHeight;

        dog.style.zIndex = player.currentZIndex - 1;
        hunter.style.zIndex = player.currentZIndex;
        dog.style.top = player.y + "px";
        hunter.style.top = player.y + "px";
      }
    }
  });

  window.requestAnimationFrame(gameRender);
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

let keys = {};
let player = {
  won: false,
  dogCoolDownPercent: 100,
  hit: false,
  currentHealthBar: 100,
  xVelocity: 0,
  yVelocity: 0,
  jumping: false,
  x: 100,
  y:
    document.querySelector(".grass-line-1").getBoundingClientRect().bottom -
    220,
  currentLine: 1,
  currentZIndex: 2,
  width: 0,
  height: 0,
  lastTimeFired: 0,
  lastDogAtack: 0,
};
let boss = {
  x: gameArea.offsetWidth,
  y:
    document
      .querySelector(`.grass-line-${player.currentLine}`)
      .getBoundingClientRect().bottom - 400,
  currentHealthBar: 100,
  fireBallCast: true,
  hagLastFireBall: 0,
  hagLastMove: 0,
  lastThunder: 0,
  lastRemove: 0,
  removeInterval: 3100,
  hagFireBallInterval: 1100,
  hagMoveInterval: 1200,
  thunderInterval: 1500,
  dogBite: false,
};
let game = {
  speed: 1,
  enemieSpeed: 1,
  moveMulti: 3,
  bulletMulti: 12,
  dogJumpSpeed: 12,
  dogSpeed: 2,
  witchSpeed: 3,
  swineSpeed: 1,
  centSpeed: 0.5,
  fireInterval: 500,
  dogAtackInterval: 18475.2,
  treeRenderInterval: 20000,
  cloudRenderInterval: 5000,
  dogRenderInterval: 1000,
  witchRenderInterval: 3000,
  swineRenderInterval: 5000,
  archerRenderInterval: 4000,
  archerSpearThrowInterval: 2000,
  centaurRenderInterval: 7000,
  witchHealth: 2,
  archerHealth: 3,
  swineHealth: 5,
  centaurHealth: 7,
  maxScore: 2000,
};
let scene = {
  score: 0,
  activeGame: true,
  time: 0,
  lastMoveOfDog: 0,
  lastTreeRender: 0,
  lastCloudRender: 0,
  lastDogRender: 0,
  lastWitchRender: 0,
  lastSwineRender: 0,
  lastArcherRender: 0,
  lastArcherSpearThrow: 0,
  lastCentaurRender: 0,
};

function onKeyDown(e) {
  keys[e.code] = true;
}
function onKeyUp(e) {
  keys[e.code] = false;
}

function gameRender(timestamp) {
  scene.time = timestamp;
  const hunter = document.querySelector(".hunter");
  const dog = document.querySelector(".dog");
  const hag = document.querySelector(".hag");
  const couldron = document.querySelector(".couldron");
  dogCoolDown();
  userInput(hunter, dog);
  moveBullets();
  moveDogAtack(dog);
  addTrees();
  addClouds();
  collisionDetector(hunter);
  if (scene.score < game.maxScore) {
    renderDogEnemie();
  }
  if (scene.score < game.maxScore && scene.score >= 100) {
    renderWitch();
  }
  if (scene.score < game.maxScore && scene.score >= 300) {
    renderArcher();
  }
  if (scene.score < game.maxScore && scene.score >= 600) {
    renderSwine();
  }
  if (scene.score < game.maxScore && scene.score >= 800) {
    renderCentaur();
  }
  if (scene.score >= game.maxScore) {
    removeAllElements();
    couldron.classList.remove("hidden");
    hagHelthBorder.classList.remove("hidden");
    hag.x = gameArea.offsetWidth - 500;
    hag.style.transition = "all 5s";
    hag.style.left = hag.x + "px";
    hag.style.zIndex = hag.line + 1;
    setTimeout(function () {
      hag.style.removeProperty("transition");
      bossFight(hag);
    }, 3000);
  }

  gameScore.textContent = scene.score;
  if (scene.activeGame === true) {
    window.requestAnimationFrame(gameRender);
  }
}

function userInput(hunter, dog) {
  if (keys.Space && player.jumping === false) {
    player.yVelocity -= 59;
    player.jumping = true;
    hunter.classList.add("hunter-jump");
  }
  if (player.jumping) {
    if (
      keys.ArrowRight &&
      player.x + player.width < gameArea.offsetWidth - player.width
    ) {
      player.xVelocity += 1.1;
    }
    if (keys.ArrowLeft && player.x > 0 + player.width) {
      player.xVelocity -= 1.1;
    }
    player.yVelocity += 1.1;
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    player.xVelocity *= 0.9;
    player.yVelocity *= 0.9;

    if (
      player.y >=
      document
        .querySelector(`.grass-line-${player.currentLine}`)
        .getBoundingClientRect().bottom -
        hunter.clientHeight
    ) {
      hunter.classList.remove("hunter-jump");
      player.jumping = false;
    }
  }

  if (keys.ArrowLeft && player.x > 0 && player.jumping === false) {
    player.x -= game.speed * game.moveMulti;
  }
  if (
    keys.ArrowRight &&
    player.x + player.width < gameArea.offsetWidth &&
    player.jumping === false
  ) {
    player.x += game.speed * game.moveMulti;
  }

  dog.style.left = player.x + "px";
  hunter.style.left = player.x + "px";
  hunter.style.top = player.y + "px";

  if (keys.KeyW) {
    if (scene.time - player.lastTimeFired > game.fireInterval) {
      hunter.classList.add("hunter-fire");
      renderBullet();
      player.lastTimeFired = scene.time;
    }
  } else {
    hunter.classList.remove("hunter-fire");
  }

  if (keys.KeyE) {
    if (scene.time - player.lastDogAtack > game.dogAtackInterval) {
      player.dogCoolDownPercent = 100;
      dog.classList.add("hidden");
      hunter.classList.add("hunter-dog-attack");
      renderDogAtack();
      player.lastDogAtack = scene.time;
    }
  } else {
    hunter.classList.remove("hunter-dog-attack");
  }
}

function renderBullet() {
  let bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.line = player.currentLine;
  bullet.style.top = player.y + player.height / 3 - 5 + "px";
  bullet.x = player.x + player.width;
  bullet.style.left = bullet.x + "px";
  gameArea.appendChild(bullet);
}

function moveBullets() {
  let bullets = document.querySelectorAll(".bullet");
  bullets.forEach((bullet) => {
    bullet.x += game.speed * game.bulletMulti;
    bullet.style.left = bullet.x + "px";
    if (bullet.x + bullet.offsetWidth > gameArea.offsetWidth) {
      bullet.parentElement.removeChild(bullet);
    }
  });
}

function renderDogAtack() {
  let frame = document.createElement("div");
  frame.classList.add("dog-attack");
  frame.style.top = player.y + "px";
  frame.x = player.x + player.width;
  frame.line = player.currentLine;
  frame.z = player.currentZIndex;
  frame.style.left = frame.x + "px";
  frame.style.zIndex = player.currentZIndex;
  gameArea.appendChild(frame);
}

function moveDogAtack(dog) {
  let frames = document.querySelectorAll(".dog-attack");
  frames.forEach((frame) => {
    frame.x += game.speed * game.dogJumpSpeed;
    frame.style.left = frame.x + "px";
    if (frame.x + frame.offsetWidth > player.x + 1500) {
      let landedDog = document.createElement("div");
      landedDog.classList.add("landed-dog");
      landedDog.style.zIndex = frame.z - 1;
      landedDog.style.top = player.y + 10 + "px";
      landedDog.style.left = player.x + 1500 + "px";
      frame.parentElement.appendChild(landedDog);
      frame.parentElement.removeChild(frame);
      setTimeout(() => {
        landedDog.style.zIndex = frame.z - 1;
        landedDog.style.transform = "rotateY(180deg)";
        landedDog.style.transition = "left 2s";
        landedDog.style.top =
          document
            .querySelector(`.grass-line-${frame.line}`)
            .getBoundingClientRect().bottom -
          200 +
          "px";
        landedDog.style.transition = "left 2s";
        landedDog.style.left = player.x + "px";
        setTimeout(() => {
          landedDog.parentElement.removeChild(landedDog);
          dog.classList.remove("hidden");
        }, 2000);
      }, 1000);
    }
  });
}

function addTrees() {
  const treesIndex = [
    "./images/tree1.png",
    "./images/tree2.png",
    "./images/tree3.png",
    "./images/tree4.png",
  ];
  if (
    scene.time - scene.lastTreeRender >
    game.treeRenderInterval + 20000 * Math.random()
  ) {
    let treeEl = document.createElement("div");
    treeEl.classList.add("tree");
    treeEl.style.backgroundImage = `url(${
      treesIndex[Math.floor(Math.random() * treesIndex.length)]
    })`;
    treeEl.x = gameArea.offsetWidth;
    treeEl.style.left = treeEl.x + "px";

    gameArea.appendChild(treeEl);
    scene.lastTreeRender = scene.time;
  }

  let trees = document.querySelectorAll(".tree");

  trees.forEach((tree) => {
    tree.style.top =
      document.querySelector(".grass-line-0").getBoundingClientRect().bottom -
      tree.clientHeight +
      "px";
    tree.x -= game.speed * 0.1;
    tree.style.left = tree.x + "px";
    if (tree.x + tree.offsetWidth <= 0) {
      tree.parentElement.removeChild(tree);
    }
  });
}

function addClouds() {
  const clouds = [
    "./images/cloud1.png",
    "./images/cloud2.png",
    "./images/cloud3.png",
    "./images/cloud4.png",
    "./images/cloud5.png",
    "./images/cloud6.png",
    "./images/cloud7.png",
    "./images/cloud8.png",
    "./images/cloud9.png",
  ];
  if (
    scene.time - scene.lastCloudRender >
    game.cloudRenderInterval + 50000 * Math.random()
  ) {
    let cloudEL = document.createElement("div");
    cloudEL.classList.add("cloud");
    cloudEL.style.backgroundImage = `url(${
      clouds[Math.floor(Math.random() * clouds.length)]
    })`;
    cloudEL.x = gameArea.offsetWidth;
    cloudEL.style.left = cloudEL.x + "px";
    cloudEL.style.top = randomFromInterval(1, 300) + "px";
    gameArea.appendChild(cloudEL);
    scene.lastCloudRender = scene.time;
  }

  let cls = document.querySelectorAll(".cloud");
  cls.forEach((cloud) => {
    cloud.x -= game.speed * 0.2;
    cloud.style.left = cloud.x + "px";
    if (cloud.x + cloud.offsetWidth <= 0) {
      cloud.parentElement.removeChild(cloud);
    }
  });
}

function randomFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderDogEnemie() {
  if (scene.time - scene.lastDogRender > game.dogRenderInterval) {
    let dog = document.createElement("div");
    dog.classList.add("dog-enemie");
    dog.x = gameArea.offsetWidth;
    dog.killBonus = 6;
    dog.line = randomFromInterval(1, 4);
    dog.style.left = dog.x + "px";
    dog.style.zIndex = dog.line + 1;
    gameArea.appendChild(dog);
    scene.lastDogRender = scene.time;
  }

  let dogs = document.querySelectorAll(".dog-enemie");
  dogs.forEach((dog) => {
    dog.style.top =
      document.querySelector(`.grass-line-${dog.line}`).getBoundingClientRect()
        .bottom -
      dog.clientHeight +
      "px";
    dog.x -= game.enemieSpeed * game.dogSpeed;
    if (
      dog.x - player.x < 700 &&
      dog.line === player.currentLine &&
      dog.x > player.x
    ) {
      dog.classList.add("dog-enemie-attack");
    }
    if (dog.classList.contains("dog-enemie-attack")) {
      dog.x -= game.speed * 6;
      dog.style.top =
        document
          .querySelector(`.grass-line-${dog.line}`)
          .getBoundingClientRect().bottom -
        dog.clientHeight / 1.5 +
        "px";
    }
    dog.style.left = dog.x + "px";
    if (dog.x + dog.offsetWidth <= 0) {
      dog.parentElement.removeChild(dog);
    }
  });
}

function renderWitch() {
  if (scene.time - scene.lastWitchRender > game.witchRenderInterval) {
    let witch = document.createElement("div");
    witch.classList.add("witch");
    witch.killBonus = 12;
    witch.health = game.witchHealth;
    witch.x = gameArea.offsetWidth;
    witch.line = randomFromInterval(1, 4);
    witch.style.left = witch.x + "px";
    witch.style.zIndex = witch.line + 1;
    gameArea.appendChild(witch);
    scene.lastWitchRender = scene.time;
  }
  let witches = document.querySelectorAll(".witch");
  witches.forEach((witch) => {
    witch.style.top =
      document
        .querySelector(`.grass-line-${witch.line}`)
        .getBoundingClientRect().bottom -
      witch.clientHeight +
      "px";
    witch.x -= game.enemieSpeed * game.witchSpeed;
    witch.style.left = witch.x + "px";
    if (witch.x + witch.offsetWidth <= 0) {
      witch.parentElement.removeChild(witch);
    }
  });
}

function renderArcher() {
  const line1 = document.querySelector(".grass-line-1");
  const line2 = document.querySelector(".grass-line-2");
  const line3 = document.querySelector(".grass-line-3");
  const line4 = document.querySelector(".grass-line-4");
  const lines = [line1, line2, line3, line4];
  let randomLine = randomFromInterval(0, 3);
  if (
    scene.time - game.archerRenderInterval > scene.lastArcherRender &&
    lines[randomLine].getAttribute("archer") === "0"
  ) {
    let archer = document.createElement("div");
    archer.classList.add("archer");
    archer.killBonus = 20;
    archer.health = game.archerHealth;
    archer.x = gameArea.offsetWidth;
    archer.attack = false;
    archer.line = Number(lines[randomLine].getAttribute("line"));
    lines[randomLine].setAttribute("archer", "1");
    archer.style.left = archer.x + "px";
    archer.style.zIndex = archer.line + 1;

    gameArea.appendChild(archer);
    scene.lastArcherRender = scene.time;
  }

  let archers = document.querySelectorAll(".archer");
  archers.forEach((archer) => {
    archer.style.top =
      document
        .querySelector(`.grass-line-${archer.line}`)
        .getBoundingClientRect().bottom -
      archer.clientHeight +
      "px";
    archer.x -= game.enemieSpeed;
    if (archer.x <= archer.parentElement.offsetWidth - archer.offsetWidth) {
      archer.x = archer.parentElement.offsetWidth - archer.offsetWidth;
      if (
        scene.time - game.archerSpearThrowInterval >
          scene.lastArcherSpearThrow &&
        archer.attack === false
      ) {
        archer.classList.add("archer-attack");
        archer.x -= 125;
        let spear = document.createElement("div");
        spear.classList.add("spear");
        spear.x = archer.x - archer.clientWidth;
        spear.style.left = spear.x + "px";
        spear.line = archer.line;
        spear.style.top =
          document
            .querySelector(`.grass-line-${spear.line}`)
            .getBoundingClientRect().bottom -
          archer.clientHeight +
          "px";
        spear.style.zIndex = spear.line + 1;
        gameArea.appendChild(spear);
        archer.attack = true;
        scene.lastArcherSpearThrow = scene.time;
      }

      if (
        scene.time - game.archerSpearThrowInterval >
          scene.lastArcherSpearThrow &&
        archer.attack === true
      ) {
        archer.classList.remove("archer-attack");
        archer.attack = false;
      }
    }

    archer.style.left = archer.x + "px";
  });

  let spears = document.querySelectorAll(".spear");
  spears.forEach((spear) => {
    spear.x -= game.enemieSpeed * game.bulletMulti;
    spear.style.left = spear.x + "px";
    if (spear.x + spear.offsetWidth > gameArea.offsetWidth) {
      spear.parentElement.removeChild(spear);
    }
  });
}

function renderSwine() {
  if (scene.time - scene.lastSwineRender > game.swineRenderInterval) {
    let swine = document.createElement("div");
    swine.classList.add("swine");
    swine.x = gameArea.offsetWidth;
    swine.killBonus = 40;
    swine.health = game.swineHealth;
    swine.attacked = false;
    swine.attackPostion = 0;
    swine.line = randomFromInterval(1, 4);
    swine.style.left = swine.x + "px";
    swine.style.zIndex = swine.line + 1;

    gameArea.appendChild(swine);
    scene.lastSwineRender = scene.time;
  }
  let swines = document.querySelectorAll(".swine");
  swines.forEach((swine) => {
    swine.style.top =
      document
        .querySelector(`.grass-line-${swine.line}`)
        .getBoundingClientRect().bottom -
      swine.clientHeight +
      "px";
    swine.x -= game.enemieSpeed * game.swineSpeed;
    if (
      swine.x - player.x < 325 &&
      swine.line === player.currentLine &&
      swine.x > player.x &&
      swine.attacked === false
    ) {
      swine.attackPostion = swine.x;
      swine.x -= 325;
      swine.classList.add("swine-attack");
      swine.attacked = true;
    } else if (
      (swine.x - player.x >= 325 ||
        swine.line !== player.currentLine ||
        swine.x < player.x) &&
      swine.attacked === true
    ) {
      setTimeout(function () {
        swine.x = swine.attackPostion;
        swine.classList.remove("swine-attack");
        swine.attacked = false;
      }, 500);
    }

    swine.style.left = swine.x + "px";
    if (swine.x + swine.offsetWidth <= 0) {
      swine.parentElement.removeChild(swine);
    }
  });
}

function renderCentaur() {
  if (scene.time - scene.lastCentaurRender > game.centaurRenderInterval) {
    let centaur = document.createElement("div");
    centaur.classList.add("centaur");
    centaur.x = gameArea.offsetWidth;
    centaur.health = game.centaurHealth;
    centaur.killBonus = 100;
    centaur.charge = false;
    centaur.line = randomFromInterval(1, 4);
    centaur.style.left = centaur.x + "px";
    centaur.style.zIndex = centaur.line + 1;
    gameArea.appendChild(centaur);
    scene.lastCentaurRender = scene.time;
  }
  let centaurs = document.querySelectorAll(".centaur");
  centaurs.forEach((centaur) => {
    centaur.style.top =
      document
        .querySelector(`.grass-line-${centaur.line}`)
        .getBoundingClientRect().bottom -
      centaur.clientHeight +
      "px";
    centaur.x -= game.enemieSpeed * game.centSpeed;
    if (centaur.x <= centaur.parentElement.offsetWidth - centaur.offsetWidth) {
      centaur.charge = true;
      centaur.style.top =
        document
          .querySelector(`.grass-line-${centaur.line}`)
          .getBoundingClientRect().bottom -
        centaur.clientHeight +
        50 +
        "px";
      centaur.classList.add("centaur-charge");

      centaur.x -= game.bulletMulti;
    }
    centaur.style.left = centaur.x + "px";
    if (centaur.x + centaur.offsetWidth <= 0) {
      centaur.parentElement.removeChild(centaur);
    }
  });
}

function collision(el1, el2) {
  let firstEl = el1.getBoundingClientRect();
  let secondEl = el2.getBoundingClientRect();
  return !(
    firstEl.top > secondEl.bottom ||
    firstEl.bottom < secondEl.top ||
    firstEl.right < secondEl.left ||
    firstEl.left > secondEl.right
  );
}

function collisionDetector(hunter) {
  let dogs = document.querySelectorAll(".dog-enemie");
  let witches = document.querySelectorAll(".witch");
  let bullets = document.querySelectorAll(".bullet");
  let swines = document.querySelectorAll(".swine");
  let dogAttackFrame = document.querySelectorAll(".dog-attack");
  let spears = document.querySelectorAll(".spear");
  let archers = document.querySelectorAll(".archer");
  let centaurs = document.querySelectorAll(".centaur");
  let fireballs = document.querySelectorAll(".fire-ball");
  let thunderBolts = document.querySelectorAll(".thunderbolt");
  let hag = document.querySelectorAll(".hag");
  applyCollisions(dogs);
  applyCollisions(witches);
  applyCollisions(swines);
  applyCollisions(archers);
  applyCollisions(spears);
  applyCollisions(centaurs);
  applyCollisions(fireballs);
  applyCollisions(thunderBolts);
  applyCollisions(hag);

  function applyCollisions(enemies) {
    enemies.forEach((enemie) => {
      if (collision(hunter, enemie) && player.currentLine === enemie.line) {
        hunter.classList.add("player-hit");
        if (player.hit === false) {
          player.currentHealthBar -= 20;
          helthBar.style.width = `${player.currentHealthBar}%`;
          if (player.currentHealthBar === 80) {
            helthBar.style.backgroundColor = "green";
          }
          if (player.currentHealthBar === 60) {
            helthBar.style.backgroundColor = "yellow";
          }

          if (player.currentHealthBar === 40) {
            helthBar.style.backgroundColor = "orange";
          }
          if (player.currentHealthBar === 20) {
            helthBar.style.backgroundColor = "red";
          }
          player.hit = true;
          setTimeout(function () {
            hunter.classList.remove("player-hit");
            player.hit = false;
          }, 1000);
        }
        if (player.currentHealthBar === 0 && scene.activeGame === true) {
          gameEnd();
        }
      }
      bullets.forEach((bullet) => {
        if (collision(bullet, enemie) && bullet.line === enemie.line) {
          let impact = document.createElement("div");
          impact.classList.add("bullet-impact");
          impact.style.left =
            enemie.offsetLeft + randomFromInterval(100, 200) + "px";
          impact.style.top =
            document
              .querySelector(`.grass-line-${enemie.line}`)
              .getBoundingClientRect().bottom -
            randomFromInterval(20, 200) +
            "px";
          enemie.parentElement.appendChild(impact);

          setTimeout(() => {
            impact.parentElement.removeChild(impact);
          }, 200);
          if (enemie.classList.contains("swine")) {
            enemie.health--;
            if (enemie.health <= 0) {
              scene.score += enemie.killBonus;
              createCorpse(enemie);
              enemie.parentElement.removeChild(enemie);
              bullet.parentElement.removeChild(bullet);
            } else {
              enemie.classList.add("swine-hit");
              bullet.parentElement.removeChild(bullet);
              setInterval(function () {
                enemie.classList.remove("swine-hit");
              }, 300);
            }
          } else if (enemie.classList.contains("spear")) {
            createCorpse(enemie);
            enemie.parentElement.removeChild(enemie);
            bullet.parentElement.removeChild(bullet);
          } else if (enemie.classList.contains("archer")) {
            enemie.health--;
            if (enemie.health <= 0) {
              scene.score += enemie.killBonus;
              createCorpse(enemie);
              document
                .querySelector(`.grass-line-${enemie.line}`)
                .setAttribute("archer", "0");
              enemie.parentElement.removeChild(enemie);
              bullet.parentElement.removeChild(bullet);
            } else {
              bullet.parentElement.removeChild(bullet);
            }
          } else if (enemie.classList.contains("centaur")) {
            enemie.health--;
            if (enemie.health <= 0) {
              scene.score += enemie.killBonus;
              createCorpse(enemie);
              enemie.parentElement.removeChild(enemie);
              bullet.parentElement.removeChild(bullet);
            } else {
              if (enemie.charge === false) {
                enemie.classList.add("centaur-hit");
              }
              bullet.parentElement.removeChild(bullet);
              setInterval(function () {
                enemie.classList.remove("centaur-hit");
              }, 500);
            }
          } else if (enemie.classList.contains("hag")) {
            boss.currentHealthBar -= 1;

            helthBarHag.style.width = boss.currentHealthBar + "%";

            if (boss.currentHealthBar <= 0) {
              createCorpse(enemie);
              enemie.parentElement.removeChild(enemie);
              bullet.parentElement.removeChild(bullet);
              player.won = true;
              gameEnd();
            } else {
              bullet.parentElement.removeChild(bullet);
            }
          } else if (enemie.classList.contains("witch")) {
            enemie.health--;
            if (enemie.health <= 0) {
              createCorpse(enemie);
              scene.score += enemie.killBonus;
              enemie.parentElement.removeChild(enemie);
              bullet.parentElement.removeChild(bullet);
            } else {
              bullet.parentElement.removeChild(bullet);
            }
          } else if (
            !enemie.classList.contains("fire-ball") &&
            !enemie.classList.contains("thunderbolt")
          ) {
            createCorpse(enemie);
            scene.score += enemie.killBonus;
            enemie.parentElement.removeChild(enemie);
            bullet.parentElement.removeChild(bullet);
          }
        }
      });
      dogAttackFrame.forEach((frame) => {
        if (collision(frame, enemie) && frame.line === enemie.line) {
          if (
            enemie.classList.contains("dog-enemie") ||
            enemie.classList.contains("witch") ||
            enemie.classList.contains("swine") ||
            enemie.classList.contains("centaur") ||
            enemie.classList.contains("archer")
          ) {
            scene.score += enemie.killBonus;
            createCorpse(enemie);
            enemie.parentElement.removeChild(enemie);
          }

          if (enemie.classList.contains("hag") && boss.dogBite === false) {
            boss.currentHealthBar -= 5;

            if (boss.currentHealthBar <= 0) {
              createCorpse(enemie);
              enemie.parentElement.removeChild(enemie);
              player.won = true;
              gameEnd();
            } else {
              helthBarHag.style.width = boss.currentHealthBar + "%";
              boss.dogBite = true;
              setTimeout(function () {
                boss.dogBite = false;
              }, 1000);
            }
          }
        }
      });
    });
  }
}

function createCorpse(enemie) {
  let corpse = document.createElement("div");
  corpse.classList.add("dead");
  if (enemie.classList.contains("swine")) {
    corpse.classList.add("deadSwine");
  }
  if (enemie.classList.contains("spear")) {
    corpse.classList.add("spear-broken");
  }
  if (enemie.classList.contains("centaur")) {
    corpse.classList.add("deadCentaur");
  }

  corpse.style.left = enemie.offsetLeft + "px";
  corpse.style.top =
    document.querySelector(`.grass-line-${enemie.line}`).getBoundingClientRect()
      .bottom -
    100 +
    "px";
  corpse.style.zIndex = enemie.line + 2;
  enemie.parentElement.appendChild(corpse);
  setTimeout(() => {
    corpse.parentElement.removeChild(corpse);
  }, 2000);
}

function bossFight(hag) {
  if (!hag) return;
  if (
    scene.time - boss.hagLastMove > boss.hagMoveInterval &&
    boss.fireBallCast === true
  ) {
    hag.line = player.currentLine;
    hag.y =
      document.querySelector(`.grass-line-${hag.line}`).getBoundingClientRect()
        .bottom - 400;
    hag.style.top = hag.y + "px";

    hag.style.zIndex = hag.line + 1;

    boss.hagLastMove = scene.time;
  }
  if (
    hag.x - player.x < 300 &&
    hag.line === player.currentLine &&
    boss.fireBallCast === true
  ) {
    boss.fireBallCast = false;
    hagMelle(hag);
  }
  if (boss.fireBallCast === true) {
    renderFireball(hag);
    moveFireballs();
  }
  if (boss.currentHealthBar <= 50) {
    thunderBolt();
    removeThunder();
  }
}

function hagMelle(hag) {
  boss.fireBallCast = false;
  hag.mellePosition = hag.x;
  hag.x -= 200;
  hag.classList.add("hag-melle");
  hag.style.left = hag.x + "px";
  setTimeout(function () {
    hag.classList.remove("hag-melle");
    hag.style.left = hag.mellePosition + "px";
    hag.x += 200;
    boss.fireBallCast = true;
  }, 1000);
}
function thunderBolt() {
  if (scene.time - boss.lastThunder > boss.thunderInterval) {
    let strikePosition = player.x;
    let strikeHeight = gameArea.offsetHeight - player.y - 220;

    let indicator = document.createElement("div");
    indicator.classList.add("indicator");
    indicator.lane = player.currentLine;
    let futureLane = indicator.lane;
    indicator.style.bottom = strikeHeight + "px";
    indicator.style.left = strikePosition + "px";
    gameArea.appendChild(indicator);

    setTimeout(function () {
      let bolt = document.createElement("div");
      bolt.classList.add("thunderbolt");
      bolt.x = strikePosition;
      bolt.line = futureLane;
      bolt.style.bottom = strikeHeight + "px";
      bolt.style.left = bolt.x + "px";
      bolt.style.zIndex = indicator.lane + 1;
      gameArea.appendChild(bolt);
      gameArea.removeChild(indicator);
    }, 1000);
    boss.lastThunder = scene.time;
  }
}

function removeThunder() {
  let thunders = document.querySelectorAll(".thunderbolt");

  if (scene.time - boss.lastRemove > boss.removeInterval) {
    thunders.forEach((thunder) => {
      thunder.parentElement.removeChild(thunder);
    });
    boss.lastRemove = scene.time;
  }
}

function renderFireball(hag) {
  if (scene.time - boss.hagLastFireBall > boss.hagFireBallInterval) {
    let fireball = document.createElement("div");
    fireball.classList.add("fire-ball");
    fireball.line = hag.line;
    fireball.style.top = hag.y + hag.clientHeight / 3 + "px";
    fireball.x = hag.x - hag.clientWidth;
    fireball.style.zIndex = hag.line + 1;
    fireball.style.left = fireball.x + "px";
    hag.classList.add("hag-fireball");
    gameArea.appendChild(fireball);
    boss.hagLastFireBall = scene.time;
    setInterval(() => {
      hag.classList.remove("hag-fireball");
    }, 500);
  }
}

function moveFireballs() {
  let fireballs = document.querySelectorAll(".fire-ball");
  fireballs.forEach((fireball) => {
    fireball.x -= game.enemieSpeed * game.bulletMulti;
    fireball.style.left = fireball.x + "px";
    if (fireball.x + fireball.offsetWidth <= 0) {
      fireball.parentElement.removeChild(fireball);
    }
  });
}

function removeAllElements() {
  ["dog-enemie", "spear", "witch", "archer", "swine", "centaur"].forEach(
    (el) => {
      remove(el);
    }
  );

  function remove(string) {
    let arr = document.querySelectorAll(`.${string}`);
    arr.forEach((el) => el.parentElement.removeChild(el));
  }
}

function dogCoolDown() {
  if (player.dogCoolDownPercent > 0) {
    player.dogCoolDownPercent -= 1 * 0.04;
  }
  coolDownBackground.style.width = player.dogCoolDownPercent + "%";
}

function gameEnd() {
  scene.activeGame = false;
  gameOver.classList.remove("hidden");
  gameArea.classList.add("hidden");
  healthBorder.classList.add("hidden");
  helthBarHag.classList.add("hidden");
  let img = document.createElement("img");
  if (player.won) {
    img.src = "./images/Blunderbuss-removebg-preview.png";
    gameOver.querySelector(".text").textContent = "Winner!";
  } else {
    img.src = "./images/Hunter_Dead.webp";
    gameOver.querySelector(".text").textContent = "Lost!";
  }
  gameOver.appendChild(img);
  endScore.textContent = scene.score;
}

function startNewGame() {
  window.location = "./index.html";
}
