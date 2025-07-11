// PauseLayer.ts
import Phaser from 'phaser';

export default class PauseLayer extends Phaser.GameObjects.Container {
    private panel: Phaser.GameObjects.Graphics;
    private closeBtn: Phaser.GameObjects.Image;
    private giveUpBtn: Phaser.GameObjects.Image;
    private restartBtn: Phaser.GameObjects.Image;
    private titleText: Phaser.GameObjects.Text;
    private infoText: Phaser.GameObjects.Text;
    private itemSprite: Phaser.GameObjects.Image;
    private currentScene: Phaser.Scene & IChallengeScene & IGameScene;

    constructor(scene: Phaser.Scene & IChallengeScene & IGameScene) {
        super(scene, 0, 0);
        this.setDepth(100);
        this.currentScene = scene;
        this.setVisible(false);
        const { width, height } = scene.scale;

        const blocker = scene.add.rectangle(0, 0, width, height, 0xFFFFFF, 0.4)
			.setOrigin(0)
			.setScrollFactor(0)
			.setInteractive();   
		this.add(blocker);

        this.panel = scene.add.graphics().setScrollFactor(0);
        const panelW = width * 0.8;
        const panelH = height * 0.45;
        const panelX = width/2 - panelW/2;
        const panelY = height/2 - panelH/2;
        this.panel.fillStyle(0xffffff, 1);
        this.panel.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
        this.add(this.panel);

        this.titleText = scene.add.text(width/2, panelY + 30, 'PAUSED', {
            font: '24px sans-serif',
            color: '#555555'
        })
            .setScrollFactor(0)
            .setOrigin(0.5);
        this.add(this.titleText);

        this.infoText = scene.add.text(width/2, panelY + 70, 
        `Hoops completed ${scene.getCurrentHoop()}/${scene.getNumHoop()}`, {
            font: '18px sans-serif',
            color: '#3BA4E6'
        })
            .setScrollFactor(0)
            .setOrigin(0.5);
        this.add(this.infoText);

        this.itemSprite = scene.add.image(
            width/2, panelY + panelH/2, 'star5'
        )
            .setScrollFactor(0)
            .setOrigin(0.5);
        this.add(this.itemSprite);

        const btnY = panelY + panelH - 50;
        this.giveUpBtn = scene.add.image(width/2 - 80, btnY, 'btn-giveup')
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => {
                this.fadeOut();
                scene.resumeScene();
                scene.reset();
                scene.scene.setVisible(false);
                scene.scene.pause('Challenge');
                scene.scene.setVisible(true, 'Game');
                scene.scene.resume('Game');
            });

        this.restartBtn = scene.add.image(width/2 + 80, btnY, 'btn-restart')
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => {
                this.fadeOut();
                scene.resumeScene();
                scene.reset();
            });
        this.add([ this.giveUpBtn, this.restartBtn ]);

        this.closeBtn = scene.add.image(panelX + panelW - 2, panelY + 2, 'btn-close')
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => {
                this.fadeOut();
            })
        this.add(this.closeBtn);

        scene.add.existing(this);
    }

    // Hiện/ẩn layer
    public show() {
        this.setVisible(true);
    }
    public hide() {
        this.setVisible(false);
    }

    public fadeIn(duration: number = 300) {
        this.infoText.setText(`Hoops completed ${this.currentScene.getCurrentHoop()}/${this.currentScene.getNumHoop()}`);
        this.setVisible(true);
        this.setAlpha(0);
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration,
            ease: 'Linear'
        });
    }

    public fadeOut(duration: number = 300) {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration,
            ease: 'Linear',
            onComplete: () => this.setVisible(false)
        });
    }
}
