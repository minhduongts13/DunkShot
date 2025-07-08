import HUDLayer from "./game/Layer/Endless/HUDLayer";

export const GAMEKEY = {
    STAR: {
        INITIAL_POS: {
            x: -3000,
            y: 0
        },
    },

    SCENE: {
        GAME: {
            LAYERKEY: {
                HUDLAYER: 0, 
                GAMEOVER: 1,
                PAUSE: 2,
                MENU: 3,
                SETTINGS: 4
            },
        },
        CHALLENGE: {
            LAYERKEY: { 
                GAMEOVER: 0,
                WIN: 1,
                PAUSE: 2,
                SETTINGS: 3
            },
        },
    },

    BALL: {
        INITIAL_POS: {
            x: 100,
            y: 380
        }
    },
    BASKET1: {
        INITIAL_POS: {
            x: 100,
            y: 400
        }
    },

    BASKET2: {
        INITIAL_POS: {
            x: 250,
            y: 300
        }
    },
    
    
}