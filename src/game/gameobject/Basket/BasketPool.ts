// BasketPool.ts

import Basket from "./Basket";

export default class BasketPool {
    private scene: Phaser.Scene & IGameScene;
    private pool: Basket[] = [];

    constructor(scene: Phaser.Scene & IGameScene) {
        this.scene = scene;
    }

    public acquire(x: number, y: number, initialState = 'empty'): Basket {
        let b: Basket;
        if (this.pool.length > 0) {
            b = this.pool.pop()!;
            b.setPosition(x, y);
            b.setDepth(3);
            b.transitionTo(initialState);
            b.clearAimGraphics();
            b.setActive(true).setVisible(true);
        } else {
            b = new Basket(this.scene, x, y, initialState);
            this.scene.add.existing(b);
        }
        return b;
    }

    public release(b: Basket): void {
        b.disableInteractive();
        b.setActive(false).setVisible(false);
        this.pool.push(b);
    }

    public releaseAll(activeBaskets: Basket[]): void {
        activeBaskets.forEach(b => this.release(b));
        activeBaskets.length = 0;
    }
}
