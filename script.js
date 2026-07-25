const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Element UI
const playerScoreEl = document.getElementById('playerScore');
const botScoreEl = document.getElementById('botScore');
const tensionIndicator = document.getElementById('tensionIndicator');
const targetZone = document.getElementById('targetZone');
const pullBtn = document.getElementById('pullBtn');
const statusMsg = document.getElementById('statusMessage');

// Game State
let playerScore = 0;
let botScore = 0;

// Player Mechanic Variables
let tension = 0; // 0 - 100
let isPulling = false;
let targetPos = 40; // Persentase posisi area hijau
let catchProgress = 0; // Progress menangkap ikan (0 - 100)

// Bot Mechanics
let botCatchProgress = 0;
let botSpeed = 0.25; // Kecepatan memancing bot

// Fish Types & Points
const fishTypes = [
    { name: 'Ikan Kecil', score: 10, color: '#f39c12', speed: 0.8 },
    { name: 'Ikan Sedang', score: 25, color: '#e67e22', speed: 1.2 },
    { name: 'Ikan Langka', score: 50, color: '#9b59b6', speed: 1.8 }
];

let currentFish = fishTypes[0];

// Input Control Event
window.addEventListener('keydown', (e) => { if (e.code === 'Space') isPulling = true; });
window.addEventListener('keyup', (e) => { if (e.code === 'Space') isPulling = false; });
pullBtn.addEventListener('mousedown', () => isPulling = true);
pullBtn.addEventListener('mouseup', () => isPulling = false);
pullBtn.addEventListener('touchstart', () => isPulling = true);
pullBtn.addEventListener('touchend', () => isPulling = false);

function resetRound() {
    tension = 10;
    catchProgress = 0;
    botCatchProgress = 0;
    // Pilih ikan acak
    currentFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    targetPos = Math.floor(Math.random() * 60) + 10; 
    targetZone.style.left = targetPos + '%';
    statusMsg.innerText = `Ikan bertarung! Menangkap: ${currentFish.name} (+${currentFish.score} Poin)`;
}

// Bot AI Engine
function updateBot() {
    // Bot bergerak progresif secara acak mensimulasikan bertarung dengan ikan
    if (Math.random() > 0.3) {
        botCatchProgress += botSpeed;
    }
    if (botCatchProgress >= 100) {
        botScore += currentFish.score;
        botScoreEl.innerText = botScore;
        statusMsg.innerText = `🤖 Bot berhasil menangkap ${currentFish.name} duluan!`;
        resetRound();
    }
}

// Main Game Loop
function updateGame() {
    // 1. Update Player Mechanic
    if (isPulling) {
        tension += 1.5;
    } else {
        tension -= 1.2;
    }

    // Clamp tension
    if (tension < 0) tension = 0;
    if (tension > 100) tension = 100;

    // Gerakkan zona target secara acak untuk efek 'ikan memberontak'
    targetPos += (Math.random() - 0.5) * currentFish.speed;
    if (targetPos < 5) targetPos = 5;
    if (targetPos > 70) targetPos = 70;
    targetZone.style.left = targetPos + '%';

    // Cek apakah tension di dalam Target Zone
    if (tension >= targetPos && tension <= (targetPos + 25)) {
        catchProgress += 0.4;
    } else {
        catchProgress -= 0.2;
    }

    if (catchProgress < 0) catchProgress = 0;

    // Update Tampilan Bar Tension
    tensionIndicator.style.left = tension + '%';

    // Player Menang Rencana Ini
    if (catchProgress >= 100) {
        playerScore += currentFish.score;
        playerScoreEl.innerText = playerScore;
        statusMsg.innerText = `🎉 Kamu berhasil menangkap ${currentFish.name}! (+${currentFish.score} Poin)`;
        resetRound();
    }

    // 2. Update Bot
    updateBot();

    // 3. Render Visual Canvas
    renderCanvas();

    requestAnimationFrame(updateGame);
}

function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- DRAWS AIR & PEMANDANGAN ---
    // Nelayan Player
    ctx.fillStyle = '#00f2fe';
    ctx.fillRect(80, 110, 20, 30); // Badan
    ctx.beginPath();
    ctx.arc(90, 100, 10, 0, Math.PI * 2); // Kepala
    ctx.fill();

    // Kapal Player
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(50, 140, 80, 15);

    // Senar Pancing Player
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 100);
    ctx.lineTo(180, 220 + Math.sin(Date.now() / 200) * 5);
    ctx.stroke();

    // --- DRAWS BOT (KOMPUTER) ---
    // Nelayan Bot
    ctx.fillStyle = '#ff0844';
    ctx.fillRect(480, 110, 20, 30);
    ctx.beginPath();
    ctx.arc(490, 100, 10, 0, Math.PI * 2);
    ctx.fill();

    // Kapal Bot
    ctx.fillStyle = '#d35400';
    ctx.fillRect(450, 140, 80, 15);

    // Senar Pancing Bot
    ctx.strokeStyle = '#ffbb00';
    ctx.beginPath();
    ctx.moveTo(490, 100);
    ctx.lineTo(400, 220 + Math.cos(Date.now() / 200) * 5);
    ctx.stroke();

    // --- BAR PROGRESS MENANGKAP ---
    // Progress Player (Kiri)
    ctx.fillStyle = '#222';
    ctx.fillRect(30, 20, 150, 15);
    ctx.fillStyle = '#00f2fe';
    ctx.fillRect(30, 20, (catchProgress / 100) * 150, 15);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(30, 20, 150, 15);

    // Progress Bot (Kanan)
    ctx.fillStyle = '#222';
    ctx.fillRect(420, 20, 150, 15);
    ctx.fillStyle = '#ff0844';
    ctx.fillRect(420, 20, (botCatchProgress / 100) * 150, 15);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(420, 20, 150, 15);
}

// Mulai Game
resetRound();
updateGame();
