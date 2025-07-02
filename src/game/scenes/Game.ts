// Game.ts
import { Scene } from 'phaser';
import Ball from '../gameobject/Ball';
import Basket from '../gameobject/Basket/Basket';
import Walls from '../gameobject/Walls';
import MenuLayer from '../Layer/MenuLayer';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    dragZone : Phaser.GameObjects.Zone;
    menu: Phaser.GameObjects.Layer;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#DEDEDE');
        this.menu = new MenuLayer(this);
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

        const { width, height } = this.scale;
        this.dragZone = this.add
            .zone(0, 0, width, height)
            .setOrigin(0)
            .setInteractive({ draggable: true });
        const ball = new Ball(this, 100, 380, "ball");

        const basket1 = new Basket(this, 100, 400, "empty");
        const basket2 = new Basket(this, 250, 300, "empty");

        this.createBallBasketPhysic(basket1, ball);
        this.createBallBasketPhysic(basket2, ball);

    }

    getDragZone(): Phaser.GameObjects.Zone {
        return this.dragZone;
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
}
