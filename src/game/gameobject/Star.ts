// gameobject/Star.ts
import Phaser from "phaser";
import { GAMEKEY } from "../../Constant";

export default class Star extends Phaser.Physics.Arcade.Image implements IStar {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    public disappear(): void {
        const targetY = this.y - 50;

        this.scene.tweens.add({
            targets: this,
            y: targetY,
            alpha: 0,
            ease: "Sine.easeOut",
            duration: 600,
            onComplete: () => {
                this.reset();
            }
        });
    }

    public spawn(x : number, y: number): void { 
        this.setAlpha(1);
        this.setTexture("star" + Math.floor(Math.random() * 5));
        this.setPosition(x, y);
    }

    private reset(): void {
        this.setPosition(GAMEKEY.STAR.INITIAL_POS.x, GAMEKEY.STAR.INITIAL_POS.y);
    }
}
