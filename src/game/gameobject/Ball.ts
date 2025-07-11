// gameobject/Ball.ts
import Phaser from "phaser";
import Settings from "../Manager/Settings";

export default class Ball extends Phaser.Physics.Arcade.Image implements IBall {
    public currentBasket: number;
    private smokeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    private fireEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    private fireStartSound: Phaser.Sound.BaseSound;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string){
        super(scene, x, y, texture);
        
        this.fireStartSound = scene.sound.add('start-fire')
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5);
        this.setScale(0.08).refreshBody();
        this.setCircle(this.width/2);
        this.setBounce(0.6);
        this.setDepth(2);
        this.currentBasket = 1;

        this.smokeEmitter = scene.add.particles(0, 0, 'particle-smoke', {
            lifespan: { min: 600, max: 1000 },
            speedY:   { min: -20,  max: 20 },
            speedX:   { min: -20,  max:  20 },
            scale:    { start: 0.08, end: 0.15 },
            alpha:    { start: 0.8, end:   0 },
            tint:       0x000000,
            frequency: -1          
        }).setDepth(1)
        this.fireEmitter = scene.add.particles(0, 0,
        'particle-fire',
        {
            lifespan: { min: 300, max: 600 },
            speedY:   { min: -5,  max: 5 },
            speedX:   { min: -5,  max:  5 },
            scale:    { start: 0.1, end: 0.2 },
            alpha:    { start: 1.0,   end: 1.0 },
            tint:       0xFCD431,
            // blendMode: 'ADD',
            frequency: -1,
        }
        ).setDepth(1)

        this.smokeEmitter.startFollow(this);
        this.fireEmitter.startFollow(this);
    }
    

    public reset(x: number, y: number) {
        (this.body as Phaser.Physics.Arcade.Body).stop();
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
        this.setPosition(x, y);
    }

    public updateEmittersByStreak(streak: number) {
        if (streak < 3) {
            this.smokeEmitter.frequency = -1;
            this.fireEmitter.frequency = -1;
            return;
        }

        this.smokeEmitter.frequency = 100 / streak;  
        const smokeGrey = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(180,180,180),
            new Phaser.Display.Color(68,68,68),
            8,  
            Math.min(streak-3, 6)
            );
        this.smokeEmitter.setParticleTint(
            Phaser.Display.Color.GetColor(smokeGrey.r, smokeGrey.g, smokeGrey.b)
        );
        if (streak == 4) this.fireStartSound.play();
        if (streak < 4) {
            this.fireEmitter.frequency = -1;
        } else {
            this.fireEmitter.frequency = 200 / (streak-1);
        
        const fireColor = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(252,212,49),
            new Phaser.Display.Color(252,93,48),
            8,
            Math.min(streak-4, 6)
        );
        this.fireEmitter.setParticleTint(
            Phaser.Display.Color.GetColor(fireColor.r, fireColor.g, fireColor.b)
        );
        }
    }
}