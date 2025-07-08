// Challenge1.ts
import { Scene } from 'phaser';
import Ball from '../gameobject/Ball';
import Basket from '../gameobject/Basket/Basket';
import Walls from '../gameobject/Walls';
import PointManager from '../Manager/PointManager';
import { GAMEKEY } from '../../Constant';
import GameOverLayer from '../Layer/Challenge1/GameOverLayer';
import PauseLayer from '../Layer/PauseLayer';
import WinLayer from '../Layer/Challenge1/WinLayer';
import SettingsLayer from '../Layer/Settings';
import Settings from '../Manager/Settings';

export class Challenge1 extends Scene implements IGameScene, IHasDragZone
{
    private camera: Phaser.Cameras.Scene2D.Camera;
    private dragZone! : Phaser.GameObjects.Zone;
    private baskets: Basket[];
    private ball: Ball;
    private layers: ILayer[];
    private money: Phaser.GameObjects.Text;
    private isGameOver: boolean = false;
    private timer: Phaser.GameObjects.Text;
    private timerEvent: Phaser.Time.TimerEvent | null = null;
    private pause: Phaser.GameObjects.Image;
    private is_perfect: boolean = true;
    private streak = 1;
    private scoreSound: Phaser.Sound.BaseSound[] = [];
    private borderSound: Phaser.Sound.BaseSound[] = [];
    private netSound: Phaser.Sound.BaseSound[] = [];
    private releaseSound: Phaser.Sound.BaseSound[] = [];
    private starSound: Phaser.Sound.BaseSound[] = [];
    private gameOverSound: Phaser.Sound.BaseSound;
    private timerSound: Phaser.Sound.BaseSound[] = [];
    private winSound: Phaser.Sound.BaseSound[] = [];
    private outTimeSound: Phaser.Sound.BaseSound;
    private lastTime: number = 10;
    private timerSoundIndex: number = 0;
    

    constructor ()
    {
        super('Challenge1');
    }

    public create (): void
    {
        const { width, height } = this.scale;
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(Settings.get('darkmode') ? '#414141' : '#DEDEDE');
        this.events.on('darkmode', () =>{
            this.camera.setBackgroundColor(Settings.get('darkmode') ? '#414141' : '#DEDEDE');
        });
        this.camera.setBounds(0, -5000, width, height + 5000); 
        this.dragZone = this.add
            .zone(0, 0, width, height)
            .setOrigin(0)
            .setScrollFactor(0)
            .setInteractive({ draggable: true });
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
        this.timerSound.push(this.sound.add('timer-1'));
        this.timerSound.push(this.sound.add('timer-2'));
        this.winSound.push(this.sound.add('confetti-1'));
        this.winSound.push(this.sound.add('confetti-2'));
        this.outTimeSound = this.sound.add('outtime');

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

        const wall = new Walls(this);

        this.ball = new Ball(this, 100, 380, `ball${Settings.get('ball')}`);
        this.ball.currentBasket = 0;
        this.ball.setCollideWorldBounds(true);
        const body = this.ball.body as Phaser.Physics.Arcade.Body;
        body.onWorldBounds = true;

        this.camera.startFollow(this.ball, false, 1, 1, 0, height*0.2);
        
        this.baskets = [];
        this.baskets.push(new Basket(this, 100, 400, "empty"));
        this.baskets.push(new Basket(this, 250, 200, "empty"));
        this.baskets.push(new Basket(this, 100, 0, "empty"));
        this.baskets.push(new Basket(this, 250, -200, "empty"));
        this.baskets.push(new Basket(this, 100, -400, "empty"));
        this.baskets.push(new Basket(this, 250, -600, "empty"));
        

        for (let basket of this.baskets){
            this.createBallBasketPhysic(basket, this.ball);
        }

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
        
        this.timer = this.add.text(
            width / 2,
            90,
            '9.00',
            {
                font: '48px sans-serif',
                color: '#B2B2B2',
                align: 'center'
            }
        )
            .setOrigin(0.5, 0)       
            .setScrollFactor(0);
        this.pause = this.add
            .image(40, 30, 'pause')
            .setScale(0.7)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.pauseScene());
        this.layers = [];
        this.layers.push(new GameOverLayer(this));
        this.layers.push(new WinLayer(this));
        this.layers.push(new PauseLayer(this));
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
                    ball.y - 5
                );
                basket.shakeNet();
                ball.setAngularVelocity(0);
                if (ball.currentBasket < this.baskets.indexOf(basket)) this.scoreAnimation(basket);
                ball.currentBasket = this.baskets.indexOf(basket);

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
        
            if (!this.timerEvent) {
                this.timerEvent = this.time.addEvent({
                    delay: 90000,           
                });
                this.lastTime = -1;
            }
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
        if (this.ball.currentBasket == this.baskets.length - 1){
            this.winSound[0].play();
            this.winSound[1].play();
            this.endGame(1);
        }
        if (this.timerEvent) {
            const msLeft = this.timerEvent.getRemaining();      
            const secLeft = (msLeft / 1000).toFixed(2);
            this.timer.setText(`${secLeft}`);
            if ((this.ball.body as Phaser.Physics.Arcade.Body).allowGravity === false && msLeft <= 0){
                this.outTimeSound.play();
                this.endGame(0);
            }
        }
        if (this.timerEvent && !this.timerEvent.hasDispatched) {
            const elapsed = this.timerEvent.getElapsed();
            const sec = Math.floor(elapsed / 1000);
            if (sec > this.lastTime) {
                this.lastTime = sec;
                this.timerSound[(this.timerSoundIndex++)%2].play();
            }
        }

        this.money.setText(`x ${PointManager.getMoney()}`);
        const ballScreenY = this.ball.y - this.camera.scrollY;

        if (this.ball.y > this.baskets[this.ball.currentBasket].y + 40) {
            this.camera.stopFollow();
        }
        if (ballScreenY > this.scale.height) {
            this.gameOverSound.play()
            this.endGame(0);
        }
    }

    public reset(): void {
        this.isGameOver = false;
        // this.camera.stopFollow();
        this.camera.setScroll(0, 0);
        this.ball.setVelocity(0, 0);
        this.ball.reset(GAMEKEY.BALL.INITIAL_POS.x, GAMEKEY.BALL.INITIAL_POS.y);
        this.ball.currentBasket = 0;
        this.camera.startFollow(this.ball, false, 1, 1, 0, this.scale.height * 0.2);
        if (this.timerEvent) {
            this.timer.setText('9.00');
            this.timerEvent.remove(false);  
            this.timerEvent = null;
        }
        this.dragZone.setInteractive({ draggable: true });
        this.baskets.forEach((basket) => {basket.transitionTo("empty");  basket.clearAimGraphics();});
        this.pause.setVisible(true);
    }

    public pauseScene(): void {
        this.layers[2].fadeIn();
        if (this.timerEvent) this.timerEvent.paused = true;
    }
    public resumeScene(): void {
        if (this.timerEvent) this.timerEvent!.paused = false;
    }

    public endGame(ending: number): void {
        this.is_perfect = true;
        this.streak = 1;
        this.isGameOver = true;
        this.layers[ending].fadeIn();
        this.dragZone.disableInteractive();
        this.pause.setVisible(false);
    }
}
