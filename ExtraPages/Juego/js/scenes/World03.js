import Player from '../entities/Player.js';

export default class World03 extends Phaser.Scene {
    constructor() {
    super('World03');
    this.nodesActivated = 0;
    this.totalNodes = 4;
    this.portalOpened = false;
    this.lavaSpeed = 20;
    this.isDead = false;
}

    create() {
        this.isDead = false;

        const { width, height } = this.cameras.main;
        
        this.cameras.main.setBackgroundColor('#0a0a0f');
        this.physics.world.setBounds(0, -2000, 800, 2800);
        this.cameras.main.setBounds(0, -2000, 800, 2800);

        this.platforms = this.physics.add.staticGroup();
        this.spikeGroup = this.physics.add.staticGroup();

        // ==========================================
        // FUNCIÓN PARA CREAR PLATAFORMAS CON SPRITE - plat2
        // ==========================================
        const createPlatform = (x, y, width, spriteKey = 'plat2') => {
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
            
            // Añadir física con hitbox más pequeña que el sprite
            this.physics.add.existing(spike, true);
            // Reducir la hitbox (ancho 20, alto 16 en lugar del sprite completo)
            spike.body.setSize(20, 16);
            spike.body.setOffset(10, 8); // Centrar la hitbox
            
            this.spikeGroup.add(spike);
            return spike;
        };

        // ==========================================
        // PLATAFORMAS - TODAS CON plat2
        // ==========================================
        createPlatform(400, 750, 300, 'plat2');
        createPlatform(150, 650, 120, 'plat2');
        createPlatform(400, 580, 120, 'plat2');
        createPlatform(650, 510, 120, 'plat2');
        createPlatform(400, 440, 120, 'plat2');
        createPlatform(150, 370, 120, 'plat2');
        createPlatform(400, 300, 120, 'plat2');
        createPlatform(650, 230, 120, 'plat2');
        createPlatform(400, 160, 120, 'plat2');
        createPlatform(150, 90, 120, 'plat2');
        createPlatform(400, 0, 120, 'plat2');
        createPlatform(650, -70, 120, 'plat2');
        createPlatform(400, -140, 120, 'plat2');
        createPlatform(150, -210, 120, 'plat2');
        createPlatform(400, -280, 120, 'plat2');
        createPlatform(650, -350, 120, 'plat2');
        createPlatform(400, -420, 120, 'plat2');
        createPlatform(150, -490, 120, 'plat2');
        createPlatform(400, -560, 120, 'plat2');
        createPlatform(650, -630, 120, 'plat2');
        createPlatform(400, -700, 120, 'plat2');
        createPlatform(150, -770, 120, 'plat2');
        createPlatform(400, -840, 120, 'plat2');
        createPlatform(650, -910, 120, 'plat2');
        createPlatform(400, -980, 120, 'plat2');
        createPlatform(150, -1050, 120, 'plat2');
        createPlatform(400, -1120, 120, 'plat2');
        createPlatform(650, -1190, 120, 'plat2');
        createPlatform(400, -1260, 120, 'plat2');
        createPlatform(150, -1330, 120, 'plat2');
        createPlatform(400, -1400, 120, 'plat2');
        createPlatform(650, -1470, 120, 'plat2');
        createPlatform(150, -1600, 120, 'plat2');
        createPlatform(400, -1700, 120, 'plat2');
        createPlatform(400, -1550, 250, 'plat2');

        // ==========================================
        // ESPINAS
        // ==========================================
        createSpike(250, 490);
        createSpike(550, 420);
        createSpike(250, 280);
        createSpike(550, 140);
        createSpike(250, -90);
        createSpike(550, -160);
        createSpike(250, -300);
        createSpike(550, -370);
        createSpike(250, -500);
        createSpike(550, -570);
        createSpike(250, -860);
        createSpike(550, -930);
        createSpike(250, -1070);
        createSpike(550, -1140);
        createSpike(250, -1280);
        createSpike(550, -1350);
        createSpike(250, -1560);
        createSpike(550, -1630);
        createSpike(250, -1770);
        createSpike(550, -1840);
        createSpike(250, -1980);
        createSpike(550, -2050);

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

        this.node1 = createNode(300, -1530, 'ASCEN-1', 1);
        this.node2 = createNode(500, -1530, 'ASCEN-2', 2);
        this.node3 = createNode(300, -1610, 'ASCEN-3', 3);
        this.node4 = createNode(500, -1610, 'ASCEN-4', 4);

        // ==========================================
        // PUERTA FINAL
        // ==========================================
        this.finalDoor = this.add.rectangle(400, -1700, 200, 30, 0xff3300);
        this.finalDoor.setStrokeStyle(3, 0xff3300, 0.5);
        this.finalDoorOpen = false;

        // ==========================================
        // PORTAL CON SPRITE - ESCALA 2
        // ==========================================
        this.exitPortal = this.add.sprite(400, -1750, 'portal_off');
        this.exitPortal.setScale(2);
        this.exitPortal.setOrigin(0.5, 0.5);
        this.exitPortal.alpha = 0;
        this.exitPortal.visible = false;
        
        this.portalLabel = this.add.text(400, -1800, '▶ SALIDA ◀', {
            fontSize: '18px',
            color: '#ff6600',
            fontFamily: 'monospace',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: { x: 12, y: 6 }
        }).setOrigin(0.5);
        this.portalLabel.alpha = 0;
        this.portalLabel.visible = false;

        // ==========================================
        // LAVA
        // ==========================================
        this.lavaStartY = 1300;
        this.lava = this.add.rectangle(400, this.lavaStartY, 800, 1000, 0xff3300);
        this.lava.setStrokeStyle(2, 0xff6600, 0.3);
        this.lava.alpha = 0.5;
        this.physics.add.existing(this.lava, true);
        
        // ==========================================
        // JUGADOR
        // ==========================================
        this.player = new Player(this, 400, 700);
        this.physics.add.collider(this.player.sprite, this.platforms);

        // ==========================================
        // COLISIÓN CON PELIGROS (espinas + lava)
        // ==========================================
        this.physics.add.overlap(
            this.player.sprite,
            [this.spikeGroup, this.lava],
            this.handleHazard,
            null,
            this
        );

        // ==========================================
        // CÁMARA
        // ==========================================
        this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(80, 60);

        // ==========================================
        // UI
        // ==========================================
        this.identityText = this.add.text(780, 20, 'ASCENSIÓN: 0%', {
            fontSize: '14px',
            color: '#8888bb',
            fontFamily: 'monospace',
            align: 'right'
        }).setOrigin(1, 0).setScrollFactor(0);

        this.nodeText = this.add.text(780, 42, 'NODOS: 0/4', {
            fontSize: '12px',
            color: '#444477',
            fontFamily: 'monospace',
            align: 'right'
        }).setOrigin(1, 0).setScrollFactor(0);

        // ==========================================
        // INTRO
        // ==========================================
        const intro = this.add.text(400, 300, 'ASCENSIÓN', {
            fontSize: '48px',
            color: '#ff6600',
            fontFamily: 'monospace',
            shadow: { offsetX: 0, offsetY: 0, color: '#ff6600', blur: 20 }
        }).setOrigin(0.5).setScrollFactor(0);
        
        const sub = this.add.text(400, 350, 'ACTIVA LOS 4 NODOS', {
            fontSize: '18px',
            color: '#ff6600',
            fontFamily: 'monospace'
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

    update(time, delta) {
        this.player.update();
        this.checkNodes();
        this.checkFinalDoor();
        this.checkPortal();
        this.checkAllNodesActivated();

        this.lava.y -= this.lavaSpeed * (delta / 1000);
        this.lava.body.updateFromGameObject();

        this.cameras.main.update();
    }

    // ==========================================
    // MANEJADOR DE MUERTE CON EFECTO
    // ==========================================
    handleHazard(player, hazard) {
        if (this.isDead) return;
        this.isDead = true;

        const body = this.player.body;
        body.setVelocity(0, 0);
        body.setAllowGravity(false);

        const isLava = hazard === this.lava;

        if (isLava) {
            const lavaTop = this.lava.y - (this.lava.height / 2);
            this.tweens.add({
                targets: this.player.sprite,
                y: lavaTop + 10,
                duration: 250,
                ease: 'Sine.easeOut'
            });
            this.cameras.main.shake(200, 0.02);
        } else {
            this.cameras.main.shake(150, 0.025);
            this.cameras.main.flash(400, 255, 0, 0);
        }

        this.time.delayedCall(1000, () => {
            this.isDead = false;
            this.scene.restart();
        });
    }

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
        this.identityText.setText(`ASCENSIÓN: ${percent}%`);
        this.nodeText.setText(`NODOS: ${activated}/${this.totalNodes}`);
    }

    activateNode(node) {
        node.activated = true;
        
        if (this.textures.exists('node_on')) {
            node.setTexture('node_on');
        } else {
            node.setTint(0xff6600);
        }
        
        node.labelText.setColor('#ff6600');

        this.cameras.main.shake(80, 0.01);
        this.cameras.main.flash(200, 255, 100, 0);
    }

    checkAllNodesActivated() {
        if (this.portalOpened) return;
        
        let activated = 0;
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].activated) activated++;
        }
        
        if (activated >= 4) {
            this.openFinalDoor();
            this.portalOpened = true;
        }
    }

    openFinalDoor() {
        this.finalDoorOpen = true;
        this.finalDoor.fillColor = 0x00ff88;
        this.finalDoor.setStrokeStyle(3, 0x00ff88, 0.5);
        
        this.exitPortal.visible = true;
        
        if (this.textures.exists('portal_on')) {
            this.exitPortal.setTexture('portal_on');
        } else {
            this.exitPortal.setTint(0xff6600);
        }
        
        this.exitPortal.alpha = 0.8;
        this.portalLabel.visible = true;
        this.portalLabel.alpha = 0.8;

        this.cameras.main.shake(150, 0.025);
        this.cameras.main.flash(400, 255, 100, 0);
        
        const portalMsg = this.add.text(
            400,
            240,
            '¡PORTAL ABIERTO!',
            {
                fontSize: '32px',
                color: '#ff6600',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(0,0,0,0.9)',
                padding: { x: 20, y: 10 }
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

    checkFinalDoor() {
        if (this.finalDoorOpen) return;

        const player = this.player.sprite;
        const distance = Phaser.Math.Distance.Between(
            player.x, player.y, this.finalDoor.x, this.finalDoor.y
        );

        if (distance < 50 && !this.finalDoorOpen) {
            this.handleHazard(player, this.finalDoor);
        }
    }

    checkPortal() {
    if (!this.exitPortal.visible) return;

    const player = this.player.sprite;
    const distance = Phaser.Math.Distance.Between(
        player.x, player.y, this.exitPortal.x, this.exitPortal.y
    );

    if (distance < 45) {
        this.cameras.main.shake(200, 0.04);
        this.cameras.main.flash(500, 255, 100, 0);
        
        const msg = this.add.text(
            400,
            100,
            'ASCENSIÓN COMPLETA',
            {
                fontSize: '28px',
                color: '#ff6600',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: { x: 15, y: 8 }
            }
        ).setOrigin(0.5).setScrollFactor(0);
        
        this.time.delayedCall(2000, () => {
            msg.destroy();
        });
        
        this.time.delayedCall(3000, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1200, () => {
                this.scene.start('BossScene');  // <--- CAMBIADO A BossScene
            });
        });
    }
}
}