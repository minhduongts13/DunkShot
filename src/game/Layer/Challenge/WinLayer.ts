// WinLayer.ts
import Phaser from 'phaser';
import PointManager from '../../Manager/PointManager';

export default class WinLayer extends Phaser.GameObjects.Container {
    private panel: Phaser.GameObjects.Graphics;
    private okBtn: Phaser.GameObjects.Image;
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

        this.titleText = scene.add.text(width/2, panelY + 30, `CHALLENGE ${PointManager.getCurrentLevel()} COMPLETED`, {
            font: '20px sans-serif',
            color: '#555555'
        })
            .setScrollFactor(0)
            .setOrigin(0.5);
        this.add(this.titleText);

        this.infoText = scene.add.text(width/2, panelY + 70, 
        `REWARD RECEIVED!`, {
            font: '18px sans-serif',
            color: '#38D133'
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

        this.okBtn = scene.add.image(width/2, btnY, 'btn-ok')
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => {
                this.fadeOut();
            });
        this.add(this.okBtn);

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
        this.titleText.setText(`CHALLENGE ${PointManager.getCurrentLevel()} COMPLETED`);
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
            onComplete: () => {
                this.setVisible(false)
                PointManager.setCurrentLevel((PointManager.getCurrentLevel() + 1)%3);
                PointManager.saveCurrentLevel();
                (this.currentScene as IGameScene).reset();
            }
        });
    }
}
