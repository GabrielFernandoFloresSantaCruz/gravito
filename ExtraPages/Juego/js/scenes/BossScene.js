export default class BossScene extends Phaser.Scene {
    constructor() {
        super('BossScene');
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor('#0a0a0a');
        this.cameras.main.fadeIn(1500, 0, 0, 0);
        
        // ==========================================
        // SPRITE DEL BOSS (CON ESCALA Y TRANSPARENCIA)
        // ==========================================
        const bossSprite = this.add.sprite(width/2, height/2 - 30, 'boss');
        bossSprite.setScale(3);
        bossSprite.setOrigin(0.5, 0.5);
        bossSprite.alpha = 0.3;
        
        // EFECTO DE ESCALA (como si respirara)
        this.tweens.add({
            targets: bossSprite,
            scaleX: 3.15,
            scaleY: 3.15,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // EFECTO DE TRANSPARENCIA (parpadeo suave)
        this.tweens.add({
            targets: bossSprite,
            alpha: 0.6,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ==========================================
        // TEXTO "BOSS FINAL"
        // ==========================================
        const title = this.add.text(width/2, height/2 - 130, 'BOSS FINAL', {
            fontSize: '56px',
            color: '#ff0044',
            fontFamily: 'monospace',
            shadow: { offsetX: 0, offsetY: 0, color: '#ff0044', blur: 30 }
        }).setOrigin(0.5);
        title.alpha = 0;
        
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 1000,
            delay: 500,
            ease: 'Power2'
        });

        // ==========================================
        // TEXTO "PRÓXIMAMENTE"
        // ==========================================
        const subtitle = this.add.text(width/2, height/2 - 70, 'PRÓXIMAMENTE', {
            fontSize: '24px',
            color: '#ff6600',
            fontFamily: 'monospace',
            letterSpacing: 6
        }).setOrigin(0.5);
        subtitle.alpha = 0;
        
        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 1000,
            delay: 800,
            ease: 'Power2'
        });

        // ==========================================
        // TEXTO "VOLVER AL MENÚ"
        // ==========================================
        const backText = this.add.text(width/2, height/2 + 120, 'PRESIONA Z / ESPACIO PARA VOLVER AL MENÚ', {
            fontSize: '16px',
            color: '#444466',
            fontFamily: 'monospace',
            letterSpacing: 2
        }).setOrigin(0.5);
        backText.alpha = 0;
        
        this.tweens.add({
            targets: backText,
            alpha: 1,
            duration: 1000,
            delay: 1500,
            ease: 'Power2'
        });

        // ==========================================
        // EFECTO DE PARTÍCULAS
        // ==========================================
        for (let i = 0; i < 30; i++) {
            const particle = this.add.circle(
                Math.random() * width,
                Math.random() * height,
                2,
                0xff0044,
                0.1
            );
            this.tweens.add({
                targets: particle,
                y: particle.y + (Math.random() - 0.5) * 200,
                x: particle.x + (Math.random() - 0.5) * 200,
                alpha: 0.3,
                duration: 3000 + Math.random() * 3000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // ==========================================
        // EFECTO DE LÍNEA DE SCAN
        // ==========================================
        const scanLine = this.add.graphics();
        let scanY = -20;
        this.time.addEvent({
            delay: 30,
            callback: () => {
                scanY += 2;
                if (scanY > height + 20) {
                    scanY = -20;
                }
                scanLine.clear();
                scanLine.lineStyle(1, 0xff0044, 0.05);
                scanLine.lineBetween(0, scanY, width, scanY);
            },
            loop: true
        });

        // ==========================================
        // INPUT PARA VOLVER AL MENÚ
        // ==========================================
        this.input.keyboard.on('keydown-Z', () => {
            this.goToMenu();
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.goToMenu();
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this.goToMenu();
        });
        this.input.on('pointerdown', () => {
            this.goToMenu();
        });
    }

    goToMenu() {
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.time.delayedCall(900, () => {
            this.scene.start('MenuScene');
        });
    }
}