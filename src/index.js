import {createElement, createComponent} from './core/dom';

import {observe} from './core/observe';
import {compiler} from './core/compiler';
import {def, defComponent, applyVM} from './core/helix';

const helix = {
    createElement: createElement,
    createComponent: createComponent,
    def: def,
    defComponent: defComponent,
    applyVM: applyVM
};
export  {helix};
