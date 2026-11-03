export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.facing = 1;
        this.isGrounded = false;
        this.isJumping = false;
        this.jumpHoldTime = 0;
        this.maxJumpHold = 150;
        
        // Verificar que la escena existe
        if (!scene || !scene.add) {
            console.error('Player: Scene no válida');
            return;
        }
        
        // Sprite del jugador (usando idle1 por defecto)
        this.sprite = scene.add.sprite(x, y, 'player_idle1');
        this.sprite.setScale(2);
        this.sprite.setOrigin(0.5, 0.5);
        
        // Física
        scene.physics.add.existing(this.sprite);
        this.body = this.sprite.body;
        this.body.setGravityY(550);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(10, 14);
        this.body.setOffset(2, 2);
        
        // Stats
        this.speed = 280;
        this.jumpForce = -580;
        
        // Controles
        this.keys = scene.input.keyboard.createCursorKeys();
        
        // Animación
        this.animTimer = 0;
        this.currentAnim = 'idle';
        this.frameIndex = 0;
        
        // Efectos visuales
        this.breatheTimer = 0;
    }

    update() {
        if (!this.sprite || !this.body) return;
        
        const body = this.body;
        const grounded = body.blocked.down;
        this.isGrounded = grounded;
        
        // Movimiento horizontal
        let moveX = 0;
        let isMoving = false;
        
        if (this.keys.left.isDown) {
            moveX = -this.speed;
            this.facing = -1;
            isMoving = true;
        } else if (this.keys.right.isDown) {
            moveX = this.speed;
            this.facing = 1;
            isMoving = true;
        }
        
        // Aplicar dirección
        this.sprite.setFlipX(this.facing === -1);
        
        if (grounded) {
            body.setVelocityX(moveX);
        } else {
            body.setVelocityX(body.velocity.x * 0.92 + moveX * 0.15);
        }
        
        // Salto
        if (Phaser.Input.Keyboard.JustDown(this.keys.up) && grounded) {
            body.setVelocityY(this.jumpForce);
            this.isJumping = true;
            this.jumpHoldTime = 0;
            if (this.scene && this.scene.cameras) {
                this.scene.cameras.main.shake(30, 0.008);
            }
            this.createJumpParticles();
        }
        
        // Salto variable
        if (this.keys.up.isDown && this.isJumping && body.velocity.y < 0) {
            this.jumpHoldTime += 16;
            if (this.jumpHoldTime < this.maxJumpHold) {
                body.setVelocityY(body.velocity.y * 0.97);
            }
        }
        
        // Cortar salto al soltar
        if (Phaser.Input.Keyboard.JustUp(this.keys.up) && this.isJumping) {
            this.isJumping = false;
            if (body.velocity.y < -100) {
                body.setVelocityY(body.velocity.y * 0.5);
            }
        }
        
        if (grounded) this.isJumping = false;
        
        // ==========================================
        // ANIMACIONES
        // ==========================================
        this.updateAnimation(isMoving, grounded);
        
        this.updateBreathe();
    }

    updateAnimation(isMoving, grounded) {
        this.animTimer += 0.08;
        
        let animName = 'idle';
        
        if (!grounded) {
            animName = 'jump';
        } else if (isMoving) {
            animName = 'run';
        } else {
            animName = 'idle';
        }
        
        // Cambiar sprite según animación
        if (animName === 'idle') {
            const frame = Math.floor(this.animTimer % 2) + 1;
            this.sprite.setTexture(`player_idle${frame}`);
        } else if (animName === 'run') {
            const frame = Math.floor(this.animTimer % 2) + 1;
            this.sprite.setTexture(`player_run${frame}`);
        } else if (animName === 'jump') {
            this.sprite.setTexture('player_jump');
        }
    }

    createJumpParticles() {
        if (!this.scene || !this.scene.add) return;
        
        for (let i = 0; i < 5; i++) {
            const particle = this.scene.add.circle(
                this.sprite.x + (Math.random() - 0.5) * 10,
                this.sprite.y + 8,
                2,
                0x00ffff,
                0.5
            );
            this.scene.tweens.add({
                targets: particle,
                y: particle.y + 20 + Math.random() * 20,
                alpha: 0,
                duration: 300 + Math.random() * 200,
                onComplete: () => particle.destroy()
            });
        }
    }

    updateBreathe() {
        this.breatheTimer += 0.02;
        const breathe = Math.sin(this.breatheTimer) * 0.5;
        this.sprite.y += breathe * 0.05;
    }

    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.body.setVelocity(0, 0);
    }
}