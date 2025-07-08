// PointManager.ts

export default class PointManager {
    private static currentScore : number = 0;
    private static money: number = 0;
    private static currentLevel: number = 1;

    public static init(): void {
        this.currentLevel = Number(localStorage.getItem('currentLevel')) || 1;
        this.currentScore = 0;
        this.money = Number(localStorage.getItem('money')) || 0;
    }

    public static checkHighScore(): void{
        const highScoreStr = localStorage.getItem('highScore');
        const highScore = highScoreStr !== null ? Number(highScoreStr) : 0;
        if (PointManager.currentScore > highScore){
            localStorage.setItem('highScore', JSON.stringify(PointManager.currentScore));
        }
    }

    public static saveMoney(): void {
        localStorage.setItem('money', JSON.stringify(PointManager.money));
    }

    public static saveCurrentLevel(): void {
        localStorage.setItem('currentLevel', JSON.stringify(PointManager.currentLevel));
    }

    public static setCurrentLevel(level: number): void {
        PointManager.currentLevel = level;
    }

    public static getCurrentLevel(): number {
        return PointManager.currentLevel;
    }

    public static getHighScore(): number {
        return Number(localStorage.getItem('highScore'));
    }

    public static getCurrentScore(): number {
        return PointManager.currentScore;
    }

    public static setScore(Scores: number): void {
        PointManager.currentScore = Scores;
    }

    public static setMoney(money: number): void {
        PointManager.money = money;
    }

    public static getMoney(): number {
        return PointManager.money;
    }

    public static resetScore(): void {
        PointManager.currentScore = 0;
    }

    public static clearData(): void {
        localStorage.clear();
    }
}