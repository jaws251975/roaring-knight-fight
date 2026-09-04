const battleBox = document.getElementById("battle-box");
const soul = document.getElementById("soul");
const swordContainer = document.getElementById("sword-container");

let soulX = 180;
let soulY = 130;

const soulSpeed = 4;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false
};

document.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    event.preventDefault();
  }
});

function updateSoul() {
  let dx = 0;
  let dy = 0;

  if (keys.ArrowLeft || keys.a) dx -= soulSpeed;
  if (keys.ArrowRight || keys.d) dx += soulSpeed;
  if (keys.ArrowUp || keys.w) dy -= soulSpeed;
  if (keys.ArrowDown || keys.s) dy += soulSpeed;

  soulX += dx;
  soulY += dy;

  const boxWidth = battleBox.clientWidth;
  const boxHeight = battleBox.clientHeight;

  const soulWidth = soul.offsetWidth;
  const soulHeight = soul.offsetHeight;

  soulX = Math.max(
    soulWidth / 2,
    Math.min(boxWidth - soulWidth / 2, soulX)
  );

  soulY = Math.max(
    soulHeight / 2,
    Math.min(boxHeight - soulHeight / 2, soulY)
  );

  soul.style.left = soulX + "px";
  soul.style.top = soulY + "px";

  requestAnimationFrame(updateSoul);
}

updateSoul();


// -----------------------------------------
// KNIGHT SWORD ATTACK
// -----------------------------------------

function spawnSword(x, y, angle = 0, speed = 7) {
  const sword = document.createElement("img");

  sword.src = "assets/knight-sword.png";
  sword.className = "sword";

  sword.style.left = x + "px";
  sword.style.top = y + "px";
  sword.style.transform = `rotate(${angle}deg)`;

  swordContainer.appendChild(sword);

  let posX = x;
  let posY = y;

  const radians = angle * Math.PI / 180;

  const velocityX = Math.cos(radians) * speed;
  const velocityY = Math.sin(radians) * speed;

  function moveSword() {
    posX += velocityX;
    posY += velocityY;

    sword.style.left = posX + "px";
    sword.style.top = posY + "px";

    checkSwordCollision(sword);

    if (
      posX < -300 ||
      posX > window.innerWidth + 300 ||
      posY < -300 ||
      posY > window.innerHeight + 300
    ) {
      sword.remove();
      return;
    }

    requestAnimationFrame(moveSword);
  }

  moveSword();
}


// -----------------------------------------
// COLLISION
// -----------------------------------------

function checkSwordCollision(sword) {
  const soulRect = soul.getBoundingClientRect();
  const swordRect = sword.getBoundingClientRect();

  const hit =
    soulRect.left < swordRect.right &&
    soulRect.right > swordRect.left &&
    soulRect.top < swordRect.bottom &&
    soulRect.bottom > swordRect.top;

  if (hit) {
    // Flash the soul when hit
    soul.style.background = "white";

    setTimeout(() => {
      soul.style.background = "red";
    }, 100);

    console.log("SOUL HIT!");
  }
}


// -----------------------------------------
// EXAMPLE KNIGHT ATTACK
// -----------------------------------------

function knightAttack() {
  const rect = battleBox.getBoundingClientRect();

  // Swords come from the right side
  spawnSword(
    rect.right + 50,
    rect.top + Math.random() * rect.height,
    180,
    8
  );
}


// Test attack every 2 seconds
setInterval(() => {
  knightAttack();
}, 2000);