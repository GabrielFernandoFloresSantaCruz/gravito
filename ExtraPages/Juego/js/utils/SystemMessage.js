// js/utils/SystemMessage.js
export default class SystemMessage {
    constructor(scene, x, y, text, color = '#00ffff', duration = 2500) {
        if (!scene || !scene.add) return;

        try {
            const bg = scene.add.graphics();
            bg.fillStyle(0x0a0a1a, 0.9);
            bg.fillRoundedRect(x - 120, y - 16, 240, 32, 4);
            bg.lineStyle(1, 0x00ffff, 0.2);
            bg.strokeRoundedRect(x - 120, y - 16, 240, 32, 4);
            
            const textObj = scene.add.text(x, y, text, {
                fontSize: '14px',
                color: color || '#00ffff',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            
            const icon = scene.add.text(x - 100, y, '>', {
                fontSize: '14px',
                color: color || '#00ffff',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            icon.alpha = 0.5;
            
            const container = scene.add.container(x, y - 10, [bg, textObj, icon]);
            container.alpha = 0;
            
            scene.tweens.add({
                targets: container,
                alpha: 1,
                y: y,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    if (icon && icon.active) {
                        scene.tweens.add({
                            targets: icon,
                            alpha: 0.2,
                            duration: 200,
                            yoyo: true,
                            repeat: 2
                        });
                    }
                    
                    if (container && container.active) {
                        scene.time.delayedCall(duration, () => {
                            if (container && container.active) {
                                scene.tweens.add({
                                    targets: container,
                                    alpha: 0,
                                    y: container.y - 10,
                                    duration: 300,
                                    onComplete: () => {
                                        if (container && container.active) {
                                            container.destroy();
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } catch (e) {
            console.warn('SystemMessage error:', e);
        }
    }
}