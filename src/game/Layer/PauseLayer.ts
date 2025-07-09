// PauseLayer.ts
import Phaser from 'phaser';
import PointManager from '../Manager/PointManager';
import { Challenge1 } from '../scenes/Challenge1';
import Settings from '../Manager/Settings';

export default class PauseLayer extends Phaser.GameObjects.Layer implements ILayer {
    private title!: Phaser.GameObjects.Text;
    private starCount!: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Container[] = [];

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
        // Background panel
        const panel = scene.add.rectangle(width * 0.5, height * 0.5, width * 2, height * 2, Settings.get('darkmode') ? 0x414141: 0xDEDEDE)
			.setScrollFactor(0)

        this.add(panel);
        scene.events.on('darkmode', () =>{
            panel.setFillStyle(Settings.get('darkmode') ? 0x414141: 0xDEDEDE);
        });

        // Title bar
        const titleBg = scene.add.rectangle(width / 2, 0, width, height * 0.15, Settings.get('darkmode') ? 0x393939: 0xC4C4C4)
			.setScrollFactor(0)

            // .setOrigin(0.5, 0.5);
        this.add(titleBg);
        scene.events.on('darkmode', () =>{
            titleBg.setFillStyle(Settings.get('darkmode') ? 0x393939: 0xC4C4C4);
        });
        this.title = scene.add.text(width / 2, 13, 'PAUSED', { font: '24px sans-serif', color: '#ffffff' })
            .setOrigin(0.5, 0)
			.setScrollFactor(0)
        this.add(this.title);

        // Star count
        const starIcon = scene.add.image(width * 0.77, 25, 'star0').setScale(1).setScrollFactor(0);
        this.starCount = scene.add.text(width * 0.82, 25, `x ${PointManager.getMoney()}`, { font: '24px sans-serif', color: '#fb8925' })
            .setOrigin(0, 0.5)
            .setScrollFactor(0);
        this.add(starIcon);
        this.add(this.starCount);

        // Buttons config
        const keys = ['menu', 'customize', 'resume'];
        const actions = [
            () => { 
                this.fadeOut();
                scene.scene.start('Game');
            },
            () => {
                // this.fadeOut();
                scene.scene.pause('Game')
                scene.scene.launch('Customize');
            },
            () => {
                this.fadeOut();
                scene.resumeScene();
            }
        ];
        for (let i = 0; i < 2; i++){
            const button = scene.add.image(width/2, height * 0.3 + i * 70, keys[i])
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', actions[i]);
            this.add(button);
        }
        const button = scene.add.image(width/2, height * 0.3 + 150, keys[2])
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', actions[2]);
        this.add(button);

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
