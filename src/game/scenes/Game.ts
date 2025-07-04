// Game.ts
import { Scene } from 'phaser';
import Ball from '../gameobject/Ball';
import Basket from '../gameobject/Basket/Basket';
import Walls from '../gameobject/Walls';
import MenuLayer from '../Layer/MenuLayer';
import PointManager from '../Manager/PointManager';
import HUDLayer from '../Layer/HUDLayer';
import Star from '../gameobject/Star';
import { GAMEKEY } from '../../Constant';
import GameOverLayer from '../Layer/GameOverLayer';

export class Game extends Scene
{
    private camera: Phaser.Cameras.Scene2D.Camera;
    private dragZone : Phaser.GameObjects.Zone;
    private index1 : number;
    private index2 : number;
    private basket1: Basket;
    private basket2: Basket;
    private ball: Ball;
    private positions1: {x: number, angle: number}[];
    private positions2: {x: number, angle: number}[];
    private layers: ILayer[];
    private money: Phaser.GameObjects.Text;
    private stars: Star[];
    private isGameOver: boolean = false;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
		const { width, height } = this.scale;
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#DEDEDE');
        this.camera.setBounds(0, -5000, width, height + 5000); 
        
        this.index1 = 0;
        this.index2 = 0;

        this.positions1 = [
            { x: 80, angle: 15},
            { x: 110, angle: -10},
            { x: 100, angle: -10},
            { x: 90, angle: 15},
            { x: 100, angle: 20},
            { x: 120, angle: 15},
        ]

        this.positions2 = [
            { x: 250, angle: 15},
            { x: 250, angle: 10},
            { x: 260, angle: -20},
            { x: 240, angle: 0},
            { x: 230, angle: 15},
            { x: 250, angle: 0},
            { x: 260, angle: -25},
        ]

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

        this.dragZone = this.add
            .zone(0, 0, width, height)
            .setOrigin(0)
			.setScrollFactor(0)
            .setInteractive({ draggable: true });
        this.ball = new Ball(this, 100, 380, "ball");
        this.camera.startFollow(this.ball, false, 1, 1, 0, height*0.2);

        this.basket1 = new Basket(this, 100, 400, "empty");
        this.basket2 = new Basket(this, 250, 300, "empty");
        this.stars = [];
        this.stars.push(new Star(this, GAMEKEY.STAR.INITIAL_POS.x, GAMEKEY.STAR.INITIAL_POS.x, "star0"));
        this.stars.push(new Star(this, GAMEKEY.STAR.INITIAL_POS.x, GAMEKEY.STAR.INITIAL_POS.x, "star0"));

        this.createBallBasketPhysic(this.basket1, this.ball);
        this.createBallBasketPhysic(this.basket2, this.ball);
        this.creatStarBallPhysic();

        this.add.image(width - 80, 23, 'star0')
            
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {});
        this.money = this.add.text(
            width - 50,
            10,
            `x ${PointManager.getMoney()}`,
            {
                font: '24px sans-serif',
                color: '#FB8925',
                align: 'center'
            }
        )
            .setOrigin(0.5, 0)       
            .setScrollFactor(0);
        
        this.layers = [];
        this.layers.push(new HUDLayer(this));
        this.layers.push(new GameOverLayer(this));
        this.layers.push(new MenuLayer(this));
    }

    public getDragZone(): Phaser.GameObjects.Zone {
        return this.dragZone;
    }

    public getLayers(index: number): ILayer{
        return this.layers[index];
    }

    createBallBasketPhysic(basket : Basket, ball : Ball): void {
        this.physics.add.collider(ball, basket.getTopRim());
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
                if (basket == this.basket1){
                    if (ball.currentBasket == 1) return;
                    this.basket2.setPosition(this.positions2[this.index2].x, this.basket2.y - 300);
                    this.basket2.setAngle(this.positions2[this.index2].angle);
                    this.basket2.customAngle(this.positions2[this.index2].angle*Math.PI/180);
                    const pos = this.basket2.getTopRim().getBounds();
                    if (Math.random() < 0.3) this.stars[0].spawn(pos.centerX, pos.centerY - 30);
                    this.index2++;
                    ball.currentBasket = 1;
                    PointManager.setScore(PointManager.getCurrentScore() + 1);
                    this.scoreAnimation(this.basket1);
                }
                else {
                    if (ball.currentBasket == 2) return;
                    this.basket1.setPosition(this.positions1[this.index1].x, this.basket1.y - 300);
                    this.basket1.setAngle(this.positions1[this.index1].angle);
                    this.basket1.customAngle(this.positions1[this.index1].angle*Math.PI/180);
                    const pos = this.basket1.getTopRim().getBounds();
                    if (Math.random() < 0.3) this.stars[1].spawn(pos.centerX, pos.centerY - 30);
                    this.index1++;
                    ball.currentBasket = 2;
                    PointManager.setScore(PointManager.getCurrentScore() + 1);
                    this.scoreAnimation(this.basket2);
                }
            },
            undefined,
            this,
        );

        this.physics.add.collider(
            ball,
            basket.getNet()
        );

        basket.on('netdrag', (worldBottom: Phaser.Math.Vector2) => {
            if (basket.getCurrentState() == "ball"){
                ball.setPosition(worldBottom.x, worldBottom.y);
    
                (ball.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
                (ball.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
            }
        });

        basket.on('shoot', (data: { angle: number; power: number }) => {
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

    creatStarBallPhysic(): void {
        this.stars.forEach((star: Star) => {
            this.physics.add.overlap(
                this.ball, star,
                () => {
                    star.disappear();
                    PointManager.setMoney(PointManager.getMoney() + 1);
                }
            );
        });
    }

    scoreAnimation(basket: Basket): void {
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

        const plus = this.add.text(topPos.x, topPos.y - 20, '+1', {
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
            duration: 600,
            onComplete: () => plus.destroy()
        });
    }

    update(time: number, delta: number) {
        if (this.isGameOver) return;
        const camBottom = this.camera.scrollY + this.scale.height;
        if (this.ball.y > camBottom) {
            this.isGameOver = true;
            this.layers[0].fadeOut();
            this.layers[1].fadeIn();
        }
    }
}
