import TetrisImpl from 'core/tetris/tetris-impl';
import type {Figure, Tetris} from 'core/tetris/types';

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
            const pixel = createPixel(i, j);
            canvasElement.appendChild(pixel.element);
            pixels.push(pixel);
        }
    }

    return {
        element: canvasElement,
        pixels: pixels
    };
}

function drawTetris(canvas: Canvas, tetris: Tetris): void {
    for (const pixel of canvas.pixels) {
        const isFieldPixel = tetris.getValue(pixel) !== undefined;
        const isFigurePixel = tetris.figure.points.find((point) => point.x === pixel.x && point.y === pixel.y);

        pixel.element.style.background = isFieldPixel ? 'white' : isFigurePixel ? 'red' : 'black';
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

const ROWS = 10;
const COLS = 10;
const PIXEL = 20;
const FIGURES: Figure[] = [
    // O
    {
        rotationDegrees: [],
        points: [
            {x: 0, y: 0, value: {}},
            {x: 1, y: 0, value: {}},
            {x: 0, y: 1, value: {}},
            {x: 1, y: 1, value: {}}
        ]
    }
    // // I
    // {
    //     rotationDegrees: [90, -90],
    //     points: [
    //         {x: 0, y: 0, value: {}},
    //         {x: 0, y: 1, value: {}},
    //         {x: 0, y: 2, value: {}},
    //         {x: 0, y: 3, value: {}}
    //     ]
    // },
    // // S
    // {
    //     rotationDegrees: [90],
    //     points: [
    //         {x: 0, y: 1, value: {}},
    //         {x: 1, y: 1, value: {}},
    //         {x: 1, y: 0, value: {}},
    //         {x: 2, y: 0, value: {}}
    //     ]
    // },
    // // Z
    // {
    //     rotationDegrees: [90],
    //     points: [
    //         {x: 0, y: 0, value: {}},
    //         {x: 1, y: 0, value: {}},
    //         {x: 1, y: 1, value: {}},
    //         {x: 2, y: 1, value: {}}
    //     ]
    // },
    // // L
    // {
    //     rotationDegrees: [90],
    //     points: [
    //         {x: 0, y: 0, value: {}},
    //         {x: 0, y: 1, value: {}},
    //         {x: 0, y: 2, value: {}},
    //         {x: 1, y: 2, value: {}}
    //     ]
    // },
    // // J
    // {
    //     rotationDegrees: [90],
    //     points: [
    //         {x: 1, y: 0, value: {}},
    //         {x: 1, y: 1, value: {}},
    //         {x: 1, y: 2, value: {}},
    //         {x: 0, y: 2, value: {}}
    //     ]
    // },
    // // T
    // {
    //     rotationDegrees: [90],
    //     points: [
    //         {x: 0, y: 0, value: {}},
    //         {x: 1, y: 0, value: {}},
    //         {x: 2, y: 0, value: {}},
    //         {x: 1, y: 1, value: {}}
    //     ]
    // }
];

function main(): void {
    const canvas = createCanvas(ROWS, COLS, PIXEL);
    const tetris = new TetrisImpl<unknown>({
        rows: ROWS,
        cols: COLS,
        figureFactory: {
            create: () => {
                const randomIndex = Math.floor(Math.random() * (FIGURES.length - 1));
                const figure = FIGURES[randomIndex];
                return figure;
            }
        }
    });

    setInterval(() => {
        tetris.moveDown();
    }, 500);

    initKeyboard(tetris);

    const draw = () => {
        drawTetris(canvas, tetris);
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
}

main();
