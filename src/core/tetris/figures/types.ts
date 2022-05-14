interface Point<T> {
    x: number;
    y: number;
    value: T;
}

interface Figure<T = unknown> {
    get points(): Point<T>;

    moveLeft(): void;
    moveRight(): void;
    moveDown(): void;
    rotate(): void;
}

export type {Figure, Point};
