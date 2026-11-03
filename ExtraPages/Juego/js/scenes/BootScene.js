export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
        this.music = null;
    }

    preload() {
        // ==========================================
        // PLAYER
        // ==========================================
        this.load.image('player_idle1', 'assets/Player/idle1.png');
        this.load.image('player_idle2', 'assets/Player/idle2.png');
        this.load.image('player_jump', 'assets/Player/jump.png');
        this.load.image('player_run1', 'assets/Player/run1.png');
        this.load.image('player_run2', 'assets/Player/run2.png');

        // ==========================================
        // PLATAFORMAS
        // ==========================================
        this.load.image('plat0', 'assets/platform/plat0.png');
        this.load.image('plat1', 'assets/platform/plat1.png');
        this.load.image('plat2', 'assets/platform/plat2.png');

        // ==========================================
        // NODOS
        // ==========================================
        this.load.image('node_off', 'assets/nodes/NodeOff.png');
        this.load.image('node_on', 'assets/nodes/NodeActive.png');

        // ==========================================
        // PORTAL
        // ==========================================
        this.load.image('portal_off', 'assets/portal/portalOff.png');
        this.load.image('portal_on', 'assets/portal/portalActive.png');

        // ==========================================
        // ESPINAS
        // ==========================================
        this.load.image('spike', 'assets/spikes/spike.png');

        // ==========================================
        // BOSS
        // ==========================================
        this.load.image('boss', 'assets/boss/boss.png');
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.add.text(width/2, height/2 - 40, 'ID', {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'monospace',
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 20 }
        }).setOrigin(0.5);

        this.add.text(width/2, height/2 + 30, 'IDENTIDAD', {
            fontSize: '18px',
            color: '#00ffff',
            fontFamily: 'monospace',
            letterSpacing: 6
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(800);
        this.time.delayedCall(1500, () => {
            this.cameras.main.fadeOut(600);
            this.time.delayedCall(700, () => {
                this.scene.start('MenuScene');
            });
        });
    }
}