// Wall.ts

import { GAMEKEY } from "../../Constant";

export default class Wall extends Phaser.Physics.Arcade.Image  {
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string){
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true)
        this.setOrigin(0.5, 0.5);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    public spawn(x: number, y: number, angle: number = 0, texture: string = 'wall'): void {
        this.setPosition(x, y);
        this.setAngle(angle);
        this.setTexture(texture);
        (this.body as Phaser.Physics.Arcade.Body).setSize(this.width, this.height);
    }

    public reset(): void{
        this.setPosition(GAMEKEY.WALL.INITIAL_POS.x, GAMEKEY.WALL.INITIAL_POS.y);
        this.setAngle(0);
    }
}