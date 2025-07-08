// EmptyState.ts

export default class EmptyState implements IBasketState {
    private basket: IBasket;

    constructor(basket: IBasket) {
        this.basket = basket;
    }
    enter() {
        this.basket.getTopRim().setTexture("rim1"); 
        this.basket.getBottomRim().setTexture("rim2");
        this.basket.getNet().setTexture("netWhite");
        
        this.basket.getScene().time.delayedCall(200, () => {
            (this.basket.getTopRim().body as Phaser.Physics.Arcade.Body).enable = true;
            (this.basket.getBottomRim().body as Phaser.Physics.Arcade.Body).enable = true;
            (this.basket.getNet().body as Phaser.Physics.Arcade.Body).enable = true;
            (this.basket.getSensor().body as Phaser.Physics.Arcade.Body).enable = true;

        });
    }

    exit() {
        
    }
}