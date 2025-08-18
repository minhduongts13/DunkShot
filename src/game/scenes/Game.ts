// Game.ts
import { Scene } from 'phaser';
import Ball from '../gameobject/Ball';
import Basket from '../gameobject/Basket/Basket';
import Walls from '../gameobject/Wall';
import MenuLayer from '../Layer/Endless/MenuLayer';
import PointManager from '../Manager/PointManager';
import HUDLayer from '../Layer/Endless/HUDLayer';
import Star from '../gameobject/Star';
import { GAMEKEY } from '../../Constant';
import GameOverLayer from '../Layer/Endless/GameOverLayer';
import PauseLayer from '../Layer/Endless/PauseLayer';
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
    private walls: Walls[];
    private isGameOver: boolean = false;
    private is_perfect: boolean = true;
    private is_bounce: boolean = false;
    private streak = 1;
    private scoreSound: Phaser.Sound.BaseSound[] = [];
    private borderSound: Phaser.Sound.BaseSound[] = [];
    private netSound: Phaser.Sound.BaseSound[] = [];
    private releaseSound: Phaser.Sound.BaseSound[] = [];
    private starSound: Phaser.Sound.BaseSound[] = [];
    private gameOverSound: Phaser.Sound.BaseSound;
    private fireSound: Phaser.Sound.BaseSound[] = [];
    private flashPool: Phaser.GameObjects.Image[] = [];
    


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
        this.fireSound.push(this.sound.add('fire-shot1'));
        this.fireSound.push(this.sound.add('fire-shot2'));
        this.fireSound.push(this.sound.add('fire-shot3'));

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

        // this.walls = new Walls(this);

        this.dragZone = this.add
            .zone(0, 0, width, height)
            .setOrigin(0)
			.setScrollFactor(0)
            .setDepth(10)
            .setInteractive({ draggable: true });
        this.ball = new Ball(this, 100, 380, `ball${Settings.get('ball')}`);
        this.ball.setCollideWorldBounds(true);
        const body = this.ball.body as Phaser.Physics.Arcade.Body;
        body.onWorldBounds = true;

        this.events.on('ball', () =>{
            this.ball.setTexture(`ball${Settings.get('ball')}`);
        });
        this.camera.startFollow(this.ball, false, 1, 1, 0, height*0.2);

        this.basket1 = new Basket(this, GAMEKEY.BASKET1.INITIAL_POS.x, GAMEKEY.BASKET1.INITIAL_POS.y, "empty").setDepth(3);
        this.basket2 = new Basket(this, GAMEKEY.BASKET2.INITIAL_POS.x, GAMEKEY.BASKET2.INITIAL_POS.y, "empty").setDepth(3);

        this.stars = [];
        this.stars.push(new Star(this, GAMEKEY.STAR.INITIAL_POS.x, GAMEKEY.STAR.INITIAL_POS.x, "star0"));
        this.stars.push(new Star(this, GAMEKEY.STAR.INITIAL_POS.x, GAMEKEY.STAR.INITIAL_POS.x, "star0"));

        this.walls = [];
        this.walls.push(new Walls(this, GAMEKEY.WALL.INITIAL_POS.x, GAMEKEY.WALL.INITIAL_POS.y, 'wall'));
        this.walls.push(new Walls(this, GAMEKEY.WALL.INITIAL_POS.x, GAMEKEY.WALL.INITIAL_POS.y, 'wall'));

        this.createBallBasketPhysic(this.basket1, this.ball);
        this.createBallBasketPhysic(this.basket2, this.ball);
        this.creatStarBallPhysic();
        this.createBallPhysic();


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

        for (let i = 0; i < 8; i++) {
            const img = this.add.image(0, 0, 'flash1')
                .setVisible(false)
                .setDepth(20)
                .setScale(0.5);
            this.flashPool.push(img);
        }

        
        

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

    private createBallPhysic(): void {
        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
            if (body.gameObject !== this.ball) return;
            this.borderSound[Math.floor(Math.random()*this.borderSound.length)].play();
            this.is_bounce = true;

            const { x, y } = body.center;
            const center = this.getFlash('flash3');
            center.setPosition(0, y)
                    .setOrigin(0.5)
                    .setAngle(0)
                    .setTint(0xFF8800) 
                    .setAlpha(1)
                    .setScale(0.2)
                    .setVisible(true);
            if (body.blocked.right){
                center.setFlipX(true)
                    .setPosition(this.scale.width - 4, y);
            }
            else {
                center.setFlipX(false)
                    .setPosition(4, y);
            }
            this.tweens.add({
                targets: center,
                alpha:  0,
                scale:  0.4,
                duration: 100,
                onComplete: () => center.setVisible(false)
            });

            const downFlash  = this.getFlash('flash1');
            const upFlash = this.getFlash('flash2');

            [downFlash, upFlash].forEach(f => {
                f.setPosition(x, y)
                .setOrigin(0.5)
                .setAlpha(0.5)
                .setTint(0xFF8800) 
                .setVisible(true)
                .setDepth(9)
                .setScale(0.3);
            });
            let destX = 0;
            if (body.blocked.right){
                [downFlash, upFlash].forEach(f => {
                    f.setFlipX(true)
                    .setPosition(this.scale.width - 5, y);
                    destX = this.scale.width - 10;
                });
            }
            else {
                [downFlash, upFlash].forEach(f => {
                    f.setFlipX(false)
                    .setPosition(5 , y);
                });
            }
            this.tweens.add({
                targets: downFlash,
                x: destX,
                y: y + 300,
                alpha: 0,
                duration: 500,
                onComplete: () => downFlash.setVisible(false)
            });
            this.tweens.add({
                targets: upFlash,
                x: destX,
                y: y - 800,
                alpha: 0,
                duration: 500,
                onComplete: () => upFlash.setVisible(false)
            });
        });
        this.walls.forEach((wall) =>{
            this.physics.add.collider(this.ball, wall, () => {
                this.is_bounce = true;
            });
        })
    }

    private createBallBasketPhysic(basket : Basket, ball : Ball): void {
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
                
                b.setPosition(basket.x, ball.y);
                basket.shakeNet();
                ball.setAngularVelocity(0);
        
                const { width, height } = this.scale;
                const randomAngle = Math.floor(Math.random() * (25 - (-25) + 1)) + (-25);
                const randomY = Math.floor(Math.random() * (230 - 180 + 1)) + 180;
                
                if (basket == this.basket1){
                    const randomX = Math.floor(Math.random() * (width - 60 - width/2 + 1)) + width/2;
                    if (ball.currentBasket == 1) return;
                    this.basket2.setPosition(randomX, this.basket1.y - randomY);
                    this.basket2.setAngle(randomAngle*Math.PI/180);
                    this.basket2.customAngle(randomAngle*Math.PI/180);
                    const pos = this.basket2.getTopRim().getBounds();
                    if (Math.random() < 0.4) this.stars[0].spawn(pos.centerX, pos.centerY - 30);
                    const wallpos = GAMEKEY.BASKET2.WALLPOS[Math.floor(Math.random()*4)];
                    if (Math.random() < 0.2) this.walls[0].spawn(pos.centerX + wallpos.x, pos.centerY + wallpos.y, wallpos.angle, wallpos.key);
                    this.walls[1].reset();
                    ball.currentBasket = 1;
                    PointManager.setScore(PointManager.getCurrentScore() + 1);
                    this.scoreAnimation(this.basket1);
                }
                else {
                    const randomX = Math.floor(Math.random() * (width/2 - 40 + 1)) + 60;
                    if (ball.currentBasket == 2) return;
                    this.basket1.setPosition(randomX, this.basket2.y - randomY);
                    this.basket1.setAngle(randomAngle);
                    this.basket1.customAngle(randomAngle*Math.PI/180);
                    const pos = this.basket1.getTopRim().getBounds();
                    if (Math.random() < 0.4) this.stars[1].spawn(pos.centerX, pos.centerY - 30);
                    const wallpos = GAMEKEY.BASKET1.WALLPOS[Math.floor(Math.random()*4)];
                    if (Math.random() < 0.2) this.walls[1].spawn(pos.centerX + wallpos.x, pos.centerY + wallpos.y, wallpos.angle, wallpos.key);
                    this.walls[0].reset();
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
            if (this.streak >= 4) this.fireSound[Math.floor(Math.random()*3)].play();
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
        PointManager.setScore(PointManager.getCurrentScore() + this.streak + (this.is_bounce ? 1 : 0));
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
        let delayTime = 0;

        if (this.is_perfect){
            delayTime += 200;
            const perfect = this.add.text(topPos.x, topPos.y - 20, `Perfect`, {
                font: '28px sans-serif',
                color: '#ff8800',
            })
            .setOrigin(0.5)
            .setDepth(9);
            this.tweens.add({
                targets: perfect,
                y: perfect.y - 40,
                alpha: 0,
                ease: 'Sine.easeOut',
                duration: 700,
                onComplete: () => perfect.destroy()
            });
        }
        
        if (this.is_bounce){
            delayTime += 200;
            this.time.delayedCall(200, () => {
                const bounce = this.add.text(topPos.x, topPos.y - 20, `BOUNCE!`, {
                    font: '28px sans-serif',
                    color: '#098ED0',
                })
                    .setOrigin(0.5)
                    .setDepth(9);
                this.tweens.add({
                    targets: bounce,
                    y: bounce.y - 40,
                    alpha: 0,
                    ease: 'Sine.easeOut',
                    duration: 700,
                    onComplete: () => bounce.destroy()
                });
            });
        }

        this.time.delayedCall(400, () => {
            const plus = this.add.text(topPos.x, topPos.y - 20, `+${this.streak + (this.is_bounce ? 1 : 0)}`, {
                font: '28px sans-serif',
                color: '#ff8800',
            })
                .setOrigin(0.5)
                .setDepth(9);
            
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
        this.is_bounce = false;
        this.ball.updateEmittersByStreak(this.streak);
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
            PointManager.checkHighScore();
            PointManager.saveMoney();
            this.gameOverSound.play();
            PointManager.resetScore();
            this.layers[0].fadeOut();
            this.layers[1].fadeIn();
        }
    }

    public reset(): void {
        this.isGameOver = false;
        // this.camera.stopFollow();
        this.camera.setScroll(0, 0);
        this.basket1.setPosition(GAMEKEY.BASKET1.INITIAL_POS.x, GAMEKEY.BASKET1.INITIAL_POS.y);
        this.basket1.transitionTo('empty');
        this.basket1.clearAimGraphics();
        this.basket1.setAngle(0);
        this.basket1.customAngle(0);
        this.basket2.setPosition(GAMEKEY.BASKET2.INITIAL_POS.x, GAMEKEY.BASKET2.INITIAL_POS.y);
        this.basket2.transitionTo('empty');
        this.basket2.clearAimGraphics();
        this.basket2.setAngle(0);
        this.basket2.customAngle(0);
        this.walls.forEach((wall) => {
            wall.reset();
        })
        this.stars.forEach((star : Star) => star.disappear());
        this.ball.setVelocity(0, 0);
        this.ball.reset(GAMEKEY.BALL.INITIAL_POS.x, GAMEKEY.BALL.INITIAL_POS.y);
        this.ball.currentBasket = 1;
        this.camera.startFollow(this.ball, false, 1, 1, 0, this.scale.height * 0.2);
        this.is_perfect = true;
        this.is_bounce = false;
        this.streak = 1;
        this.ball.updateEmittersByStreak(this.streak);
        PointManager.resetScore();
    }

    public pauseScene(): void {
        this.physics.world.pause();
    }

    public resumeScene(): void {
        this.physics.world.resume();
    }

    public endGame(ending: number): void {
        
    }

    private getFlash(frameKey: string) {
        const img = this.flashPool.find(f => !f.visible) || this.flashPool[0];
        img.setTexture(frameKey);
        return img;
    }

    
}
