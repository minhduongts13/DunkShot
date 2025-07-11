import { Scene } from 'phaser';
import PointManager from '../Manager/PointManager';
import Settings from '../Manager/Settings';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#333');

        this.add.image(width/2, height*0.3, 'menu-logo')
            .setOrigin(0.5)
            .setScale(0.6);

        const barWidth = width * 0.6;
        const barHeight = 24;
        const barX = (width - barWidth) / 2;
        const barY = height * 0.6;

        const graphicsBg = this.add.graphics();
        graphicsBg.fillStyle(0x222222, 0.8);
        graphicsBg.fillRoundedRect(barX, barY, barWidth, barHeight, 8);

        const graphicsBar = this.add.graphics();

        const percentText = this.add.text(width/2, barY - 20, '0%', {
            font: '18px Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (p: number) => {
            graphicsBar.clear();
            graphicsBar.fillStyle(0xffffff, 1);
            graphicsBar.fillRoundedRect(
                barX + 4,
                barY + 4,
                (barWidth - 8) * p,
                barHeight - 8,
                6
            );
            percentText.setText(`${Math.round(p * 100)}%`);
        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image("drag-it", "menu/drag-it.png");
        this.load.image('background', 'Background/Background Walls 1.png');
        this.load.image('rim1', 'Basket/Basket1.png');
        this.load.image('rim2', 'Basket/Basket2.png');
        this.load.image('rim3', 'Basket/Basket3.png');
        this.load.image('rim4', 'Basket/Basket4.png');
        this.load.image('netOrange', 'Basket/OrangeNet.png');
        this.load.image('netWhite', 'Basket/WhiteNet.png');
        this.load.image('settingButton', 'menu/settingButton.png');
        this.load.image('darkmode', 'menu/DarkBulb.png');
        this.load.image('lightmode', 'menu/LightBulb.png');
        this.load.image('star0', 'Game/Collectibles0.png');
        this.load.image('star1', 'Game/Collectibles1.png');
        this.load.image('star2', 'Game/Collectibles2.png');
        this.load.image('star3', 'Game/Collectibles3.png');
        this.load.image('star4', 'Game/Collectibles4.png');
        this.load.image('star5', 'Game/Collectibles5.png');
        this.load.image('wall', 'Game/Wall2.png');
        this.load.image('wall2', 'Game/Wall2horizontal.png');
        this.load.image('newBall', 'menu/newBall.png');
        this.load.image('challenge', 'menu/Challenge.png');
        this.load.image('pause', 'Game/pause2.png');
        this.load.image('settingCircle', 'GameOver/setting.png');
        this.load.image('like', 'GameOver/like.png');
        this.load.image('restart', 'GameOver/restart.png');
        this.load.image('menu', 'Pause/Menu.png');
        this.load.image('resume', 'Pause/Resume.png');
        this.load.image('customize', 'Pause/Customize.png');
        this.load.image('nextLevel', 'Game/NEXT LEVEL2.png');
        this.load.image('toggle-on', 'Settings/toggle-on.png');
        this.load.image('toggle-off', 'Settings/toggle-off.png');
        this.load.image('back', 'Settings/left.png');
        for (let i = 1; i <= 20; i++){
            this.load.image(`ball${i}`, `Balls/ball${i}.png`);
        }
        this.load.image('btn-giveup', 'Pause/giveup.png');
        this.load.image('btn-restart', 'Pause/restart.png');
        this.load.image('btn-close', 'Pause/close.png');
        this.load.image('btn-play', 'Pause/play.png');
        this.load.image('btn-ok', 'Pause/ok.png');
        this.load.image('intro-challenge-ui', 'Menu/ui-bg.png');
        this.load.image('particle-smoke', 'Game/smoke.png');
        this.load.image('particle-fire', 'Game/fire.png');
        this.load.image('flash1', 'Game/flash1.png')
        this.load.image('flash2', 'Game/flash2.png')
        this.load.image('flash3', 'Game/flash3.png')

        // audio
        this.load.audio('darkmode-day', 'Sounds/darkmode/day.mp3');
        this.load.audio('darkmode-night', 'Sounds/darkmode/night.mp3');
        this.load.audio('shop-buy', 'Sounds/ev_shop_buy.mp3');
        this.load.audio('shop-lock', 'Sounds/ev_shop_locked.mp3');
        this.load.audio('shop-select', 'Sounds/ev_shop_select.mp3');
        this.load.audio('score-simple', 'Sounds/ev_score_simple.mp3');
        for (let i = 1; i <= 10; i++){
            this.load.audio(`score-perfect-${i}`, `Sounds/ev_score_perfect_${i}.mp3`);
        }
        this.load.audio('logo', 'Sounds/theme_sounds/christmas/ev_logo.mp3');
        this.load.audio('border-0', 'Sounds/ev_border_ball_0.mp3');
        this.load.audio('border-7', 'Sounds/ev_border_ball_7.mp3');
        this.load.audio('border-10', 'Sounds/ev_border_ball_10.mp3');
        this.load.audio('border-13', 'Sounds/ev_border_ball_13.mp3');
        this.load.audio('border-16', 'Sounds/ev_border_ball_16.mp3');
        this.load.audio('border-17', 'Sounds/ev_border_ball_17.mp3');
        this.load.audio('border-32', 'Sounds/ev_border_ball_32.mp3');
        this.load.audio('border-64', 'Sounds/ev_border_ball_0.mp3');
        this.load.audio('net-0', 'Sounds/ev_collision_net_0.mp3');
        this.load.audio('net-1', 'Sounds/ev_collision_net_1.mp3');
        this.load.audio('net-2', 'Sounds/ev_collision_net_2.mp3');
        this.load.audio('release-1', 'Sounds/ev_release_low.mp3');
        this.load.audio('release-2', 'Sounds/ev_release_mid.mp3');
        this.load.audio('release-3', 'Sounds/ev_release_high.mp3');
        this.load.audio('star-1', 'Sounds/ev_star_multiplier_2.mp3');
        this.load.audio('star-2', 'Sounds/ev_star_multiplier_3.mp3');
        this.load.audio('star-3', 'Sounds/ev_star_multiplier_4.mp3');
        this.load.audio('star-4', 'Sounds/ev_coin.mp3');
        this.load.audio('star-5', 'Sounds/ev_coin_green.mp3');
        this.load.audio('star-6', 'Sounds/ev_coin_red.mp3');
        this.load.audio('star-7', 'Sounds/ev_coin_purple.mp3');
        this.load.audio('gameover', 'Sounds/burn_on_basket_touch.mp3');
        this.load.audio('outtime', 'Sounds/timer_buzz.mp3');
        this.load.audio('timer-1', 'Sounds/timer_1.mp3');
        this.load.audio('timer-2', 'Sounds/timer_2.mp3');
        this.load.audio('confetti-1', 'Sounds/confetti_burst_1.mp3');
        this.load.audio('confetti-2', 'Sounds/ev_confetti_melody.mp3');
        this.load.audio('start-fire', 'Sounds/burn_start.mp3');
        this.load.audio('fire-shot1', 'Sounds/ev_fireball_release_1.mp3');
        this.load.audio('fire-shot2', 'Sounds/ev_fireball_release_2.mp3');
        this.load.audio('fire-shot3', 'Sounds/ev_fireball_release_3.mp3');

        // map
        this.load.json('challenge1-data', 'maps/challenge1.tmj');
        this.load.json('challenge2-data', 'maps/challenge2.tmj');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        PointManager.init();
        Settings.init();
        // this.time.delayedCall(5000, () => {
            this.scene.start('Game');
        // });
    }
}
