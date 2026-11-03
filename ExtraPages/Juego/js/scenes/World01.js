import Player from '../entities/Player.js';
import Trail from '../entities/Trail.js';
import SystemMessage from '../utils/SystemMessage.js';

export default class World01 extends Phaser.Scene {
    constructor() {
        super('World01');
        this.nodesActivated = 0;
        this.totalNodes = 4;
        this.levelComplete = false;
        this.portalOpened = false;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor('#0a0a0f');
        this.physics.world.setBounds(0, 0, 2400, 800);
        this.cameras.main.setBounds(0, 0, 2400, 800);

        this.platforms = this.physics.add.staticGroup();

        // ==========================================
        // FUNCIÓN PARA CREAR PLATAFORMAS CON SPRITE
        // ==========================================
        const createPlatform = (x, y, width, spriteKey = 'plat0') => {
            const p = this.add.sprite(x, y, spriteKey);
            const scaleX = width / 20;
            p.setScale(scaleX, 1);
            p.setOrigin(0.5, 0.5);
            this.physics.add.existing(p, true);
            this.platforms.add(p);
            return p;
        };

        // ==========================================
        // PLATAFORMAS
        // ==========================================
        createPlatform(1200, 780, 2400, 'plat0');
        createPlatform(200, 700, 160, 'plat1');
        createPlatform(450, 620, 160, 'plat1');
        createPlatform(750, 560, 140, 'plat2');
        createPlatform(1000, 480, 140, 'plat2');
        createPlatform(1250, 400, 140, 'plat2');
        createPlatform(1050, 300, 120, 'plat1');
        createPlatform(1250, 220, 120, 'plat1');
        createPlatform(1600, 500, 140, 'plat2');
        createPlatform(1850, 580, 140, 'plat2');
        createPlatform(2100, 660, 140, 'plat2');
        createPlatform(2000, 380, 160, 'plat0');
        createPlatform(1700, 440, 100, 'plat1');
        createPlatform(1850, 380, 80, 'plat1');

        // ==========================================
        // PLATAFORMA PARA EL PORTAL
        // ==========================================
        const portalPlatform = this.add.sprite(2200, 310, 'plat0');
        portalPlatform.setDisplaySize(160, 16);
        portalPlatform.setOrigin(0.5, 0.5);
        this.physics.add.existing(portalPlatform, true);
        this.platforms.add(portalPlatform);

        // ==========================================
        // NODOS CON SPRITE - ESCALA 2
        // ==========================================
        this.nodes = [];

        const createNode = (x, y, label, message) => {
            const node = this.add.sprite(x, y, 'node_off');
            node.setScale(2);  // <--- ESCALA 2
            node.setOrigin(0.5, 0.5);
            node.label = label;
            node.message = message;
            node.activated = false;
            
            const text = this.add.text(x, y - 35, label, {
                fontSize: '14px',
                color: '#444477',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            node.labelText = text;
            this.nodes.push(node);
            return node;
        };

        this.node1 = createNode(500, 580, 'DESPERTAR', '> SISTEMA INICIADO');
        this.node2 = createNode(1100, 440, 'RECUERDO', '> IDENTIDAD PARCIAL');
        this.node3 = createNode(1850, 540, 'CONEXIÓN', '> ESTELA RESTAURADA');
        this.node4 = createNode(2000, 340, 'TRASCENDER', '> NUEVA IDENTIDAD');

        // ==========================================
        // PUERTAS - ELIMINADAS
        // ==========================================
        this.doorOpen = true;
        this.portalDoorOpen = true;

        // ==========================================
        // PORTAL DE SALIDA CON SPRITE - ESCALA 2
        // ==========================================
        this.exitPortal = this.add.sprite(2200, 280, 'portal_off');
        this.exitPortal.setScale(2);  // <--- ESCALA 2
        this.exitPortal.setOrigin(0.5, 0.5);
        this.exitPortal.alpha = 1;
        this.exitPortal.visible = true;
        
        this.portalGlow = this.add.circle(2200, 280, 60, 0x00ffff);  // <--- GLOW MÁS GRANDE
        this.portalGlow.alpha = 0.3;
        this.portalGlow.visible = true;
        this.portalGlow.setStrokeStyle(2, 0x00ffff, 0.5);

        this.portalLabel = this.add.text(2200, 325, '▶ SALIDA AL MUNDO 2 ◀', {
            fontSize: '18px',
            color: '#00ffff',
            fontFamily: 'monospace',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        this.portalLabel.alpha = 1;
        this.portalLabel.visible = true;

        this.portalArrow = this.add.text(2200, 365, '▼', {
            fontSize: '30px',
            color: '#00ffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        this.portalArrow.alpha = 1;
        this.portalArrow.visible = true;

        // ==========================================
        // INDICADOR EN UI
        // ==========================================
        this.portalIndicator = this.add.text(
            this.cameras.main.width / 2,
            550,
            'ACTIVA LOS 4 NODOS PARA ABRIR EL PORTAL',
            {
                fontSize: '16px',
                color: '#00ffff',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(0,0,0,0.9)',
                padding: { x: 15, y: 8 }
            }
        ).setOrigin(0.5).setScrollFactor(0);
        this.portalIndicator.alpha = 0.8;

        // ==========================================
        // JUGADOR
        // ==========================================
        this.player = new Player(this, 250, 700);
        this.physics.add.collider(this.player.sprite, this.platforms);

        // ==========================================
        // ESTELA
        // ==========================================
        this.trail = new Trail(this);
        this.player.hasTrail = true;

        // ==========================================
        // CÁMARA
        // ==========================================
        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(100, 60);

        // ==========================================
        // UI
        // ==========================================
        this.createUI();
        this.createAtmosphere();
        this.showIntro();
    }

    createUI() {
        const { width } = this.cameras.main;

        this.energyBg = this.add.rectangle(20, 20, 120, 6, 0x1a1a3e).setScrollFactor(0);
        this.energyBar = this.add.rectangle(20, 20, 120, 6, 0x00ffff).setScrollFactor(0);
        this.energyBar.setOrigin(0, 0.5);

        this.energyText = this.add.text(20, 34, 'ENERGÍA', {
            fontSize: '10px',
            color: '#444477',
            fontFamily: 'monospace'
        }).setScrollFactor(0);

        this.identityText = this.add.text(width - 20, 20, 'IDENTIDAD: 0%', {
            fontSize: '12px',
            color: '#8888bb',
            fontFamily: 'monospace',
            align: 'right'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.nodeText = this.add.text(width - 20, 40, 'NODOS: 0/4', {
            fontSize: '10px',
            color: '#444477',
            fontFamily: 'monospace',
            align: 'right'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.trailStatus = this.add.text(20, 50, 'ESTELA: INACTIVA', {
            fontSize: '10px',
            color: '#444477',
            fontFamily: 'monospace'
        }).setScrollFactor(0);

        this.controls = this.add.text(20, 70, '↑ SALTO  ← → MOVER  Z ESTELA', {
            fontSize: '10px',
            color: '#333355',
            fontFamily: 'monospace'
        }).setScrollFactor(0);

        this.time.delayedCall(5000, () => {
            this.tweens.add({ targets: this.controls, alpha: 0, duration: 1000 });
        });
    }

    createAtmosphere() {
        for (let i = 0; i < 30; i++) {
            const particle = this.add.circle(
                Math.random() * 2400,
                Math.random() * 800,
                1,
                0x00ffff,
                0.05
            );
            this.tweens.add({
                targets: particle,
                y: particle.y + (Math.random() - 0.5) * 100,
                x: particle.x + (Math.random() - 0.5) * 100,
                duration: 5000 + Math.random() * 5000,
                yoyo: true,
                repeat: -1
            });
        }
    }

    showIntro() {
        const { width, height } = this.cameras.main;
        
        const intro = this.add.text(width/2, height/2 - 40, 'SISTEMA BASE', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'monospace',
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 20 }
        }).setOrigin(0.5).setScrollFactor(0);
        
        const sub = this.add.text(width/2, height/2 + 20, 'ENCUENTRA LOS NODOS DE MEMORIA', {
            fontSize: '14px',
            color: '#00ffff',
            fontFamily: 'monospace',
            letterSpacing: 4
        }).setOrigin(0.5).setScrollFactor(0);
        
        intro.alpha = 0;
        sub.alpha = 0;
        
        this.tweens.add({
            targets: [intro, sub],
            alpha: 1,
            duration: 800,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: [intro, sub],
                        alpha: 0,
                        duration: 600,
                        onComplete: () => {
                            intro.destroy();
                            sub.destroy();
                        }
                    });
                });
            }
        });
    }

    update() {
        this.player.update();
        this.trail.update(this.player);
        
        const energy = this.trail.getEnergyPercent();
        this.energyBar.width = 120 * energy;
        this.energyBar.setFillStyle(energy > 0.3 ? 0x00ffff : 0xff0044);
        
        this.trailStatus.setText(`ESTELA: ${this.player.trailActive ? 'ACTIVA' : 'INACTIVA'}`);
        this.trailStatus.setColor(this.player.trailActive ? '#00ffff' : '#444477');

        this.checkNodes();
        this.checkPortal();
        this.updatePortalEffects();

        this.cameras.main.update();
    }

    checkNodes() {
        const player = this.player.sprite;
        let activated = 0;

        this.nodes.forEach(node => {
            if (node.activated) {
                activated++;
                return;
            }

            const distance = Phaser.Math.Distance.Between(
                player.x, player.y, node.x, node.y
            );

            if (distance < 30) {  // <--- AUMENTADO A 30 POR LA ESCALA
                this.activateNode(node);
            }
        });

        this.nodesActivated = activated;
        const percent = Math.floor(activated / this.totalNodes * 100);
        this.identityText.setText(`IDENTIDAD: ${percent}%`);
        this.nodeText.setText(`NODOS: ${activated}/${this.totalNodes}`);
        
        if (activated >= this.totalNodes) {
            this.portalIndicator.setText('★ PORTAL ABIERTO ★');
            this.portalIndicator.setColor('#00ffff');
            this.portalIndicator.alpha = 1;
        } else {
            this.portalIndicator.setText(`ACTIVA LOS 4 NODOS (${activated}/4)`);
            this.portalIndicator.setColor('#ff0044');
        }
    }

    activateNode(node) {
        node.activated = true;
        node.setTexture('node_on');
        node.labelText.setColor('#00ffff');

        this.cameras.main.shake(60, 0.01);
        this.cameras.main.flash(200, 0, 255, 255);

        for (let i = 0; i < 20; i++) {  // <--- MÁS PARTÍCULAS
            const particle = this.add.circle(
                node.x + (Math.random() - 0.5) * 30,
                node.y + (Math.random() - 0.5) * 30,
                2,
                0x00ffff,
                0.6
            );
            this.tweens.add({
                targets: particle,
                x: particle.x + (Math.random() - 0.5) * 100,
                y: particle.y + (Math.random() - 0.5) * 100,
                alpha: 0,
                scale: 0,
                duration: 600,
                onComplete: () => particle.destroy()
            });
        }

        new SystemMessage(
            this,
            node.x,
            node.y - 50,
            node.message || '> NODO RESTAURADO',
            '#00ffff',
            2000
        );

        if (this.nodesActivated >= this.totalNodes) {
            this.portalIndicator.setText('★ PORTAL ABIERTO ★');
            this.portalIndicator.setColor('#00ffff');
            
            // Cambiar textura del portal a activo
            this.exitPortal.setTexture('portal_on');
            
            new SystemMessage(this, 2200, 620, '> PORTAL AL MUNDO 2 ACTIVADO', '#ff00ff', 3000);
            this.cameras.main.shake(150, 0.025);
            this.cameras.main.flash(400, 255, 0, 255);
        }
    }

    updatePortalEffects() {
        const pulse = Math.sin(this.time.now * 0.003) * 0.3 + 0.7;
        this.portalGlow.alpha = 0.3 * pulse;
        this.portalGlow.scale = 1 + Math.sin(this.time.now * 0.002) * 0.1;
        
        this.portalArrow.y = 365 + Math.sin(this.time.now * 0.004) * 8;
        this.portalArrow.alpha = 0.5 + Math.sin(this.time.now * 0.004) * 0.3;
        
        this.exitPortal.alpha = 0.5 + Math.sin(this.time.now * 0.003) * 0.3;
        this.exitPortal.scale = 2 + Math.sin(this.time.now * 0.002) * 0.05;
    }

    checkPortal() {
        const player = this.player.sprite;
        const distance = Phaser.Math.Distance.Between(
            player.x, player.y, this.exitPortal.x, this.exitPortal.y
        );

        if (distance < 45 && this.nodesActivated >= this.totalNodes) {  // <--- AUMENTADO A 45
            this.levelComplete = true;
            
            this.cameras.main.shake(200, 0.04);
            this.cameras.main.flash(500, 0, 255, 255);
            
            new SystemMessage(
                this, 
                this.cameras.main.width/2, 
                100, 
                '> SISTEMA BASE RESTAURADO', 
                '#00ffff', 
                2000
            );
            
            this.time.delayedCall(1500, () => {
                const goToWorld2 = this.add.text(
                    this.cameras.main.width/2,
                    this.cameras.main.height/2 + 60,
                    '→ MUNDO 2: DATA CORE',
                    {
                        fontSize: '28px',
                        color: '#ff00ff',
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        padding: { x: 20, y: 10 }
                    }
                ).setOrigin(0.5).setScrollFactor(0);
                
                this.tweens.add({
                    targets: goToWorld2,
                    alpha: 0,
                    duration: 1000,
                    delay: 1500,
                    onComplete: () => goToWorld2.destroy()
                });
            });
            
            this.time.delayedCall(3000, () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.time.delayedCall(1200, () => {
                    this.scene.start('World02');
                });
            });
        }
    }

    playerDied(message = 'SISTEMA COLAPSADO') {
        this.cameras.main.shake(150, 0.025);
        this.cameras.main.flash(400, 255, 0, 0);
        
        new SystemMessage(
            this, 
            this.player.sprite.x, 
            this.player.sprite.y - 60, 
            message, 
            '#ff0044', 
            1500
        );
        
        this.time.delayedCall(500, () => {
            let spawnX = 250;
            let spawnY = 700;
            
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                if (this.nodes[i].activated) {
                    spawnX = this.nodes[i].x;
                    spawnY = this.nodes[i].y + 50;
                    break;
                }
            }
            
            this.player.setPosition(spawnX, spawnY);
            this.cameras.main.fadeIn(300, 0, 0, 0);
        });
    }
}