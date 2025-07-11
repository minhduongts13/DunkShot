// SettingsLayer.ts
import Phaser from 'phaser';
import PointManager from '../Manager/PointManager';
import Settings from '../Manager/Settings';


export default class SettingsLayer extends Phaser.GameObjects.Layer implements ILayer {
    private title!: Phaser.GameObjects.Text;
    private back: Phaser.GameObjects.Image;
    private starCount!: Phaser.GameObjects.Text;
    private darkmodeSound: Phaser.Sound.BaseSound[] = [];
    

    constructor(scene: Phaser.Scene & IGameScene) {
        super(scene);
        this.setDepth(100);
        this.setVisible(false);
        const { width, height } = scene.scale;
        // Sounds
		this.darkmodeSound.push(scene.sound.add('darkmode-day'))
		this.darkmodeSound.push(scene.sound.add('darkmode-night'))

        const blocker = scene.add
			.rectangle(0, 0, width, height, 0x000000, 0)
			.setOrigin(0)
			.setScrollFactor(0)
			.setInteractive();   
		this.add(blocker);

        // Background panel
        const panel = scene.add.rectangle(width * 0.5, height * 0.5, width * 2, height * 2, Settings.get('darkmode') ? 0x414141: 0xDEDEDE)
            .setScrollFactor(0);
        scene.events.on('darkmode', () =>{
            panel.setFillStyle(Settings.get('darkmode') ? 0x414141: 0xDEDEDE);
        });
        this.add(panel);

        // Title bar
        const titleBg = scene.add.rectangle(width / 2, 0, width, height * 0.15, Settings.get('darkmode') ? 0x393939: 0xC4C4C4)
            .setScrollFactor(0);
        scene.events.on('darkmode', () =>{
            titleBg.setFillStyle(Settings.get('darkmode') ? 0x393939: 0xC4C4C4);
        });
        this.add(titleBg);
        this.title = scene.add.text(width / 2, 13, 'SETTINGS', { font: '24px sans-serif', color: '#ffffff' })
            .setOrigin(0.5, 0)
            .setScrollFactor(0);
        this.add(this.title);
        
        // Back
        this.back = scene.add.image(30, 0, 'back')
            .setOrigin(0.5,0)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => {
                this.fadeOut();
            });

        this.add(this.back);

        // Star count
        const starIcon = scene.add.image(width * 0.77, 25, 'star0').setScale(1).setScrollFactor(0);
        this.starCount = scene.add.text(width * 0.82, 25, `x ${PointManager.getMoney()}`, { font: '24px sans-serif', color: '#fb8925' })
            .setOrigin(0, 0.5)
            .setScrollFactor(0);
        this.add(starIcon);
        this.add(this.starCount);

        // Toggle buttons
        const labels = ['SOUNDS', 'VIBRATION', 'DARK MODE'];
        const keys = ['sounds', 'vibration', 'darkmode'];
        const toggleYStart = height * 0.25;
        

        labels.forEach((label, index) => {
            const y = toggleYStart + index * 70;

            const text = scene.add.text(width * 0.15, y, label, {
                font: '24px sans-serif',
                color: '#9B9B9B'
            }).setOrigin(0, 0.5).setScrollFactor(0);
            this.add(text);

            const toggleKey = keys[index];
            const toggle = scene.add.image(width * 0.85, y, Settings.get(toggleKey) ? "toggle-on" : "toggle-off")
                .setScale(1)
                .setScrollFactor(0)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    Settings.add(toggleKey, !Settings.get(toggleKey));
                    toggle.setTexture(Settings.get(toggleKey) ? "toggle-on" : "toggle-off");
                    scene.events.emit(toggleKey);
                    if (toggleKey == 'sounds'){
                        if (Settings.get(toggleKey)){
                            this.darkmodeSound[1].play();
                            scene.sound.mute = false;
                        }
                        else {
                            scene.sound.mute = true;
                        }
                    }
                    else {
                        if (Settings.get(toggleKey)){
                            this.darkmodeSound[1].play();
                        }
                        else this.darkmodeSound[0].play();
                    }
                });
            scene.events.on(toggleKey, () =>{
                toggle.setTexture(Settings.get(toggleKey) ? 'toggle-on': 'toggle-off');
            });
            this.add(toggle);
        });

        // CLEAR DATA button
        const buttonBg = scene.add.rectangle(width / 2, height * 0.75, 200, 60, 0xffffff, 1)
            .setStrokeStyle(3, 0x9B9B9B, 1)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .setOrigin(0.5)
            .on('pointerdown', () => {
                window.location.reload();
                PointManager.clearData();
            });
        this.add(buttonBg);
        const buttonText = scene.add.text(width / 2, height * 0.75, 'CLEAR DATA', {
            font: '20px sans-serif',
            color: '#9B9B9B'
        })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                PointManager.clearData();
                window.location.reload();
            });
        this.add(buttonText);

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
