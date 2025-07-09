// Settings.ts
class Settings {
    private static prop : Record<string, any> = {};

    static init(){
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            const value = localStorage.getItem(key)!;
            try {
                this.prop[key] = JSON.parse(value);
            } catch {
                this.prop[key] = value;
            }

        }
        if (!localStorage.getItem('ball')) this.add('ball', 1);
        if (!localStorage.getItem('darkmode')) this.add('darkmode', false);
        if (!localStorage.getItem('sounds')) this.add('sounds', true);
        if (!localStorage.getItem('vibration'))this.add('vibration', false);
        this.add('ball1', true);
        // console.log(this.prop);
    }

    static get(property : string): any {
        return this.prop[property];
    }

    static add(property : string, value : any): void {
        if (!this.prop.hasOwnProperty(property)){
            Object.defineProperty(this, property, {
                configurable: true,
                enumerable: true,
                get: () => this.prop[property],
                set: (val) => { this.prop[property] = val; },
            });
        }
        this.prop[property] = value;
        localStorage.setItem(property, JSON.stringify(value));
    }

    static remove(property : string): boolean{
        if (this.prop.hasOwnProperty(property)){
            delete this.prop[property];
            return true;
        }
        return false;
    }

}
export default Settings;