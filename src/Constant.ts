
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
                SETTINGS: 3,
                INTRO: 4
            },
            CHALLENGE1: {
                TIME_LIMIT: 9000,
            },
            CHALLENGE2: {
                TIME_LIMIT: 10000,
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
        },
        WALLPOS: [
            {
                x:  50,
                y: -40,
                angle: 0,
                key: 'wall'
            },
            {
                x: -50,
                y: -40,
                angle: 0,
                key: 'wall'
            },
            {
                x:  0,
                y:  -80,  
                angle: 0,
                key: 'wall2'
            },
            {
                x:  80,
                y:  40,  
                angle: 0,
                key: 'wall2'
            },
        ]
    },

    BASKET2: {
        INITIAL_POS: {
            x: 250,
            y: 300
        },
        WALLPOS: [
            {
                x:  50,
                y: -40,
                angle: 0,
                key: 'wall'
            },
            {
                x: -50,
                y: -40,
                angle: 0,
                key: 'wall'
            },
            {
                x:  -80,
                y:  40,  
                angle: 0,
                key: 'wall2'
            },
            {
                x:  0,
                y:  -80,  
                angle: 0,
                key: 'wall2'
            },
        ]
    },
    
    WALL: {
        INITIAL_POS: {
            x: -2000,
            y: 0
        }
    }
}