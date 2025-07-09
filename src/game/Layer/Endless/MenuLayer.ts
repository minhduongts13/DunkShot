// MenuLayer.ts
import Phaser from 'phaser';
import { Game } from '../../scenes/Game';
import HUDLayer from '../Endless/HUDLayer';
import PointManager from '../../Manager/PointManager';
import { GAMEKEY } from '../../../Constant';
import Settings from '../../Manager/Settings';

export default class MenuLayer extends Phaser.GameObjects.Layer implements ILayer{
	private logo!: Phaser.GameObjects.Image;
	private dragImg!: Phaser.GameObjects.Image;
	private settingBtn!: Phaser.GameObjects.Image;
	private darkmodeBtn!: Phaser.GameObjects.Image;
	private newBallBtn!: Phaser.GameObjects.Image;
	private challengeBtn!: Phaser.GameObjects.Image;
	private dragCB : (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => void;
	private darkmodeSound: Phaser.Sound.BaseSound[] = [];
	private logoSound: Phaser.Sound.BaseSound;

	constructor(scene: Phaser.Scene & IGameScene) {
		super(scene);
		this.setVisible(false);
		const { width, height } = scene.scale;
		// Sounds
		this.darkmodeSound.push(scene.sound.add('darkmode-day'))
		this.darkmodeSound.push(scene.sound.add('darkmode-night'))
		this.logoSound = scene.sound.add('logo');

		// Logo
		this.logo = scene.add.image(185, 140, 'menu-logo').setScale(0.9).setScrollFactor(0);
		this.add(this.logo);

		this.dragImg = scene.add.image(100, 450, 'drag-it').setScale(0.35).setScrollFactor(0);
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
			.setScrollFactor(0)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => scene.getLayers(GAMEKEY.SCENE.GAME.LAYERKEY.SETTINGS).fadeIn());
		this.add(this.settingBtn);

		// Dark mode button
		this.darkmodeBtn = scene.add
			.image(90, 30, 'lightmode')
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				Settings.add('darkmode', !Settings.get('darkmode'));
				if (Settings.get('darkmode')){
					this.darkmodeBtn.setTexture('darkmode');
					this.darkmodeSound[1].play();
				}
				else {
					this.darkmodeSound[0].play();
					this.darkmodeBtn.setTexture('lightmode');
				}
                scene.events.emit('darkmode');
			});
		this.add(this.darkmodeBtn);

		// New ball button
		this.newBallBtn = scene.add
			.image(width - 115, height - 90, 'newBall')
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				scene.scene.pause('Game');
				scene.scene.launch('Customize');
			});
		this.add(this.newBallBtn);
		
		this.challengeBtn = scene.add
			.image(width - 115, height - 150, 'challenge')
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => {
				scene.scene.pause('Game');
				scene.scene.launch(`Challenge${PointManager.getCurrentLevel()}`)}
			);
			
		this.add(this.challengeBtn);

		scene.add.existing(this);
		this.fadeIn();
	}


	public fadeIn(duration: number = 300) {
		this.logoSound.play();
		this.setVisible(true);
		this.setAlpha(0);
		this.scene.tweens.add({
			targets: this,
			alpha: 1,
			duration,
			ease: 'Linear'
		});
		// Anywhere click to start game
		this.dragCB = () => {
			this.fadeOut();
			((this.scene as Game).getLayers(0) as HUDLayer).fadeIn();
		}
		this.scene.input.once('drag', this.dragCB);
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
