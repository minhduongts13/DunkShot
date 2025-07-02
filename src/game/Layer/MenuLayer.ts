// MenuLayer.ts
import Phaser from 'phaser';

export default class MenuLayer extends Phaser.GameObjects.Layer {
	private logo!: Phaser.GameObjects.Image;
	private dragImg!: Phaser.GameObjects.Image;
	private settingBtn!: Phaser.GameObjects.Image;
	private darkmodeBtn!: Phaser.GameObjects.Image;
	private newBallBtn!: Phaser.GameObjects.Image;

	constructor(scene: Phaser.Scene) {
		super(scene);

		const { width, height } = scene.scale;

		// Logo
		this.logo = scene.add.image(185, 130, 'menu-logo').setScale(0.9);
		this.add(this.logo);

		this.dragImg = scene.add.image(100, 450, 'drag-it').setScale(0.35);
		this.add(this.dragImg);
		scene.tweens.add({
			targets: this.dragImg,
			x: 50, y: 500,
			ease: 'Sine',
			duration: 600,
			delay: 200,
			yoyo: true,
			repeat: -1
		});
		
		// Settings button
		this.settingBtn = scene.add
			.image(45, 30, 'settingButton')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => this.onSettings());
		this.add(this.settingBtn);

		// Dark mode button
		this.darkmodeBtn = scene.add
			.image(90, 30, 'lightmode')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => this.onToggleDark());
		this.add(this.darkmodeBtn);

		// New ball button
		this.newBallBtn = scene.add
			.image(width - 115, height - 90, 'newBall')
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => this.onToggleDark());
		this.add(this.newBallBtn);

		// Anywhere click to start game
		scene.input.once('drag', () => {
			this.fadeOut();
		});

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
		// TODO: bật/tắt theme
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
}
