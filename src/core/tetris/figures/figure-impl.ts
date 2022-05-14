import {Figure, Point} from 'core/tetris/figures/types';
import {Field} from 'core/tetris/types';

function degToRad(degree: number): number {
    return (degree * Math.PI) / 180;
}

const ROTATE_DEGREE = 90;

class FigureImpl<T> implements Figure<T> {
    private _points: Point<T>[];
    private _field?: Field<unknown>;

    constructor(points: Point<T>[]) {
        this._points = points;
    }

    private _getField(): Field<unknown> {
        if (!this._field) {
            throw new Error('The field is not set.');
        }
        return this._field;
    }

    private _hasIntersections(points: Point<T>[]): boolean {
        const field = this._getField();
        const rowLength = field.length - 1;
        const colLength = field[0].length - 1;

        return points.some((point) => {
            const hasBoundsIntersection = point.y < 0 || point.y > rowLength || point.x < 0 || point.x > colLength;
            const hasInFieldIntersection = field[point.y]?.[point.x] !== undefined;

            return hasBoundsIntersection || hasInFieldIntersection;
        });
    }

    private _moveFigure(deltaX: number, deltaY: number): void {
        const newPoints = this._points.map((point) => ({...point, x: point.x + deltaX, y: point.y + deltaY}));
        if (this._hasIntersections(newPoints)) {
            return;
        }

        this._points = newPoints;
    }

    protected _rotate(degree: number): void {
        const radian = degToRad(degree);
        const cos = Math.round(Math.cos(radian));
        const sin = Math.floor(Math.sin(radian));

        const rotatePoint = this._points[Math.floor((this._points.length - 1) / 2)];
        const newPoints = this._points.map((point) => {
            const x = (point.x - rotatePoint.x) * cos - (point.y - rotatePoint.y) * sin + rotatePoint.x;
            const y = (point.x - rotatePoint.x) * sin + (point.y - rotatePoint.y) * cos + rotatePoint.y;
            return {
                ...point,
                x,
                y
            };
        });

        if (this._hasIntersections(newPoints)) {
            return;
        }

        this._points = newPoints;
    }

    rotate(): void {
        this._rotate(ROTATE_DEGREE);
    }

    moveLeft(): void {
        this._moveFigure(-1, 0);
    }

    moveRight(): void {
        this._moveFigure(1, 0);
    }

    moveDown(): void {
        this._moveFigure(0, 1);
    }
}
