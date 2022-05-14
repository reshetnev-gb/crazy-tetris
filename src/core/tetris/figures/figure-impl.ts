import {Figure, Point} from 'core/tetris/figures/types';
import {Field} from 'core/tetris/types';

function degToRad(degree: number): number {
    return (degree * Math.PI) / 180;
}

const ROTATE_DEGREE = 90;

class FigureImpl<T> implements Figure<T> {
    private _isActive = true;
    private _points: Point<T>[];
    private _field: Field<unknown>;

    constructor(points: Point<T>[], field: Field<unknown>) {
        this._field = field;
        this._points = points;

        this._initPosition();
    }

    private _initPosition(): void {
        const colLength = this._field[0].length - 1;
        const deltaX = Math.floor(colLength / 2);
        const deltaY = 0;
        this._points = this._points.map((point) => ({...point, x: point.x + deltaX, y: point.y + deltaY}));
    }

    private _hasIntersections(points: Point<T>[]): boolean {
        const rowLength = this._field.length - 1;
        const colLength = this._field[0].length - 1;

        return points.some((point) => {
            const hasBoundsIntersection = point.y < 0 || point.y > rowLength || point.x < 0 || point.x > colLength;
            const hasInFieldIntersection = this._field[point.y]?.[point.x] !== undefined;

            return hasBoundsIntersection || hasInFieldIntersection;
        });
    }

    private _tryMove(deltaX: number, deltaY: number): boolean {
        const newPoints = this._points.map((point) => ({...point, x: point.x + deltaX, y: point.y + deltaY}));
        if (this._hasIntersections(newPoints)) {
            return false;
        }

        this._points = newPoints;
        return true;
    }

    protected _tryRotate(degree: number): void {
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

    get points(): Point<T>[] {
        return this._points;
    }

    get active(): boolean {
        return this._isActive;
    }

    setToField(): void {
        for (const point of this._points) {
            this._field[point.y][point.x] = point.value;
        }
    }

    rotate(): void {
        this._tryRotate(ROTATE_DEGREE);
    }

    moveLeft(): void {
        this._tryMove(-1, 0);
    }

    moveRight(): void {
        this._tryMove(1, 0);
    }

    moveDown(): void {
        this._isActive = this._tryMove(0, 1);
    }
}

export default FigureImpl;
