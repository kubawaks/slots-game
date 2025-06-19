import {Howl} from 'howler';

export class SoundsPlayer {
    private sounds: Map<string, Howl>;

    constructor() {
        this.sounds = new Map();
    }

    add(soundName: string, url: string): void {
        this.sounds.set(soundName, new Howl({
            src: url,
        }))
    }

    play(name: string) {
        if(this.sounds.has(name)) {
            this.sounds.get(name)?.play();
        }
    }

    stop(name: string): void {
        if(this.sounds.has(name)) {
            this.sounds.get(name)?.stop();
        }
    }
}