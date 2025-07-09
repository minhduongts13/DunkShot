import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Challenge1 } from './scenes/Challenge1';
import { Challenge2 } from './scenes/Challenge2';
import Settings from './Manager/Settings';
import Customize from './scenes/Customize';

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
            // debug: true
        }
    },
    backgroundColor: (Settings.get('darkmode') ? '#414141' : '#DEDEDE'),
    scene: [
        Boot,
        Preloader,
        MainGame,
        Customize,
        Challenge1,
        Challenge2,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
