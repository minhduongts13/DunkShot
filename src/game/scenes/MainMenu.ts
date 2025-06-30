import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.sprite(0, 0, 'background', 0).setOrigin(0, 0);

        

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
