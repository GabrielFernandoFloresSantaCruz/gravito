export default class Trail {
    constructor(scene) {
        this.scene = scene;
        this.points = [];
        this.graphics = scene.add.graphics();
        this.glowGraphics = scene.add.graphics();
        this.active = false;
        this.maxPoints = 200;
        this.energy = 100;
        this.maxEnergy = 100;
        this.drainRate = 0.2;
        this.rechargeRate = 0.8;
        this.pulseTimer = 0;
    }

    activate() {
        if (this.energy <= 0) return;
        this.active = true;
        this.points = [];
    }

    deactivate() {
        this.active = false;
        if (this.graphics) this.graphics.clear();
        if (this.glowGraphics) this.glowGraphics.clear();
        this.points = [];
    }

    update(player) {
        if (!player || !player.sprite) return;

        if (this.active) {
            this.energy -= this.drainRate;
            if (this.energy <= 0) {
                this.energy = 0;
                this.deactivate();
                return;
            }
        } else {
            this.energy = Math.min(this.maxEnergy, this.energy + this.rechargeRate);
        }

        if (!this.active) {
            if (this.points.length > 0) {
                this.points = [];
                if (this.graphics) this.graphics.clear();
                if (this.glowGraphics) this.glowGraphics.clear();
            }
            return;
        }

        if (player && player.sprite) {
            this.points.push({ 
                x: player.sprite.x, 
                y: player.sprite.y 
            });
            
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
        }

        this.pulseTimer += 0.02;
        this.draw();
    }

    draw() {
        if (!this.graphics || !this.glowGraphics) return;
        
        this.graphics.clear();
        this.glowGraphics.clear();
        
        if (this.points.length < 2) return;

        const pulse = Math.sin(this.pulseTimer) * 0.2 + 0.8;

        for (let i = 1; i < this.points.length; i++) {
            const progress = i / this.points.length;
            const alpha = 0.1 + progress * 0.9 * pulse;
            const width = 1 + progress * 4;
            const hue = 180 + progress * 20;
            const color = Phaser.Display.Color.HSLToColor(hue / 360, 1, 0.5).color;
            
            this.graphics.lineStyle(width, color, alpha);
            this.graphics.lineBetween(
                this.points[i-1].x, this.points[i-1].y,
                this.points[i].x, this.points[i].y
            );
        }

        if (this.points.length > 5) {
            const last = this.points.length - 1;
            const start = Math.max(0, last - 20);
            for (let i = start; i < last; i++) {
                const progress = (i - start) / (last - start);
                const alpha = progress * 0.3 * pulse;
                this.glowGraphics.lineStyle(6, 0x00ffff, alpha);
                this.glowGraphics.lineBetween(
                    this.points[i].x, this.points[i].y,
                    this.points[i+1].x, this.points[i+1].y
                );
            }
        }

        if (this.points.length > 0) {
            const last = this.points[this.points.length - 1];
            this.graphics.fillStyle(0x00ffff, 1);
            this.graphics.fillCircle(last.x, last.y, 3);
            this.glowGraphics.fillStyle(0x00ffff, 0.3 * pulse);
            this.glowGraphics.fillCircle(last.x, last.y, 10);
            this.glowGraphics.fillStyle(0x00ffff, 0.1 * pulse);
            this.glowGraphics.fillCircle(last.x, last.y, 20);
        }
    }

    hitsObject(obj, radius = 20) {
        if (!this.active || this.points.length < 5 || !obj) return false;
        
        const start = Math.max(0, this.points.length - 30);
        for (let i = start; i < this.points.length; i++) {
            if (!this.points[i]) continue;
            const distance = Phaser.Math.Distance.Between(
                obj.x, obj.y,
                this.points[i].x, this.points[i].y
            );
            if (distance < radius) return true;
        }
        return false;
    }

    getEnergyPercent() {
        return this.energy / this.maxEnergy;
    }
}