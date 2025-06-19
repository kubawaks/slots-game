import {Howl} from 'howler';

export class SoundsPlayer {
    private static sounds: Map<string, Howl>;

    constructor() {
        SoundsPlayer.sounds = new Map();
    }

    add(soundName: string, url: string): void {
        SoundsPlayer.sounds.set(soundName, new Howl({
            src: url,
        }))
    }

    static play(name: string) {
        if(this.sounds.has(name)) {
            this.sounds.get(name)?.play();
        }
    }

    static stop(name: string): void {
        if(this.sounds.has(name)) {
            this.sounds.get(name)?.stop();
        }
    }
}