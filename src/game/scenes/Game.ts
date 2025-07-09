// Game.ts
import { Scene } from 'phaser';
import Ball from '../gameobject/Ball';
import Basket from '../gameobject/Basket/Basket';
import Walls from '../gameobject/Walls';
import MenuLayer from '../Layer/Endless/MenuLayer';
import PointManager from '../Manager/PointManager';
import HUDLayer from '../Layer/Endless/HUDLayer';
import Star from '../gameobject/Star';
import { GAMEKEY } from '../../Constant';
import GameOverLayer from '../Layer/Endless/GameOverLayer';
import PauseLayer from '../Layer/PauseLayer';
import SettingsLayer from '../Layer/Settings';
import Settings from '../Manager/Settings';

export class Game extends Scene implements IGameScene, IHasDragZone
{
    private camera: Phaser.Cameras.Scene2D.Camera;
    private dragZone : Phaser.GameObjects.Zone;
    private basket1: Basket;
    private basket2: Basket;
    private ball: Ball;
    private layers: ILayer[];
    private money: Phaser.GameObjects.Text;
    private stars: Star[];
    private isGameOver: boolean = false;
    private is_perfect: boolean = true;
    private streak = 1;
    private scoreSound: Phaser.Sound.BaseSound[] = [];
    private borderSound: Phaser.Sound.BaseSound[] = [];
    private netSound: Phaser.Sound.BaseSound[] = [];
    private releaseSound: Phaser.Sound.BaseSound[] = [];
    private starSound: Phaser.Sound.BaseSound[] = [];
    private gameOverSound: Phaser.Sound.BaseSound;
    private walls: Walls;

    constructor ()
    {
        super('Game');
    }

    public create (): void
    {
		const { width, height } = this.scale;
        this.camera = this.cameras.main;
        this.camera.setBounds(0, -5000, width, height + 5000); 
        this.camera.setBackgroundColor(Settings.get('darkmode') ? '#414141' : '#DEDEDE');
        this.events.on('darkmode', () =>{
            this.camera.setBackgroundColor(Settings.get('darkmode') ? '#414141' : '#DEDEDE');
        });
        // Sounds
        this.scoreSound.push(this.sound.add('score-simple'));
        for (let i = 1; i <= 10; i++){
            this.scoreSound.push(this.sound.add(`score-perfect-${i}`));
        }
        this.borderSound.push(this.sound.add('border-0'));
        this.borderSound.push(this.sound.add('border-7'));
        this.borderSound.push(this.sound.add('border-10'));
        this.borderSound.push(this.sound.add('border-13'));
        this.borderSound.push(this.sound.add('border-16'));
        this.borderSound.push(this.sound.add('border-17'));
        this.borderSound.push(this.sound.add('border-32'));
        this.borderSound.push(this.sound.add('border-64'));
        this.netSound.push(this.sound.add('net-0'));
        this.netSound.push(this.sound.add('net-1'));
        this.netSound.push(this.sound.add('net-2'));
        this.releaseSound.push(this.sound.add('release-1'));
        this.releaseSound.push(this.sound.add('release-2'));
        this.releaseSound.push(this.sound.add('release-3'));
        for (let i = 1; i <= 7; i++){
            this.starSound.push(this.sound.add(`star-${i}`));
        }
        this.gameOverSound = this.sound.add('gameover')

        this.physics.world.setBounds(
            15,          // x
            0,          // y
            this.scale.width - 30,   // width
            this.scale.height,  // height
            true,  // collideLeft
            true,  // collideRight
            false, // collideTop
            false  // collideBottom
        );

        this.walls = new Walls(this);

        this.dragZone = this.add
            .zone(0, 0, width, height)
            .setOrigin(0)
			.setScrollFactor(0)
            .setInteractive({ draggable: true });
        this.ball = new Ball(this, 100, 380, `ball${Settings.get('ball')}`);
        this.ball.setCollideWorldBounds(true);
        const body = this.ball.body as Phaser.Physics.Arcade.Body;
        body.onWorldBounds = true;

        this.events.on('ball', () =>{
            this.ball.setTexture(`ball${Settings.get('ball')}`);
        });
        this.camera.startFollow(this.ball, false, 1, 1, 0, height*0.2);

        this.basket1 = new Basket(this, 100, 400, "empty");
        this.basket2 = new Basket(this, 250, 300, "empty");
        this.stars = [];
        this.stars.push(new Star(this, GAMEKEY.STAR.INITIAL_POS.x, GAMEKEY.STAR.INITIAL_POS.x, "star0"));
        this.stars.push(new Star(this, GAMEKEY.STAR.INITIAL_POS.x, GAMEKEY.STAR.INITIAL_POS.x, "star0"));

        this.createBallBasketPhysic(this.basket1, this.ball);
        this.createBallBasketPhysic(this.basket2, this.ball);
        this.creatStarBallPhysic();

        this.add.image(width - 80, 30, 'star0')
            
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {});
        this.money = this.add.text(
            width - 45,
            20,
            '0',
            {
                font: '20px sans-serif',
                color: '#FB8925',
                align: 'center'
            }
        )
            .setOrigin(0.5, 0)       
            .setScrollFactor(0);
        
        this.layers = [];
        this.layers.push(new HUDLayer(this));
        this.layers.push(new GameOverLayer(this));
        this.layers.push(new PauseLayer(this));
        this.layers.push(new MenuLayer(this));
        this.layers.push(new SettingsLayer(this));
        
    }

    public getDragZone(): Phaser.GameObjects.Zone {
        return this.dragZone;
    }

    public getLayers(index: number): ILayer{
        return this.layers[index];
    }

    private createBallBasketPhysic(basket : Basket, ball : Ball): void {
        this.physics.world.on('worldbounds', () => {
            this.borderSound[Math.floor(Math.random()*this.borderSound.length)].play();
        });

        this.physics.add.collider(ball, basket.getTopRim(), () => {
            this.is_perfect = false;
            this.borderSound[Math.floor(Math.random()*this.borderSound.length)].play();
        });
        this.physics.add.collider(ball, basket.getBottomRim(), () => {
            this.is_perfect = false;
            this.borderSound[Math.floor(Math.random()*this.borderSound.length)].play();
        });
        this.physics.add.collider(
            ball,
            basket.getSensor(),
            (_ballGO, _netGO) => {
                basket.transitionTo("ball");
                const b = _ballGO   as Phaser.Physics.Arcade.Image;
                b.setVelocity(0, 0);
                (b.body as Phaser.Physics.Arcade.Body).setAllowGravity(false); 
                b.setPosition(
                    basket.x,
                    ball.y
                );
                basket.shakeNet();
                ball.setAngularVelocity(0);
                const randomAngle = Math.floor(Math.random() * (25 - (-25) + 1)) + (-25);
                const randomX = Math.floor(Math.random() * (300 - 60 + 1)) + 60;
                if (basket == this.basket1){
                    if (ball.currentBasket == 1) return;
                    this.basket2.setPosition(randomX, this.basket2.y - 300);
                    this.basket2.setAngle(randomAngle);
                    this.basket2.customAngle(randomAngle*Math.PI/180);
                    const pos = this.basket2.getTopRim().getBounds();
                    if (Math.random() < 0.3) this.stars[0].spawn(pos.centerX, pos.centerY - 30);
                    ball.currentBasket = 1;
                    PointManager.setScore(PointManager.getCurrentScore() + 1);
                    this.scoreAnimation(this.basket1);
                }
                else {
                    if (ball.currentBasket == 2) return;
                    this.basket1.setPosition(randomX, this.basket1.y - 300);
                    this.basket1.setAngle(randomAngle);
                    this.basket1.customAngle(randomAngle*Math.PI/180);
                    const pos = this.basket1.getTopRim().getBounds();
                    if (Math.random() < 0.3) this.stars[1].spawn(pos.centerX, pos.centerY - 30);
                    ball.currentBasket = 2;
                    this.scoreAnimation(this.basket2);
                }
            },
            undefined,
            this,
        );

        this.physics.add.collider(
            ball,
            basket.getNet(),
            () => {
                this.netSound[Math.floor(Math.random()*this.netSound.length)].play();
            }
        );

        basket.on('netdrag', (worldBottom: Phaser.Math.Vector2) => {
            if (basket.getCurrentState() == "ball"){
                ball.setPosition(worldBottom.x, worldBottom.y);
    
                (ball.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
                (ball.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
            }
        });

        basket.on('shoot', (data: { angle: number; power: number }) => {
            if (data.power <= 60) this.releaseSound[0].play();
            else if (data.power <= 100) this.releaseSound[1].play();
            else this.releaseSound[2].play();
            basket.transitionTo("empty");
            (ball.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
            const speed = data.power * 10;
            ball.setVelocity(
                Math.cos(data.angle) * speed,
                Math.sin(data.angle) * speed
            );
        
            ball.setAngularVelocity(360);
        });
    }

    private creatStarBallPhysic(): void {
        this.stars.forEach((star: Star) => {
            this.physics.add.overlap(
                this.ball, star,
                () => {
                    this.starSound[Math.floor(Math.random()*this.starSound.length)].play();
                    (star.body as Phaser.Physics.Arcade.Body).enable = false;
                    star.disappear();
                    PointManager.setMoney(PointManager.getMoney() + 1);
                }
            );
        });
    }

    private scoreAnimation(basket: Basket): void {
        if (this.is_perfect) this.streak = Math.min(10, this.streak + 1);
        else this.streak = 1;
        PointManager.setScore(PointManager.getCurrentScore() + this.streak);
        this.scoreSound[this.streak - 1].play();

        const rimTopOriginal = basket.getTopRim();
        const rimBottomOriginal = basket.getBottomRim();

        const topPos = rimTopOriginal.getBounds();
        const botPos  = rimBottomOriginal.getBounds();
        const texFrm  = rimTopOriginal.frame.name;

        const cloneTop = this.add.image(topPos.centerX, topPos.centerY, "rim1", texFrm)
            .setOrigin(0.5, 0.5)
            .setScale(rimTopOriginal.scaleX, rimTopOriginal.scaleY)
            .setDepth(100);    

        const cloneBot = this.add.image(botPos.centerX, botPos.centerY, "rim2", texFrm)
            .setOrigin(0.5, 0.5)
            .setDepth(100);

        this.tweens.add({
            targets: [ cloneTop, cloneBot ],
            scaleX: cloneTop.scaleX * 1.5,
            scaleY: cloneTop.scaleY * 1.5,
            alpha:   0,                
            ease:    'Cubic.easeOut',
            duration: 500,
            onComplete: (_tween, targets) => {
                (targets as Phaser.GameObjects.Image[]).forEach((img: Phaser.GameObjects.Image) => img.destroy());
            }
        });
        if (this.is_perfect){
            const perfect = this.add.text(topPos.x, topPos.y - 20, `Perfect`, {
                font: '28px sans-serif',
                color: '#ff8800',
            })
            .setOrigin(0.5)
            .setDepth(101);
            this.tweens.add({
                targets: perfect,
                y: perfect.y - 40,
                alpha: 0,
                ease: 'Sine.easeOut',
                duration: 700,
                onComplete: () => perfect.destroy()
            });
        }
        this.time.delayedCall(200, () => {
            const plus = this.add.text(topPos.x, topPos.y - 20, `+${this.streak}`, {
                font: '28px sans-serif',
                color: '#ff8800',
            })
                .setOrigin(0.5)
                .setDepth(101);
            
            this.tweens.add({
                targets: plus,
                y: plus.y - 40,
                alpha: 0,
                ease: 'Sine.easeOut',
                duration: 700,
                onComplete: () => plus.destroy()
            });
        })
        this.is_perfect = true;
    }

    update(time: number, delta: number) {
        if (this.isGameOver) return;
        this.money.setText(`x ${PointManager.getMoney()}`);
        const ballScreenY = this.ball.y - this.camera.scrollY;

        if (this.ball.y > Math.max(this.basket1.y, this.basket2.y) + 40) {
            this.camera.stopFollow();
        }
        if (ballScreenY > this.scale.height) {
            this.isGameOver = true;
            this.gameOverSound.play();
            this.layers[0].fadeOut();
            this.layers[1].fadeIn();
            PointManager.checkHighScore();
            PointManager.saveMoney();
            PointManager.resetScore();
        }
    }

    public reset(): void {
        this.isGameOver = false;
        // this.camera.stopFollow();
        this.camera.setScroll(0, 0);
        this.basket1.setPosition(GAMEKEY.BASKET1.INITIAL_POS.x, GAMEKEY.BASKET1.INITIAL_POS.y);
        this.basket1.setAngle(0);
        this.basket1.customAngle(0);
        this.basket2.setPosition(GAMEKEY.BASKET2.INITIAL_POS.x, GAMEKEY.BASKET2.INITIAL_POS.y);
        this.basket2.setAngle(0);
        this.basket2.customAngle(0);
        this.stars.forEach((star : Star) => star.disappear());
        this.ball.setPosition(GAMEKEY.BALL.INITIAL_POS.x, GAMEKEY.BALL.INITIAL_POS.y);
        this.ball.setVelocity(0, 0);
        this.ball.currentBasket = 1;
        this.camera.startFollow(this.ball, false, 1, 1, 0, this.scale.height * 0.2);
        this.is_perfect = true;
        this.streak = 1;
    }

    public pauseScene(): void {
        
    }

    public resumeScene(): void {
        
    }
}
