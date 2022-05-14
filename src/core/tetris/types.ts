interface Point<T> {
    x: number;
    y: number;
    value: T;
}

type PositionPoint = Pick<Point<unknown>, 'x' | 'y'>;

type Figure<T = unknown> = {
    rotationDegrees: number[];
    points: Point<T>[];
};

type Field<T = unknown> = (T | undefined)[][];

interface Tetris<T = unknown> {
    get figure(): Figure<T>; // Удалить в пользу getValue()

    getValue(position: PositionPoint): T | undefined;

    rotate(): void;
    moveLeft(): void;
    moveRight(): void;
    moveDown(): void;
}

export type {Tetris, Field, Figure, Point, PositionPoint};
