import type {Tetris, Field, PositionPoint} from 'core/tetris/types';
import type {Figure, FigureFactory} from 'core/tetris/figures/types';

interface TetrisImplParams<T> {
    rows: number;
    cols: number;
    figureFactory: FigureFactory<T>;
}

class TetrisImpl<T> implements Tetris<T> {
    private _params: TetrisImplParams<T>;
    private _field: Field<T>;
    private _currentFigure: Figure<T>;

    constructor(params: TetrisImplParams<T>) {
        this._params = params;
        this._field = this._createField();
        this._currentFigure = this._createFigure();
    }

    private _createField(): Field<T> {
        const field = new Array(this._params.rows).fill(null).map(() => {
            const row = new Array(this._params.cols).fill(undefined);
            return row;
        });
        return field;
    }

    private _createFigure(): Figure<T> {
        const figure = this._params.figureFactory.create(this._field);
        return figure;
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

        let i = this._field.length - 1;
        while (i >= 0) {
            const row = this._field[i];
            const isFilledRow = row.every((cell) => cell !== undefined);
            if (isFilledRow) {
                this._field.splice(i, 1);
                this._field.unshift(createRow());
                continue;
            }
            i--;
        }
    }

    getValue(position: PositionPoint): T | undefined {
        const fieldValue = this._field[position.y][position.x];
        const figureValue = this._currentFigure.points.find(
            (point) => point.x === position.x && point.y === position.y
        )?.value;

        return fieldValue || figureValue;
    }

    rotate(): void {
        this._currentFigure.rotate();
    }

    moveLeft(): void {
        this._currentFigure.moveLeft();
    }

    moveRight(): void {
        this._currentFigure.moveRight();
    }

    moveDown(): void {
        this._currentFigure.moveDown();
        if (this._currentFigure.active) {
            return;
        }

        this._currentFigure.setToField();
        this._removeFilledRows();
        if (this._checkOverflow()) {
            window.alert("Let's start new game !");
            this._field = this._createField();
        }
        this._currentFigure = this._createFigure();
    }
}

export default TetrisImpl;
