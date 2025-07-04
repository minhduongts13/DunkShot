// gameobject/Ball.ts
import Phaser from "phaser";

export default class Ball extends Phaser.Physics.Arcade.Image implements IBall {
    public currentBasket: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string){
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.1).refreshBody();
        this.setCircle(this.width/2);
        this.setBounce(0.8);
        this.setCollideWorldBounds(true);
        this.currentBasket = 1;
    }
    

    public reset(x: number, y: number) {
        (this.body as Phaser.Physics.Arcade.Body).stop();
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.setPosition(x, y);
    }
}