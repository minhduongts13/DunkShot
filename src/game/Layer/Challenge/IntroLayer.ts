// IntroLayer.ts
import Phaser from 'phaser';
import PointManager from '../../Manager/PointManager';

export default class IntroLayer extends Phaser.GameObjects.Container {
    private panel: Phaser.GameObjects.Graphics;
    private uibg: Phaser.GameObjects.Image;
    private playBtn: Phaser.GameObjects.Image;
    private titleText: Phaser.GameObjects.Text;
    private rewardText: Phaser.GameObjects.Text;
    private infoText: Phaser.GameObjects.Text;
    private itemSprite: Phaser.GameObjects.Image;
    private currentScene: Phaser.Scene & IChallengeScene & IGameScene;

    constructor(scene: Phaser.Scene & IChallengeScene & IGameScene) {
        super(scene, 0, 0);
        this.setDepth(100);
        this.currentScene = scene;
        // this.setVisible(false);
        const { width, height } = scene.scale;

        const blocker = scene.add.rectangle(0, 0, width, height, 0xFFFFFF, 0.4)
            .setOrigin(0)
            .setScrollFactor(0)
            .setInteractive();   
        this.add(blocker);

        this.panel = scene.add.graphics().setScrollFactor(0);
        const panelW = width * 0.8;
        const panelH = height * 0.35;
        const panelX = width/2 - panelW/2;
        const panelY = height/2 - panelH/2;
        this.panel.fillStyle(0xffffff, 1);
        this.panel.fillRoundedRect(panelX, panelY, panelW, panelH, 20);
        this.add(this.panel);

        this.titleText = scene.add.text(width/2, panelY + 30, `CHALLENGE ${PointManager.getCurrentLevel()}`, {
            font: '24px sans-serif',
            color: '#555555'
        })
            .setScrollFactor(0)
            .setOrigin(0.5);
        this.add(this.titleText);

        this.uibg = scene.add.image(width/2, panelY + 100, 'intro-challenge-ui')
            .setScrollFactor(0)
        this.add(this.uibg);
        
        this.infoText = scene.add.text(width/2 - 50, panelY + 100, 
        `Complete in ${scene.getTimeLimit()} seconds`, {
            font: '18px sans-serif',
            color: '#FFFFFF'
        })
            .setScrollFactor(0)
            .setOrigin(0.5);
        this.add(this.infoText);

        this.rewardText = scene.add.text(width/2 + 110, panelY + 75, 
        `Reward`, {
            font: '14px sans-serif',
            color: '#FFFFFF'
        })
            .setScrollFactor(0)
            .setOrigin(0.5);
        this.add(this.rewardText);

        this.itemSprite = scene.add.image(
            width/2 + 110, panelY + 105, 'star5'
        )
            .setScrollFactor(0)
            .setScale(0.3)
            .setOrigin(0.5);
        this.add(this.itemSprite);

        this.playBtn = scene.add.image(width/2, panelY + 180, 'btn-play')
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => {
                this.fadeOut();
            });
        this.add(this.playBtn);

        scene.add.existing(this);
    }

    public fadeIn(duration: number = 300) {
        this.titleText.setText(`CHALLENGE ${PointManager.getCurrentLevel()}`);
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
