// PointManager.ts

export default class PointManager {
    private static currentScore : number = 0;
    private static money: number = 0;

    public static init(): void {
        this.currentScore = 0;
        this.money = Number(localStorage.getItem('money'));
    }

    public static checkHighScore(): void{
        const highScoreStr = localStorage.getItem('highScore');
        const highScore = highScoreStr !== null ? Number(highScoreStr) : 0;
        if (PointManager.currentScore > highScore){
            localStorage.setItem('highScore', JSON.stringify(PointManager.currentScore));
        }
    }

    public static getCurrentScore(): number {
        return PointManager.currentScore;
    }

    public static setScore(Scores: number): void {
        PointManager.currentScore = Scores;
    }

    public static setMoney(money: number): void {
        PointManager.money = money;
        localStorage.setItem('money', JSON.stringify(PointManager.money));
    }

    public static getMoney(): number {
        return PointManager.money;
    }

    public static resetScore(): void {
        PointManager.currentScore = 0;
    }
}