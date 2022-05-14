import type {Figure, FigureFactory} from 'core/tetris/figures/types';
import type {Field} from 'core/tetris/types';
import FigureImpl from 'core/tetris/figures/figure-impl';

type FigureValue = HTMLElement;

function createElement(color: string): FigureValue {
    const element = document.createElement('div');
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.backgroundColor = color;

    return element;
}

class OFigure extends FigureImpl<FigureValue> {
    constructor(field: Field) {
        const points = [
            {x: 0, y: 0, value: createElement('red')},
            {x: 1, y: 0, value: createElement('red')},
            {x: 0, y: 1, value: createElement('red')},
            {x: 1, y: 1, value: createElement('red')}
        ];
        super(points, field);
    }

    // eslint-disable-next-line
    rotate(): void {}
}

class IFigure extends FigureImpl<FigureValue> {
    constructor(field: Field) {
        const points = [
            {x: 0, y: 0, value: createElement('white')},
            {x: 0, y: 1, value: createElement('white')},
            {x: 0, y: 2, value: createElement('white')},
            {x: 0, y: 3, value: createElement('white')}
        ];
        super(points, field);
    }
}

class SFigure extends FigureImpl<FigureValue> {
    constructor(field: Field) {
        const points = [
            {x: 0, y: 1, value: createElement('green')},
            {x: 1, y: 1, value: createElement('green')},
            {x: 1, y: 0, value: createElement('green')},
            {x: 2, y: 0, value: createElement('green')}
        ];
        super(points, field);
    }
}

class ZFigure extends FigureImpl<FigureValue> {
    constructor(field: Field) {
        const points = [
            {x: 0, y: 0, value: createElement('yellow')},
            {x: 1, y: 0, value: createElement('yellow')},
            {x: 1, y: 1, value: createElement('yellow')},
            {x: 2, y: 1, value: createElement('yellow')}
        ];
        super(points, field);
    }
}

class LFigure extends FigureImpl<FigureValue> {
    constructor(field: Field) {
        const points = [
            {x: 0, y: 0, value: createElement('chartreuse')},
            {x: 0, y: 1, value: createElement('chartreuse')},
            {x: 0, y: 2, value: createElement('chartreuse')},
            {x: 1, y: 2, value: createElement('chartreuse')}
        ];
        super(points, field);
    }
}

class JFigure extends FigureImpl<FigureValue> {
    constructor(field: Field) {
        const points = [
            {x: 1, y: 0, value: createElement('cyan')},
            {x: 1, y: 1, value: createElement('cyan')},
            {x: 1, y: 2, value: createElement('cyan')},
            {x: 0, y: 2, value: createElement('cyan')}
        ];
        super(points, field);
    }
}

class TFigure extends FigureImpl<FigureValue> {
    constructor(field: Field) {
        const points = [
            {x: 0, y: 0, value: createElement('violet')},
            {x: 1, y: 0, value: createElement('violet')},
            {x: 2, y: 0, value: createElement('violet')},
            {x: 1, y: 1, value: createElement('violet')}
        ];
        super(points, field);
    }
}

const FIGURES = [OFigure, IFigure, SFigure, ZFigure, LFigure, JFigure, TFigure];

// TODO maybe: make static factory method for FigureImpl and reduce classes
const figureFactoryImpl: FigureFactory<FigureValue> = {
    create(field: Field<FigureValue>): Figure<FigureValue> {
        const randomIndex = Math.floor(Math.random() * FIGURES.length);
        const FigureClass = FIGURES[randomIndex];
        const figure = new FigureClass(field);
        return figure;
    }
};

export default figureFactoryImpl;
export type {FigureValue};
