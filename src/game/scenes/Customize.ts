// Customize.ts
import Phaser from 'phaser';
import PointManager from '../Manager/PointManager';
import Settings from '../Manager/Settings';
import { GAMEKEY } from '../../Constant';

export default class Customize extends Phaser.Scene {
    private icons: Phaser.GameObjects.Image[] = [];
    private overlays: Phaser.GameObjects.Arc[] = [];
    private priceTexts: Phaser.GameObjects.Text[] = [];
    private selectedFrame?: Phaser.GameObjects.Arc;
    private title!: Phaser.GameObjects.Text;
    private back: Phaser.GameObjects.Image;
    private starCount!: Phaser.GameObjects.Text;
    private sounds : Phaser.Sound.BaseSound[] = [];
    constructor() {
        super('Customize');
    }

    create() {
        const { width, height } = this.scale;
        // Sound
        this.sounds.push(this.sound.add('shop-buy'));
        this.sounds.push(this.sound.add('shop-lock'));
        this.sounds.push(this.sound.add('shop-select'));

        this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
        .setOrigin(0)
        .setInteractive();

        // Background panel
        const panel = this.add.rectangle(width * 0.5, height * 0.5, width * 2, height * 2, Settings.get('darkmode') ? 0x414141: 0xDEDEDE)
            .setScrollFactor(0);
        this.events.on('darkmode', () =>{
            panel.setFillStyle(Settings.get('darkmode') ? 0x414141: 0xDEDEDE);
        });

        // Title bar
        const titleBg = this.add.rectangle(width / 2, 0, width, height * 0.15, Settings.get('darkmode') ? 0x393939: 0xC4C4C4)
            .setScrollFactor(0);
        this.events.on('darkmode', () =>{
            titleBg.setFillStyle(Settings.get('darkmode') ? 0x393939: 0xC4C4C4);
        });

        this.title = this.add.text(width / 2, 13, 'SETTINGS', { font: '24px sans-serif', color: '#ffffff' })
            .setOrigin(0.5, 0)
            .setScrollFactor(0);

        
        // Back
        this.back = this.add.image(30, 0, 'back')
            .setOrigin(0.5,0)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .on('pointerdown', () => {
                PointManager.saveMoney();
                this.scene.stop('Customize');
                this.scene.resume('Game');
            });


        // Star count
        const starIcon = this.add.image(width * 0.77, 25, 'star0').setScale(1).setScrollFactor(0);
        this.starCount = this.add.text(width * 0.82, 25, `x ${PointManager.getMoney()}`, { font: '24px sans-serif', color: '#fb8925' })
            .setOrigin(0, 0.5)
            .setScrollFactor(0);

        // parameters grid
        const cols = 4, rows = 5;
        const padding = 20;
        const cellW = (width - padding * 2) / cols;
        const cellH = (height - 100) / rows;

        for (let i = 0; i < cols * rows; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = padding + cellW * col + cellW / 2;
            const y = 80 + cellH * row + cellH / 2;

            // icon
            const key = `ball${i + 1}`; 
            const img = this.add.image(x, y, key).setScale(0.15);
            img.setInteractive({ useHandCursor: true });
            this.icons.push(img);
            
            // overlay & price
            const bought = (Settings.get(`ball${i + 1}`) || false) == true;
            if (!bought) {
                const baseRadius = img.width * 0.1 * 0.5;
                const circle = this.add.circle(x, y, baseRadius + 10, 0xCBCBCB, 1);
                img.setVisible(false);
                this.overlays.push(circle);

                const question = this.add.text(x, y, '?', {
                    font: `${baseRadius}px sans-serif`,
                    color: '#ffffff'
                }).setOrigin(0.5);
                this.priceTexts.push(question);
                circle.setInteractive({ useHandCursor: true });
                circle.on('pointerup', () => this.onIconClicked(i + 1));
            } else {
                this.overlays.push(null as any);
                this.priceTexts.push(null as any);
                img.on('pointerup', () => this.onIconClicked(i + 1));
            }

            // click handler
        }

        // selection frame
        const selSkin = Settings.get('ball') - 1;
        this.drawSelection(selSkin);
    }

    private onIconClicked(index: number) {
        const money = PointManager.getMoney();
        const bought = Settings.get(`ball${index}`) === true;

        if (bought) {
        // chỉ chọn
            Settings.add('ball', index);
            this.emitEvent();
            this.drawSelection(index - 1);
            this.sounds[2].play();
            return;
        }

        // chưa mua
        if (money >= 100) {
            PointManager.setMoney(money - 100);
            this.starCount.setText(`${PointManager.getMoney()}`);
            Settings.add(`ball${index}`, true);
            // xoá overlay và text
            this.overlays[index - 1].destroy();
            this.priceTexts[index - 1].destroy();
            this.icons[index - 1].setVisible(true);
            // chọn luôn
            Settings.add('ball', index);
            this.emitEvent();
            this.drawSelection(index - 1);
            this.sounds[0].play();
        } else {
            this.sounds[1].play();
            this.tweens.add({
                targets: this.starCount,
                x: this.starCount.x - 10,
                yoyo: true,
                repeat: 2,
                duration: 100
            });
        }
    }

    private drawSelection(index: number) {
        this.selectedFrame?.destroy();

        const img = this.icons[index];
        this.selectedFrame = this.add.circle(
        img.x, img.y,
        img.width * 0.1 * 0.75,
        0xffff00, 0).setStrokeStyle(3, 0xffff00);
        this.selectedFrame.setDepth(1);
    }

    private emitEvent(): void {
        this.scene.get('Game').events.emit('ball');
        this.scene.get('Challenge1').events.emit('ball');
        this.scene.get('Challenge2').events.emit('ball');

    }
}
