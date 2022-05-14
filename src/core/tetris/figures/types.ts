import type {Field} from 'core/tetris/types';

interface Point<T = unknown> {
    x: number;
    y: number;
    value: T;
}

interface Figure<T = unknown> {
    get points(): Point<T>[];
    get active(): boolean;

    setToField(): void;

    moveLeft(): void;
    moveRight(): void;
    moveDown(): void;
    rotate(): void;
}

interface FigureFactory<T> {
    create: (field: Field<T>) => Figure<T>;
}

export type {Figure, Point, FigureFactory};
