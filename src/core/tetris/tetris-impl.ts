import {Tetris, Figure, Field, Point, PositionPoint} from './types';

interface FigureFactory<T> {
    create: () => Figure<T>;
}

interface TetrisImplParams<T> {
    rows: number;
    cols: number;
    figureFactory: FigureFactory<T>;
}

function degToRad(degree: number): number {
    return (degree * Math.PI) / 180;
}

class TetrisImpl<T> implements Tetris<T> {
    private _params: TetrisImplParams<T>;
    private _field: Field<T>;
    private _currentFigure: Figure<T>;

    constructor(params: TetrisImplParams<T>) {
        this._params = params;
        this._currentFigure = this._createFigure();
        this._field = this._createField();
    }

    private _createField(): Field<T> {
        const field = new Array(this._params.rows).fill(null).map(() => {
            const row = new Array(this._params.cols).fill(undefined);
            return row;
        });

        return field;
    }

    private _createFigure(): Figure<T> {
        const figure = this._params.figureFactory.create();

        const deltaX = Math.floor((this._params.cols - 1) / 2);

        const movedFigure = this._moveFigure(figure, deltaX, 0);
        return movedFigure;
    }

    private _setToField(figure: Figure<T>): void {
        figure.points.forEach((point) => {
            this._field[point.y][point.x] = point.value;
        });
    }

    private _rotate(figure: Figure<T>): Figure<T> {
        const degree = figure.rotationDegrees.shift();
        if (degree === undefined) {
            return figure;
        }
        figure.rotationDegrees.push(degree);

        const rotatePoint = figure.points[Math.floor((figure.points.length - 1) / 2)];
        const radian = degToRad(degree);
        const cos = Math.round(Math.cos(radian));
        const sin = Math.floor(Math.sin(radian));

        return {
            ...figure,
            points: figure.points.map((point) => {
                const x = (point.x - rotatePoint.x) * cos - (point.y - rotatePoint.y) * sin + rotatePoint.x;
                const y = (point.x - rotatePoint.x) * sin + (point.y - rotatePoint.y) * cos + rotatePoint.y;

                return {
                    ...point,
                    x,
                    y
                };
            })
        };
    }

    private _moveFigure(figure: Figure<T>, deltaX: number, deltaY: number): Figure<T> {
        return {
            ...figure,
            points: figure.points.map((point) => ({
                ...point,
                x: point.x + deltaX,
                y: point.y + deltaY
            }))
        };
    }

    private _hasIntersections(figure: Figure<T>): boolean {
        return figure.points.some((point) => {
            const hasBoundsIntersection =
                point.y < 0 || point.y > this._params.rows - 1 || point.x < 0 || point.x > this._params.cols - 1;

            if (hasBoundsIntersection) {
                return true;
            }

            const hasInFieldIntersection = this._field[point.y][point.x];
            return hasInFieldIntersection;
        });
    }

    private _checkOverflow(): boolean {
        const upperRow = this._field[0];
        const isOverflowed = upperRow.some((cell) => cell !== undefined);
        return isOverflowed;
    }

    private _removeFilledRows(): void {
        const createRow = () => {
            return new Array(this._params.cols).fill(undefined);
        };

        for (const row of this._field) {
            const isFilledRow = row.every((cell) => cell !== undefined);
            if (isFilledRow) {
                this._field.unshift(createRow());
                this._field.pop();
            }
        }
    }

    get figure(): Figure<T> {
        return this._currentFigure;
    }

    getValue(position: PositionPoint): T | undefined {
        const fieldValue = this._field[position.y][position.x];
        return fieldValue;
    }

    rotate(): void {
        const rotatedFigure = this._rotate(this._currentFigure);
        if (!this._hasIntersections(rotatedFigure)) {
            this._currentFigure = rotatedFigure;
        }
    }

    moveLeft(): void {
        const movedFigure = this._moveFigure(this._currentFigure, -1, 0);
        if (!this._hasIntersections(movedFigure)) {
            this._currentFigure = movedFigure;
        }
    }

    moveRight(): void {
        const movedFigure = this._moveFigure(this._currentFigure, 1, 0);
        if (!this._hasIntersections(movedFigure)) {
            this._currentFigure = movedFigure;
        }
    }

    moveDown(): void {
        const movedFigure = this._moveFigure(this._currentFigure, 0, 1);
        if (!this._hasIntersections(movedFigure)) {
            this._currentFigure = movedFigure;
        } else {
            this._setToField(this._currentFigure);
            if (this._checkOverflow()) {
                window.location.reload();
            }
            this._removeFilledRows();
            this._currentFigure = this._createFigure();
        }
    }
}

export default TetrisImpl;
