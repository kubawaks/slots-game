import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

// Extend Reels class by PIXI.Container to get rid of container property
export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.createSymbols();
        this.container.mask = this.createMask();
    }

    private createSymbols(): void {
        for(let i = 0; i< this.symbolCount; i++) {
            const symbol = this.container.addChild(this.createRandomSymbol());
            symbol.width = this.symbolSize;
            symbol.height = this.symbolSize;
            symbol.x = this.symbolSize * i;

            this.symbols.push(symbol);
        }
    }

    // End of spin could work smoother, consider to check implementation and try to fix it
    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        for (let symbol of this.symbols) {
            if (symbol.x < this.symbolSize * this.symbolCount) {
                symbol.x += this.speed * delta
            } else {
                symbol.x = 0;
                symbol.texture = PIXI.Texture.from(this.getRandomSymbolTextureName());
            }
        }

        // If we're stopping, slow down the reel
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    private snapToGrid(): void {
        for (let symbol of this.symbols) {
            symbol.x = this.symbolSize * this.symbols.indexOf(symbol);
        }
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        // The reel will gradually slow down in the update method
        this.isSpinning = false;
    }

    private createRandomSymbol(): PIXI.Sprite {
        return new PIXI.Sprite(AssetLoader.getTexture(this.getRandomSymbolTextureName()));
    }

    private getRandomSymbolTextureName(): string {
        return SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];
    }

    // Each reel has own mask, I would to implement one mask for entire machine instead of mask per reel.
    private createMask(): PIXI.Graphics {
        const mask = new PIXI.Graphics();
        mask.x = 0;
        mask.y = 0;
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, this.symbolSize * this.symbolCount, this.symbolSize);
        mask.endFill();

        return this.container.addChild(mask);
    }

}
