declare var window: Window & typeof globalThis;
declare var simpleDatatables: any;

import { BbDataBasicTableComponent } from './components/bb-data-basic-table';
import { BbDataBasicTableAltComponent } from './components/bb-data-basic-table-alt';

customElements.define('bb-data-table-basic', BbDataBasicTableComponent);
customElements.define('bb-data-table-basic-alt', BbDataBasicTableAltComponent);
// console.log('created irsc custom elements...');
const bbDataDemo = window.document.getElementById('bb-data-demo');

const queries = window.document.querySelectorAll('.query');
console.log(queries);
// tslint:disable-next-line:only-arrow-functions
queries.forEach(function(el, idx, parent) {
    console.log(el, idx, parent);
    // tslint:disable-next-line: only-arrow-functions
    el.addEventListener('click', function(e) {
        e.preventDefault();
        const btn: any = e.target;
        const config = JSON.parse(btn.dataset.queryConfig);
        console.log(config);
        bbDataDemo.setAttribute('queryname', config.queryname);
    });
});
