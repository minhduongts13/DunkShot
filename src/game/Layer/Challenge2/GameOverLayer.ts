// GameOverLayer.ts
import Phaser from 'phaser';
import PointManager from '../../Manager/PointManager';
import { Challenge2 } from '../../scenes/Challenge2';
import { GAMEKEY } from '../../../Constant';

export default class GameOverLayer extends Phaser.GameObjects.Layer implements ILayer{
    private logo!: Phaser.GameObjects.Image;
    private dragImg!: Phaser.GameObjects.Image;
    private settingBtn!: Phaser.GameObjects.Image;
    private likeBtn!: Phaser.GameObjects.Image;
    private restartBtn!: Phaser.GameObjects.Image;
    private newBallBtn!: Phaser.GameObjects.Image;
    private failedText: Phaser.GameObjects.Text;
    private scoreText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene & IGameScene) {
        super(scene);
        this.setVisible(false);
        const { width, height } = scene.scale;
        const blocker = scene.add
			.rectangle(0, 0, width, height, 0x000000, 0)
			.setOrigin(0)
			.setScrollFactor(0)
			.setInteractive();   // <-- đây sẽ "ăn" mọi sự kiện
		this.add(blocker);
        this.failedText = scene.add.text(
            180,
            50,
            'Challenge 2 Failed',
            {
                font: '32px sans-serif',
                color: '#FB8925',
                align: 'center'
            }
        )
            .setOrigin(0.5, 0)       
            .setScrollFactor(0);

        this.add(this.failedText);
        
        // Settings button
        this.settingBtn = scene.add
            .image(width - 90, height - 120, 'settingCircle')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => scene.getLayers(GAMEKEY.SCENE.CHALLENGE.LAYERKEY.SETTINGS).fadeIn());
        this.add(this.settingBtn);

        this.likeBtn = scene.add
            .image(width - 260, height - 120, 'like')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => window.open('https://www.facebook.com/minhduongts13', '_blank'));
        this.add(this.likeBtn);

        this.restartBtn = scene.add
            .image(width - 175, height - 120, 'restart')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onRestart());
        this.add(this.restartBtn);

        // New ball button
        this.newBallBtn = scene.add
            .image(width - 175, height - 200, 'newBall')
            .setScale(1.4)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                scene.scene.pause('Game')
                scene.scene.launch('Customize');
            });
        this.add(this.newBallBtn);

        scene.add.existing(this);
    }

    // Khi click darkmode
    private onRestart() {
        (this.scene as Challenge2).reset();
        this.fadeOut();
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

    /** Fade out the GameOver layer */
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
}
