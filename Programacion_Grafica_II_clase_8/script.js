const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImage = new Image();
playerImage.src = 'images/avion.png';

const meteorImage = new Image();
meteorImage.src = 'images/Meteorito.png';

const backgroundImage = new Image();
backgroundImage.src = 'images/galaxia.png';

let player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 80,
    width: 60,
    height: 60,
    speed: 3,
};

let meteors = [];
let score = 0;
let level = 1;
let meteorInterval = 2000;
let gameLoopInterval;
let isGamePaused = false;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

function spawnMeteor() {
    const size = Math.random() * 40 + 30;
    const x = Math.random() * (canvas.width - size);
    meteors.push({
        x: x,
        y: -size,
        size: size,
        speed: 3
    });
}

function startGame() {
    if (isGamePaused) {
        isGamePaused = false;
        gameLoop();
        return;
    }

    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'inline';
    resetGame();
    gameLoop();
}

function pauseGame() {
    isGamePaused = true;
    clearInterval(gameLoopInterval);
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('startBtn').style.display = 'inline';
}

function resetGame() {
    player = { x: canvas.width / 2 - 30, y: canvas.height - 80, width: 60, height: 60, speed: 3 };
    meteors = [];
    score = 0;
    level = 1;
    meteorInterval = 2000;
    isGamePaused = false;
    document.getElementById('scoreText').innerHTML = "Puntuación: " + score;
    setInterval(spawnMeteor, meteorInterval);
}

document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

function update() {
    if (keys.ArrowUp) player.y -= player.speed;
    if (keys.ArrowDown) player.y += player.speed;
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    meteors.forEach((meteor, index) => {
        meteor.y += meteor.speed;
        if (meteor.y > canvas.height) meteors.splice(index, 1);

        if (player.x < meteor.x + meteor.size &&
            player.x + player.width > meteor.x &&
            player.y < meteor.y + meteor.size &&
            player.y + player.height > meteor.y) {
            alert("¡Juego Terminado! Tu puntuación fue: " + score);
            resetGame();
        }
    });

    score += 1;
    document.getElementById('scoreText').innerHTML = "Puntuación: " + score;
}

function draw() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    meteors.forEach(meteor => {
        ctx.drawImage(meteorImage, meteor.x, meteor.y, meteor.size, meteor.size);
    });

    ctx.font = "36px Arial";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("Puntuación: " + score, canvas.width / 2, 30);
    ctx.fillText("Puntuación: " + score, canvas.width / 2, 30);

    ctx.font = "24px Arial";
    ctx.strokeText("Nivel: " + level, canvas.width / 2, 60);
    ctx.fillText("Nivel: " + level, canvas.width / 2, 60);
}

function gameLoop() {
    if (isGamePaused) return;
    update();
    draw();
    gameLoopInterval = requestAnimationFrame(gameLoop);
}

setInterval(spawnMeteor, meteorInterval);