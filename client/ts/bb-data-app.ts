declare var window: Window & typeof globalThis;
declare var simpleDatatables: any;

import { BbDataBasicTableComponent } from './components/bb-data-basic-table';

customElements.define('bb-data-table-basic', BbDataBasicTableComponent);
console.log('created irsc custom elements...');
