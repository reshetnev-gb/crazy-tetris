import type {Tetris} from 'core/tetris/types';
import TetrisImpl from 'core/tetris/tetris-impl';
import figureFactoryImpl, {FigureValue} from 'core/tetris/figures/figure-factory-impl';

type Pixel = {
    x: number;
    y: number;
    element: HTMLElement;
};

interface Canvas {
    element: HTMLElement;
    pixels: Pixel[];
}

function createCanvas(rows: number, cols: number, pixel: number): Canvas {
    const canvasElement = window.document.getElementById('canvas'); // TODO make create

    if (!canvasElement) {
        throw new Error('canvas is null');
    }

    const createPixel = (x: number, y: number): Pixel => {
        const pixelElement = document.createElement('div');
        pixelElement.style.position = 'absolute';
        pixelElement.style.top = `${pixel * y}px`;
        pixelElement.style.left = `${pixel * x}px`;
        pixelElement.style.width = pixelElement.style.height = `${pixel}px`;
        pixelElement.style.border = '1px solid #999';
        pixelElement.style.boxSizing = 'border-box';
        pixelElement.style.background = 'black';

        return {
            x,
            y,
            element: pixelElement
        };
    };

    const pixels = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const pixel = createPixel(j, i);
            canvasElement.appendChild(pixel.element);
            pixels.push(pixel);
        }
    }

    return {
        element: canvasElement,
        pixels: pixels
    };
}

function drawTetris(canvas: Canvas, tetris: Tetris<FigureValue>): void {
    for (const pixel of canvas.pixels) {
        const value = tetris.getValue(pixel);

        if (value) {
            pixel.element.innerHTML = '';
            pixel.element.appendChild(value);
        } else if (pixel.element.children.length !== 0) {
            pixel.element.innerHTML = '';
        }
    }
}

function initKeyboard(tetris: Tetris): void {
    window.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowLeft') {
            tetris.moveLeft();
        } else if (event.code === 'ArrowRight') {
            tetris.moveRight();
        } else if (event.code === 'ArrowDown') {
            tetris.moveDown();
        } else if (event.code === 'ArrowUp') {
            tetris.rotate();
        }
    });
}

const ROWS = 20;
const COLS = 10;
const PIXEL = 20;

function main(): void {
    const canvas = createCanvas(ROWS, COLS, PIXEL);
    const tetris = new TetrisImpl<FigureValue>({
        rows: ROWS,
        cols: COLS,
        figureFactory: figureFactoryImpl
    });

    setInterval(() => {
        tetris.moveDown();
    }, 400);

    initKeyboard(tetris);

    const draw = () => {
        drawTetris(canvas, tetris);
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
}

// TODO: add tests
main();
