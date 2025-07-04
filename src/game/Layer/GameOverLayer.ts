// GameOverLayer.ts
import Phaser from 'phaser';
import { Game } from '../scenes/Game';
import HUDLayer from './HUDLayer';

export default class GameOverLayer extends Phaser.GameObjects.Layer implements ILayer{
    private logo!: Phaser.GameObjects.Image;
    private dragImg!: Phaser.GameObjects.Image;
    private settingBtn!: Phaser.GameObjects.Image;
    private likeBtn!: Phaser.GameObjects.Image;
    private restartBtn!: Phaser.GameObjects.Image;
    private newBallBtn!: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        super(scene);
		this.setVisible(false);
        const { width, height } = scene.scale;
        
        // Settings button
        this.settingBtn = scene.add
            .image(45, 30, 'settingCircle')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onSettings());
        this.add(this.settingBtn);

        this.likeBtn = scene.add
            .image(90, 30, 'like')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onToggleDark());
        this.add(this.likeBtn);

        this.restartBtn = scene.add
            .image(90, 30, 'restart')
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onToggleDark());
        this.add(this.restartBtn);

        // New ball button
        this.newBallBtn = scene.add
            .image(width - 175, height - 200, 'newBall')
            .setScale(1.4)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onToggleDark());
        this.add(this.newBallBtn);


        // Thêm layer vào scene
        scene.add.existing(this);
    }

    // Khi click setting
    private onSettings() {
        console.log('Open settings panel');
        // TODO: hiện panel cài đặt
    }

    // Khi click darkmode
    private onToggleDark() {
        console.log('Toggle dark mode');
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
