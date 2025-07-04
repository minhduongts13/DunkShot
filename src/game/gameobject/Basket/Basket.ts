// Basket.ts
import Phaser from 'phaser';
import EmptyState from './EmptyState';
import BallState from './BallState';
import { Game } from '../../scenes/Game';

export default class Basket extends Phaser.GameObjects.Container implements IBasket {
    protected rimTop: Phaser.Physics.Arcade.Image;
    protected rimBottom: Phaser.GameObjects.Image;
    protected net: Phaser.Physics.Arcade.Image;
    protected sensor: Phaser.Physics.Arcade.Image;
    private currentState: string;
    private states: Map<string, IBasketState>;
    private dragStartPoint: Phaser.Math.Vector2 | null = null;
    private dragZone: Phaser.GameObjects.Zone;
    private defaultNetHeight: number;
    private aimGraphics: Phaser.GameObjects.Graphics;
    public scene: Phaser.Scene;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        state: string,
        config?: BasketConfig
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.states = new Map<string, IBasketState>();
        this.states.set("empty", new EmptyState(this));
        this.states.set("ball", new BallState(this));
        this.currentState = state;

        this.create(config);
        this.transitionTo(state);
        this.addInteraction();
    }

    public shakeNet() {
        this.scene.tweens.add({
            targets: this.net,     
            scaleY: { from: 1, to: 1.1 }, 
            ease: 'Elastic.easeOut',
            duration: 100,
            yoyo: true
        });

        
        this.scene.tweens.add({
            targets: this,
            angle: { from: 0, to: 2 },    
            ease: 'Cubic.easeOut',
            duration: 10,
            yoyo: true,
            repeat: 1
        });
    }

    public transitionTo(state: string) {
        this.states.get(this.currentState)!.exit();
        this.currentState = state;
        this.states.get(state)!.enter();
    }

    public getTopRim() { return this.rimTop; } 
    public getBottomRim() { return this.rimBottom; }
    public getSensor() { return this.sensor; }
    public getNet(){ return this.net;}
    public getScene(){ return this.scene;}
    public getCurrentState(){ return this.currentState}
    public customAngle(angle: number): void {
        (this.rimTop.body as Phaser.Physics.Arcade.Body).setSize(70, 50*Math.cos(angle)).setOffset(0, 50 - 50*Math.cos(angle));
    }

    private create(config?: BasketConfig): void{
        this.rimTop = this.scene.physics.add.image(0, 0, "rim1")
            .setImmovable(true)
            .setOrigin(0.5, 0.5);
            
        (this.rimTop.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        (this.rimTop.body as Phaser.Physics.Arcade.Body).setSize(70, 50).setOffset(0, 0);
        
        this.rimBottom = this.scene.add.image(0, 10, "rim2").setOrigin(0.5, 0.5);
        const body = this.rimTop.body as Phaser.Physics.Arcade.Body;
        body.checkCollision = {
            none: false,  
            up: false,
            down: false,
            left: true,
            right: true
        };

        const sensorY = 30;  
        this.sensor = this.scene.physics.add.image(0, sensorY, null as any)
            .setImmovable(true)
            .setSize(70, 5)
            .setOrigin(0.5, 0)
            .setVisible(false);
        (this.sensor.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        (this.sensor.body as Phaser.Physics.Arcade.Body).moves = false;
        (this.sensor.body as Phaser.Physics.Arcade.Body).checkCollision = {
            none:  false,
            up:    true,   
            down:  false,
            left:  false,
            right: false
        };

        if (config && config.bodySize) {
            (this.rimTop.body as Phaser.Physics.Arcade.Body).setSize(...config.bodySize);
        }
        if (config && config.bodyOffset) {
            (this.rimTop.body as Phaser.Physics.Arcade.Body).setOffset(...config.bodyOffset);
        }
        
        this.net = this.scene.physics.add.image(-1, 10, "netWhite")
            .setImmovable(true)
            .setOrigin(0.5, 0)
            .setInteractive({ draggable: true });
        (this.net.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        (this.net.body as Phaser.Physics.Arcade.Body).moves = false;
        (this.net.body as Phaser.Physics.Arcade.Body);
        (this.net.body as Phaser.Physics.Arcade.Body).checkCollision = {
            none:  false,
            up:    false,   
            down:  true,
            left:  false,
            right: false
        };
        
        this.defaultNetHeight = this.net.displayHeight;

        this.add([ this.rimTop, this.net, this.rimBottom, this.sensor ]);
        this.scene.add.existing(this);
    }

    private addInteraction(): void{
        this.aimGraphics = this.scene.add.graphics();
        this.aimGraphics.setDepth(10);      

        this.dragZone = (this.scene as Game).getDragZone();
        this.dragZone.on('dragstart', (pointer: Phaser.Input.Pointer) => {
            if (this.currentState === 'empty') return;
            this.dragStartPoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
        });

        this.dragZone.on('drag', (pointer: Phaser.Input.Pointer) => {
            if (this.currentState == "empty") return;
            const dx = pointer.x - this.dragStartPoint!.x;
            const dy = pointer.y - this.dragStartPoint!.y;
            const localY = Phaser.Math.Clamp(this.defaultNetHeight + Math.sqrt(dy*dy + dx*dx), this.defaultNetHeight, this.defaultNetHeight*1.5);
            const scaleY = localY / this.defaultNetHeight;
            this.net.setScale(1, scaleY);
        
            let angle = Phaser.Math.Angle.Between(0, 0, dx, dy);

            this.setRotation(angle - Math.PI/2);

            const netBottomLocal = new Phaser.Math.Vector2(
                this.net.x,
                this.net.y + this.defaultNetHeight * scaleY*0.5
            );
            Phaser.Math.Rotate(netBottomLocal, this.rotation);

            const worldBottom = new Phaser.Math.Vector2(
                this.x + netBottomLocal.x,
                this.y + netBottomLocal.y
            );

            this.emit('netdrag', worldBottom);

            this.aimGraphics.clear();
            const points: Phaser.Math.Vector2[] = [];
            const g = this.aimGraphics;

            const speed = Math.min(Phaser.Math.Distance.Between(
                this.dragStartPoint!.x, this.dragStartPoint!.y,
                pointer.x, pointer.y
            ) * 10, 1300); 
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const gravityY = this.scene.physics.world.gravity.y; 

            const tStep = 0.05;   // step time
            for (let t = 0; t < 1.5; t += tStep) {
                const x = this.x + -vx * t;
                const y = this.y + -vy * t + 0.5 * 1.15*gravityY * t * t;
                points.push(new Phaser.Math.Vector2(x, y));
            }

            const maxRadius = 4;        // bán kính điểm đầu
            const minRadius = 0.5;        // bán kính điểm cuối
            const total = points.length;

            for (let i = 0; i < Math.min(total, 10); i++) {
                const t = i / (total - 1);

                const radius = Phaser.Math.Linear(maxRadius, minRadius, t);
                const alpha  = Phaser.Math.Linear(1, 0.3, t);
                g.fillStyle(0xff8800, alpha);
                g.fillCircle(points[i].x, points[i].y, radius);
            }
        });

        this.dragZone.on('dragend', (pointer: Phaser.Input.Pointer) => {
            if (this.currentState == "empty") return;

            const dx = pointer.x - this.dragStartPoint!.x;
            const dy = pointer.y - this.dragStartPoint!.y;

            let angle = Phaser.Math.Angle.Between(0, 0, dx, dy);

            angle += Math.PI;

            const power = Math.min(Phaser.Math.Distance.Between(
                this.dragStartPoint!.x, this.dragStartPoint!.y,
                pointer.x, pointer.y
            ), 130); 

            if (power >= 30)
                this.emit('shoot', { angle, power });
        
            // reset
            this.net.setScale(1, 1);
            this.setRotation(0);
            this.dragStartPoint = null;
                if (power < 30){
                    const netBottomLocal = new Phaser.Math.Vector2(
                        this.net.x,
                        this.net.y + this.defaultNetHeight * 0.5
                );
                Phaser.Math.Rotate(netBottomLocal, this.rotation);

                const worldBottom = new Phaser.Math.Vector2(
                    this.x + netBottomLocal.x,
                    this.y + netBottomLocal.y - 5
                );
                this.emit('netdrag', worldBottom);
            }
            this.aimGraphics.clear();
        });
    }
}
