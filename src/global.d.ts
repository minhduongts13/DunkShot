// images
declare module '*.apng' {
    const src: string
    export default src
}
declare module '*.png' {
    const src: string
    export default src
}
declare module '*.jpg' {
    const src: string
    export default src
}
declare module '*.jpeg' {
    const src: string
    export default src
}
declare module '*.jfif' {
    const src: string
    export default src
}
declare module '*.pjpeg' {
    const src: string
    export default src
}
declare module '*.pjp' {
    const src: string
    export default src
}
declare module '*.gif' {
    const src: string
    export default src
}
declare module '*.svg' {
    const src: string
    export default src
}
declare module '*.ico' {
    const src: string
    export default src
}
declare module '*.webp' {
    const src: string
    export default src
}
declare module '*.avif' {
    const src: string
    export default src
}

// Shaders
declare module '*.frag' {
    const src: string
    export default src
}
declare module '*.vert' {
    const src: string
    export default src
}
declare module '*.glsl' {
    const src: string
    export default src
}
declare module '*.vs' {
    const src: string
    export default src
}
declare module '*.fs' {
    const src: string
    export default src
}

// interfaces
interface IBall {
    public reset(x: number, y: number): void;
}

interface IBasket {
    public shakeNet(): void;
    public transitionTo(state: string): void;
    public getTopRim(): Phaser.GameObjects.Image;
    public getBottomRim(): Phaser.GameObjects.Image;
    public getSensor(): Phaser.GameObjects.Image;
    public getNet(): Phaser.GameObjects.Image;
    public getScene(): Phaser.Scene;
    public getCurrentState(): string;
    public clearAimGraphics(): void;

}

type BasketConfig = {
    bodySize?: [number, number];
    bodyOffset?: [number, number];
};

interface IBasketState {
    enter(): void;
    exit(): void;
}

interface IWall {
    
}

interface IPointManager {
    public checkHighScore(): void;
    public getCurrentPoint(): number;
    public setPoint(points: number): void;
    public setMoney(money: number): void;
    public getMoney(): number;
    public resetScore(): void;
}

interface IGameScene {
    public getLayers(index: number): ILayer;
    public getDragZone(): Phaser.GameObjects.Zone;
    public reset(): void;
    public create (): void;
    public update(time: number, delta: number): void;
    public pauseScene(): void;
    public resumeScene(): void;
    public endGame(ending : number): void;
    public reset(): void;
}

interface IHasDragZone {
    public getDragZone(): Phaser.GameObjects.Zone;
}

interface IStar {
    public spawn(x : number, y: number): void;
    public disappear(): void;
}

interface ILayer {
    fadeIn(): void;
    fadeOut(): void;

}

interface IChallengeScene {
    public getCurrentHoop(): number;
    public getNumHoop(): number;
    public getTimeLimit(): number;
}