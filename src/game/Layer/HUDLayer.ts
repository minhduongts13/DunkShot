// HUDLayer.ts
import Phaser from 'phaser';
import PointManager from '../Manager/PointManager';

export default class HUDLayer extends Phaser.GameObjects.Layer implements ILayer{
    private pause: Phaser.GameObjects.Image;
    private scoreText : Phaser.GameObjects.Text;
    

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.setVisible(false);
        const { width, height } = scene.scale;

        this.scoreText = scene.add.text(
                    width / 2,
                    height * 0.05,
                    '0',
                    {
                        font: '48px sans-serif',
                        color: '#B2B2B2',
                        align: 'center'
                    }
                )
                    .setOrigin(0.5, 0)       
                    .setScrollFactor(0);
		this.add(this.scoreText);
        
        this.pause = scene.add
            .image(40, 30, 'pause')
            .setScale(0.7)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {});
		this.add(this.pause);

        scene.events.on('update', this.onSceneUpdate, this);
        scene.add.existing(this);
    }

    public fadeIn(duration: number = 300) {
        this.setVisible(true);
        this.setAlpha(0);
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration,
            ease: 'Linear'
        });
    }

    /** Fade out the menu layer */
    public fadeOut(duration: number = 300) {
        this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration,
        ease: 'Linear',
        onComplete: () => {
            this.setVisible(false);
        }
        });
    }

    private onSceneUpdate(time: number, delta: number) {
        this.scoreText.setText(PointManager.getCurrentScore().toString());
    }
}
