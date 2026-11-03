export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
        this.selectedOption = 0;
        this.options = ['INICIAR', 'CRÉDITOS'];
    }

    create() {
        const { width, height } = this.cameras.main;
        this.createGrid();
        
        this.add.text(width/2, 180, 'ID', {
            fontSize: '80px',
            color: '#ffffff',
            fontFamily: 'monospace',
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 30 }
        }).setOrigin(0.5);

        this.add.text(width/2, 230, 'RECONSTRUCCIÓN DE IDENTIDAD', {
            fontSize: '14px',
            color: '#00ffff',
            fontFamily: 'monospace',
            letterSpacing: 4
        }).setOrigin(0.5);

        this.add.graphics()
            .lineStyle(1, 0x00ffff, 0.2)
            .lineBetween(width/2 - 100, 260, width/2 + 100, 260);

        this.optionTexts = [];
        this.options.forEach((text, index) => {
            const y = 320 + index * 40;
            const option = this.add.text(width/2, y, text, {
                fontSize: '20px',
                color: index === 0 ? '#00ffff' : '#444466',
                fontFamily: 'monospace',
                letterSpacing: 2
            }).setOrigin(0.5);
            this.optionTexts.push(option);
        });

        this.arrow = this.add.text(width/2 - 80, 320, '▶', {
            fontSize: '18px',
            color: '#00ffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(width/2, 440, '↑ ↓  NAVEGAR    Z / ESPACIO  SELECCIONAR', {
            fontSize: '12px',
            color: '#333355',
            fontFamily: 'monospace',
            letterSpacing: 2
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-UP', () => this.navigate(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.navigate(1));
        this.input.keyboard.on('keydown-Z', () => this.select());
        this.input.keyboard.on('keydown-SPACE', () => this.select());
        this.input.keyboard.on('keydown-ENTER', () => this.select());
    }

    createGrid() {
        const { width, height } = this.cameras.main;
        const graphics = this.add.graphics();
        
        for (let x = 0; x < width; x += 40) {
            for (let y = 0; y < height; y += 40) {
                graphics.fillStyle(0x00ffff, Math.random() * 0.1);
                graphics.fillCircle(x, y, 1);
            }
        }
        for (let y = 0; y < height; y += 40) {
            graphics.lineStyle(1, 0x00ffff, 0.03);
            graphics.lineBetween(0, y, width, y);
        }
        for (let x = 0; x < width; x += 40) {
            graphics.lineStyle(1, 0x00ffff, 0.03);
            graphics.lineBetween(x, 0, x, height);
        }
    }

    navigate(direction) {
        this.selectedOption = (this.selectedOption + direction + this.options.length) % this.options.length;
        this.optionTexts.forEach((text, index) => {
            text.setColor(index === this.selectedOption ? '#00ffff' : '#444466');
            text.setFontSize(index === this.selectedOption ? '22px' : '20px');
        });
        this.arrow.y = 320 + this.selectedOption * 40;
    }

    select() {
        if (this.selectedOption === 0) {
            this.cameras.main.fadeOut(400);
            this.time.delayedCall(500, () => this.scene.start('World01'));
        } else {
            const credits = this.add.text(this.cameras.main.width/2, 500, 'JUEGO POR: Gravito', {
                fontSize: '14px',
                color: '#00ffff',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            credits.alpha = 0;
            this.tweens.add({
                targets: credits,
                alpha: 1,
                duration: 300,
                onComplete: () => {
                    this.time.delayedCall(2000, () => {
                        this.tweens.add({
                            targets: credits,
                            alpha: 0,
                            duration: 300,
                            onComplete: () => credits.destroy()
                        });
                    });
                }
            });
        }
    }
}