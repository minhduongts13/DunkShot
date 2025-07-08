// BallState.ts

export default class BallState implements IBasketState {
    private basket: IBasket;

    constructor(basket: IBasket) {
        this.basket = basket;
    }
    enter() {
        this.basket.getTopRim().setTexture("rim3"); 
        this.basket.getBottomRim().setTexture("rim4");
        this.basket.getNet().setTexture("netWhite");
        (this.basket.getTopRim().body as Phaser.Physics.Arcade.Body).enable = false;
        (this.basket.getBottomRim().body as Phaser.Physics.Arcade.Body).enable = false;
        (this.basket.getNet().body as Phaser.Physics.Arcade.Body).enable = false;
        (this.basket.getSensor().body as Phaser.Physics.Arcade.Body).enable = false;

        
    }

    exit() {
        
    }
}