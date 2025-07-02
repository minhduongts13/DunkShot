import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 360,
    height: 640,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1500 },
            debug: true
        }
    },
    backgroundColor: 'rgb(222,222,222)',
    scene: [
        Boot,
        Preloader,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
