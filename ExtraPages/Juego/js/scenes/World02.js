import Player from '../entities/Player.js';

export default class World02 extends Phaser.Scene {
    constructor() {
        super('World02');
        this.nodesActivated = 0;
        this.totalNodes = 4;
        this.respawnPoint = null;
        this.levelComplete = false;
        this.portalOpened = false;
        this.isDead = false;
    }

    create() {
        this.isDead = false;

        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor('#0a0a1a');
        this.physics.world.setBounds(0, 0, 3200, 800);
        this.cameras.main.setBounds(0, 0, 3200, 800);

        this.platforms = this.physics.add.staticGroup();
        this.spikeGroup = this.physics.add.staticGroup();

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
        // FUNCIÓN PARA CREAR ESPINAS CON SPRITE - HITBOX AJUSTADA
        // ==========================================
        const createSpike = (x, y) => {
            const spike = this.add.sprite(x, y, 'spike');
            spike.setScale(2);
            spike.setOrigin(0.5, 0.5);
            this.physics.add.existing(spike, true);
            spike.body.setSize(20, 16);
            spike.body.setOffset(10, 8);
            this.spikeGroup.add(spike);
            return spike;
        };

        // ==========================================
        // PLATAFORMAS
        // ==========================================
        createPlatform(1600, 780, 3200, 'plat0');
        createPlatform(200, 700, 160, 'plat0');
        createPlatform(450, 620, 160, 'plat0');
        createPlatform(700, 540, 140, 'plat0');
        createPlatform(1000, 620, 140, 'plat0');
        createPlatform(1250, 540, 140, 'plat0');
        createPlatform(1500, 460, 140, 'plat0');
        createPlatform(1750, 380, 140, 'plat0');
        createPlatform(2100, 460, 140, 'plat0');
        createPlatform(2350, 540, 140, 'plat0');
        createPlatform(2600, 620, 140, 'plat0');
        createPlatform(2850, 540, 140, 'plat0');
        createPlatform(3050, 460, 140, 'plat0');
        createPlatform(900, 380, 60, 'plat0');
        createPlatform(1950, 300, 60, 'plat0');
        createPlatform(2200, 380, 60, 'plat0');

        // ==========================================
        // TRAMPAS (ESPINAS)
        // ==========================================
        createSpike(300, 660);
        createSpike(350, 660);
        createSpike(550, 580);
        createSpike(600, 580);
        createSpike(850, 500);
        createSpike(900, 500);
        createSpike(950, 500);
        createSpike(1150, 580);
        createSpike(1200, 580);
        createSpike(1400, 500);
        createSpike(1450, 500);
        createSpike(1500, 500);
        createSpike(1550, 500);
        createSpike(1850, 420);
        createSpike(1900, 420);
        createSpike(2150, 420);
        createSpike(2200, 420);
        createSpike(2250, 420);
        createSpike(1970, 340);
        createSpike(2020, 340);
        createSpike(2900, 500);
        createSpike(2950, 500);

        // ==========================================
        // NODOS CON SPRITE - ESCALA 2
        // ==========================================
        this.nodes = [];

        const createNode = (x, y, label, nodeId) => {
            const node = this.add.sprite(x, y, 'node_off');
            node.setScale(2);
            node.setOrigin(0.5, 0.5);
            node.label = label;
            node.activated = false;
            node.nodeId = nodeId;
            
            const text = this.add.text(x, y - 35, label, {
                fontSize: '14px',
                color: '#666699',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            node.labelText = text;
            this.nodes.push(node);
            return node;
        };

        this.node1 = createNode(500, 580, 'DATA-1', 1);
        this.node2 = createNode(1200, 500, 'DATA-2', 2);
        this.node3 = createNode(2100, 420, 'DATA-3', 3);
        this.node4 = createNode(2850, 500, 'DATA-4', 4);

        // ==========================================
        // PORTAL CON SPRITE - ESCALA 2
        // ==========================================
        this.exitPortal = this.add.sprite(3050, 420, 'portal_off');
        this.exitPortal.setScale(2);
        this.exitPortal.setOrigin(0.5, 0.5);
        this.exitPortal.alpha = 0;
        this.exitPortal.visible = false;
        
        this.portalLabel = this.add.text(3050, 470, '▶ PORTAL ◀', {
            fontSize: '20px',
            color: '#8844ff',
            fontFamily: 'monospace',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);
        this.portalLabel.alpha = 0;
        this.portalLabel.visible = false;

        // ==========================================
        // JUGADOR
        // ==========================================
        this.player = new Player(this, 250, 700);
        this.physics.add.collider(this.player.sprite, this.platforms);
        
        this.physics.add.overlap(
            this.player.sprite,
            this.spikeGroup,
            this.hitSpike,
            null,
            this
        );

        this.player.hasTrail = false;

        // ==========================================
        // CÁMARA
        // ==========================================
        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(100, 60);

        this.respawnPoint = { x: 250, y: 620 };

        // ==========================================
        // UI
        // ==========================================
        this.createUI();
        this.createAtmosphere();
        this.showIntro();
    }

    createUI() {
        const { width } = this.cameras.main;

        this.energyBg = this.add.rectangle(20, 20, 120, 8, 0x1a1a3e).setScrollFactor(0);
        this.energyBar = this.add.rectangle(20, 20, 120, 8, 0x8844ff).setScrollFactor(0);
        this.energyBar.setOrigin(0, 0.5);

        this.energyText = this.add.text(20, 36, 'ENERGÍA', {
            fontSize: '10px',
            color: '#444477',
            fontFamily: 'monospace'
        }).setScrollFactor(0);

        this.identityText = this.add.text(width - 20, 20, 'DATA CORE: 0%', {
            fontSize: '14px',
            color: '#8888bb',
            fontFamily: 'monospace',
            align: 'right'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.nodeText = this.add.text(width - 20, 42, 'NODOS: 0/4', {
            fontSize: '12px',
            color: '#444477',
            fontFamily: 'monospace',
            align: 'right'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.trailStatus = this.add.text(20, 54, 'ESTELA: DESACTIVADA', {
            fontSize: '10px',
            color: '#444477',
            fontFamily: 'monospace'
        }).setScrollFactor(0);

        this.controls = this.add.text(20, 72, '↑ SALTO  ← → MOVER', {
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
                Math.random() * 3200,
                Math.random() * 800,
                1,
                0x8844ff,
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
        
        const intro = this.add.text(width/2, height/2 - 40, 'DATA CORE', {
            fontSize: '48px',
            color: '#8844ff',
            fontFamily: 'monospace',
            shadow: { offsetX: 0, offsetY: 0, color: '#8844ff', blur: 20 }
        }).setOrigin(0.5).setScrollFactor(0);
        
        const sub = this.add.text(width/2, height/2 + 20, 'SUPERA LAS TRAMPAS Y ACTIVA LOS NODOS', {
            fontSize: '14px',
            color: '#8844ff',
            fontFamily: 'monospace',
            letterSpacing: 2
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
        
        this.energyBar.width = 120;
        this.energyBar.setFillStyle(0x8844ff);
        
        this.trailStatus.setText('ESTELA: DESACTIVADA');

        this.checkNodes();
        this.checkPortal();
        this.checkAllNodesActivated();

        this.cameras.main.update();
    }

    hitSpike(player, spike) {
        this.playerDied();
    }

    // ==========================================
    // CHECK NODOS
    // ==========================================
    checkNodes() {
        const player = this.player.sprite;
        let activated = 0;

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            
            if (node.activated) {
                activated++;
                continue;
            }

            const distance = Phaser.Math.Distance.Between(
                player.x, player.y, node.x, node.y
            );

            if (distance < 30) {
                this.activateNode(node);
            }
        }

        this.nodesActivated = activated;
        const percent = Math.floor(activated / this.totalNodes * 100);
        this.identityText.setText(`DATA CORE: ${percent}%`);
        this.nodeText.setText(`NODOS: ${activated}/${this.totalNodes}`);
    }

    // ==========================================
    // ACTIVATE NODE
    // ==========================================
    activateNode(node) {
        node.activated = true;
        
        if (this.textures.exists('node_on')) {
            node.setTexture('node_on');
        } else {
            node.setTint(0x8844ff);
        }
        
        node.labelText.setColor('#8844ff');

        this.cameras.main.shake(80, 0.01);
        this.cameras.main.flash(200, 136, 68, 255);
    }

    checkAllNodesActivated() {
        if (this.portalOpened) return;
        
        let activated = 0;
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].activated) activated++;
        }
        
        if (activated >= this.totalNodes) {
            this.openPortal();
            this.portalOpened = true;
        }
    }

    openPortal() {
        this.exitPortal.visible = true;
        
        if (this.textures.exists('portal_on')) {
            this.exitPortal.setTexture('portal_on');
        } else {
            this.exitPortal.setTint(0x8844ff);
        }
        
        this.exitPortal.alpha = 0.8;
        this.portalLabel.visible = true;
        this.portalLabel.alpha = 0.8;

        this.cameras.main.shake(150, 0.025);
        this.cameras.main.flash(400, 136, 68, 255);
        
        const portalMsg = this.add.text(
            this.cameras.main.width/2,
            this.cameras.main.height/2 - 60,
            '¡PORTAL ABIERTO!',
            {
                fontSize: '40px',
                color: '#8844ff',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(0,0,0,0.9)',
                padding: { x: 25, y: 12 }
            }
        ).setOrigin(0.5).setScrollFactor(0);
        portalMsg.alpha = 0;
        
        this.tweens.add({
            targets: portalMsg,
            alpha: 1,
            duration: 300,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: portalMsg,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => portalMsg.destroy()
                    });
                });
            }
        });
    }

    checkPortal() {
        if (!this.exitPortal.visible) return;

        const player = this.player.sprite;
        const distance = Phaser.Math.Distance.Between(
            player.x, player.y, this.exitPortal.x, this.exitPortal.y
        );

        if (distance < 45) {
            this.levelComplete = true;
            
            this.cameras.main.shake(200, 0.04);
            this.cameras.main.flash(500, 136, 68, 255);
            
            const msg = this.add.text(
                400,
                100,
                'DATA CORE RESTAURADO',
                {
                    fontSize: '28px',
                    color: '#8844ff',
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: { x: 15, y: 8 }
                }
            ).setOrigin(0.5).setScrollFactor(0);
            
            this.time.delayedCall(1500, () => {
                msg.destroy();
                
                const goTo = this.add.text(
                    400,
                    320,
                    '→ MUNDO 3: ASCENSIÓN',
                    {
                        fontSize: '28px',
                        color: '#ff6600',
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        padding: { x: 20, y: 10 }
                    }
                ).setOrigin(0.5).setScrollFactor(0);
                
                this.tweens.add({
                    targets: goTo,
                    alpha: 0,
                    duration: 1000,
                    delay: 1500,
                    onComplete: () => goTo.destroy()
                });
            });
            
            this.time.delayedCall(3500, () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.time.delayedCall(1200, () => {
                    this.scene.start('World03');
                });
            });
        }
    }

    // ==========================================
    // PLAYER DIED
    // ==========================================
    playerDied() {
        if (this.isDead) return;
        this.isDead = true;

        this.cameras.main.shake(150, 0.025);
        this.cameras.main.flash(400, 255, 0, 0);
        
        this.time.delayedCall(500, () => {
            this.isDead = false;
            this.scene.restart();
        });
    }
}