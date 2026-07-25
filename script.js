const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const playerScoreEl = document.getElementById('playerScore');
const botScoreEl = document.getElementById('botScore');
const tensionIndicator = document.getElementById('tensionIndicator');
const tensionVal = document.getElementById('tensionVal');
const targetZone = document.getElementById('targetZone');
const pullBtn = document.getElementById('pullBtn');
const statusMsg = document.getElementById('statusMessage');
const fishAlert = document.getElementById('fishAlert');

// Game Engine States
let playerScore = 0;
let botScore = 0;
let tension = 0;
let isPulling = false;
let targetPos = 35;
let catchProgress = 0;
let botCatchProgress = 0;

// Cyber Fish Varieties
const cyberFishes = [
    { name: 'NEON GUPPY', score: 50, color: '#00f0ff', speed: 0.6 },
    { name: 'CYBER AROWANA', score: 150, color: '#ff0055', speed: 1.2 },
    { name: 'MECHA SHARK', score: 300, color: '#ffe600', speed: 1.9 }
];
let currentFish = cyberFishes[0];

// Water Wave Animation Particles
let waveOffset = 0;

// Key & Mouse Listeners
window.addEventListener('keydown', (e) => { if (e.code === 'Space') isPulling = true; });
window.addEventListener('keyup', (e) => { if (e.code === 'Space') isPulling = false; });
pullBtn.addEventListener('mousedown', () => isPulling = true);
pullBtn.addEventListener('mouseup', () => isPulling = false);
pullBtn.addEventListener('touchstart', (e) => { e.preventDefault(); isPulling = true; });
pullBtn.addEventListener('touchend', () => isPulling = false);

function resetRound() {
    tension = 0;
    catchProgress = 0;
    botCatchProgress = 0;
    currentFish = cyberFishes[Math.floor(Math.random() * cyberFishes.length)];
    targetPos = Math.floor(Math.random() * 55) + 10;
    targetZone.style.left = targetPos + '%';

    // Show Alert Text
    fishAlert.innerText = `TARGET: ${currentFish.name}!`;
    fishAlert.style.color = currentFish.color;
    fishAlert.classList.add('active');
    setTimeout(() => fishAlert.classList.remove('active'), 1200);

    statusMsg.innerText = `SYSTEM: Menjaring ${currentFish.name} [+${currentFish.score} PTS]`;
}

// Bot AI Behavior
function updateBot() {
    // Bot menarik pancingan berdasarkan kalkulasi variabel acak cerdas
    if (Math.random() < 0.65) {
        botCatchProgress += 0.22;
    }

    if (botCatchProgress >= 100) {
        botScore += currentFish.score;
        botScoreEl.innerText = String(botScore).padStart(4, '0');
        statusMsg.innerText = `⚠️ SYSTEM ALERT: Cyborg-X berhasil mencuri ${currentFish.name}!`;
        resetRound();
    }
}

function updateGame() {
    // 1. Tension Physics
    if (isPulling) {
        tension += 1.8;
    } else {
        tension -= 1.4;
    }

    tension = Math.max(0, Math.min(100, tension));

    // Target Movement (Ikan memberontak)
    targetPos += (Math.random() - 0.5) * currentFish.speed * 2;
    targetPos = Math.max(5, Math.min(70, targetPos));
    targetZone.style.left = targetPos + '%';

    // Tension check
    if (tension >= targetPos && tension <= (targetPos + 25)) {
        catchProgress += 0.45;
    } else {
        catchProgress -= 0.25;
    }
    catchProgress = Math.max(0, catchProgress);

    // Update UI Indicators
    tensionIndicator.style.left = `calc(${tension}% - 6px)`;
    tensionVal.innerText = `${Math.floor(tension)}%`;

    // Victory Check (Player)
    if (catchProgress >= 100) {
        playerScore += currentFish.score;
        playerScoreEl.innerText = String(playerScore).padStart(4, '0');
        statusMsg.innerText = `🎉 SUCCESS: Kamu berhasil menangkap ${currentFish.name}!`;
        resetRound();
    }

    updateBot();
    renderCanvas();
    requestAnimationFrame(updateGame);
}

function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- DRAW ENVIRONMENT ---
    // Sky gradient
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(0.6, '#180e29');
    grad.addColorStop(1, '#021024');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Water Surface Wave Animation
    waveOffset += 0.05;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, 180);
    for (let x = 0; x <= canvas.width; x += 20) {
        ctx.lineTo(x, 180 + Math.sin(x * 0.02 + waveOffset) * 5);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();

    // --- DRAW CHARACTERS ---
    // Player 1 Rod & Line (Left Side)
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 180);
    ctx.lineTo(160, 100); // Joran Player
    ctx.stroke();

    // Senar Player ke Laut
    ctx.strokeStyle = '#rgba(0,240,255,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(160, 100);
    ctx.lineTo(240, 220 + Math.sin(waveOffset * 2) * 8);
    ctx.stroke();

    // Bot Cyborg Rod & Line (Right Side)
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(570, 180);
    ctx.lineTo(490, 100); // Joran Bot
    ctx.stroke();

    // Senar Bot ke Laut
    ctx.strokeStyle = 'rgba(255,0,85,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(490, 100);
    ctx.lineTo(410, 220 + Math.cos(waveOffset * 2) * 8);
    ctx.stroke();

    // --- DRAW CYBER FISH IN WATER ---
    ctx.fillStyle = currentFish.color;
    ctx.shadowColor = currentFish.color;
    ctx.shadowBlur = 10;
    
    // Position of fish based on progress
    let fishX = 240 + (catchProgress / 100) * -60 + (botCatchProgress / 100) * 60;
    let fishY = 220 + Math.sin(waveOffset * 3) * 6;

    ctx.beginPath();
    ctx.ellipse(fishX, fishY, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset Shadow

    // --- HUD PROGRESS BARS IN CANVAS ---
    // Player Progress Bar (Left)
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(20, 20, 180, 10);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(20, 20, (catchProgress / 100) * 180, 10);

    // Bot Progress Bar (Right)
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(450, 20, 180, 10);
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(450, 20, (botCatchProgress / 100) * 180, 10);
}

// Start Game
resetRound();
updateGame();
