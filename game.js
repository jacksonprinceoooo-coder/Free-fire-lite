// ===== LOGIN SYSTEM =====
const loginScreen = document.getElementById("loginScreen");
const gameArea = document.getElementById("gameArea");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMsg = document.getElementById("loginMsg");

loginBtn.addEventListener("click", ()=>{
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if(username === "" || password === ""){
    loginMsg.innerText = "Please enter username and password!";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if(users[username]){
    if(users[username] === password){
      loginMsg.innerText = "Login successful!";
      setTimeout(startGame, 500);
    } else {
      loginMsg.innerText = "Incorrect password!";
    }
  } else {
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    loginMsg.innerText = "New user registered!";
    setTimeout(startGame, 500);
  }
});

function startGame(){
  loginScreen.style.display = "none";
  gameArea.style.display = "block";
  initGame();
}

// ===== GAME LOGIC =====
function initGame(){
  const player = document.getElementById("player");
  const healthBar = document.getElementById("healthBar");
  const scoreDisplay = document.getElementById("score");
  const gunDisplay = document.getElementById("gun");
  const ammoDisplay = document.getElementById("ammo");
  const gameOverText = document.getElementById("gameOver");
  const safeZone = document.getElementById("safeZone");

  const shootSound = document.getElementById("shootSound");
  const hitSound = document.getElementById("hitSound");
  const lootSound = document.getElementById("lootSound");
  const healSound = document.getElementById("healSound");

  // Player
  let playerX = window.innerWidth/2;
  let playerY = window.innerHeight/2;
  let speed = 12;
  let health = 100;
  let score = 0;
  let keys = {};

  // Guns
  let guns = {
    Pistol:{damage:10, ammo:10, reload:10},
    Rifle:{damage:20, ammo:30, reload:30},
    Sniper:{damage:50, ammo:5, reload:5},
    Shotgun:{damage:30, ammo:8, reload:8},
    SMG:{damage:15, ammo:25, reload:25}
  };
  let currentGun = "Pistol";
  let ammo = guns[currentGun].ammo;

  let bullets=[], enemies=[], lootCrates=[], healthKits=[];

  document.addEventListener("keydown", e=>{
    keys[e.key.toLowerCase()]=true;
    if(e.key==="1") switchGun("Pistol");
    if(e.key==="2") switchGun("Rifle");
    if(e.key==="3") switchGun("Sniper");
    if(e.key==="4") switchGun("Shotgun");
    if(e.key==="5") switchGun("SMG");
    if(e.key.toLowerCase()==="r") reloadGun();
  });
  document.addEventListener("keyup", e=>keys[e.key.toLowerCase()]=false);
  document.addEventListener("keydown", e=>{ if(e.code==="Space") shootBullet(); });

  function movePlayer(){
    if(keys["w"] && playerY>0) playerY-=speed;
    if(keys["s"] && playerY<window.innerHeight-40) playerY+=speed;
    if(keys["a"] && playerX>0) playerX-=speed;
    if(keys["d"] && playerX<window.innerWidth-40) playerX+=speed;
    player.style.left = playerX+"px";
    player.style.top = playerY+"px";
  }

  function shootBullet(){
    if(ammo<=0){ ammoDisplay.innerText="Reload!"; return; }
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left=playerX+16+"px";
    bullet.style.top=playerY+"px";
    gameArea.appendChild(bullet);
    bullets.push({el:bullet, top:playerY, left:playerX+16});
    ammo--;
    ammoDisplay.innerText=ammo;
    shootSound.play();
  }

  function switchGun(name){ currentGun=name; ammo=guns[name].ammo; gunDisplay.innerText=name; ammoDisplay.innerText=ammo; }
  function reloadGun(){ ammo=guns[currentGun].reload; ammoDisplay.innerText=ammo; }

  function updateHealthBar(){ healthBar.style.width = health+"%"; }

  let zoneSize=800;
  function shrinkZone(){ zoneSize-=100; if(zoneSize<200)return; safeZone.style.width=zoneSize+"px"; safeZone.style.height=zoneSize+"px"; }
  setInterval(shrinkZone,20000);

  function endGame(){ gameOverText.style.display="block"; }

  function gameLoop(){
    movePlayer();
    updateHealthBar();
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}
