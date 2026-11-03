import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import World01 from './scenes/World01.js';
import World02 from './scenes/World02.js';
import World03 from './scenes/World03.js';
import BossScene from './scenes/BossScene.js';  // <--- NUEVO

const loader = document.getElementById('loader');

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#0a0a0f',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, World01, World02, World03, BossScene]  // <--- AÑADIDO
};

const game = new Phaser.Game(config);

setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.style.display = 'none', 800);
}, 1500);

function resizeGame() {
    const container = document.getElementById('game-container');
    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.85;
    const scale = Math.min(maxWidth / 800, maxHeight / 600, 1.5);
    
    container.style.width = (800 * scale) + 'px';
    container.style.height = (600 * scale) + 'px';
    
    const canvas = container.querySelector('canvas');
    if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }
}

window.addEventListener('load', resizeGame);
window.addEventListener('resize', resizeGame);

document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    }
});