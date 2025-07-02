// Walls.ts

export default class Walls extends Phaser.GameObjects.Container implements IWall {
    private leftWall : Phaser.GameObjects.Image;
    private rightWall : Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene,
    ) {
        super(scene, 0, 0);

        const { width, height } = scene.scale;

        this.leftWall = scene.add.image(
            15 / 2,    
            height / 2,       
            "wall"
        )
            .setOrigin(0.5)
            .setDisplaySize(15, height)
            .setAlpha(0.4);

        this.rightWall = scene.add.image(
            width - 15 / 2,
            height / 2,
            "wall"
        )
            .setOrigin(0.5)
            .setDisplaySize(15, height)
            .setAlpha(0.4);


        this.add([ this.leftWall, this.rightWall ]);
        scene.add.existing(this);
    }
}