declare var window: Window & typeof globalThis;

// import { BbDataBasicTableComponent } from './components/bb-data-basic-table';
import { BbDataBasicTableAltComponent } from './components/bb-data-basic-table-alt';
import { BbDataBasicTableAlt2Component } from './components/bb-data-basic-table-alt-2';

// customElements.define('bb-data-table-basic', BbDataBasicTableComponent);
// customElements.define('bb-data-table-basic-alt', BbDataBasicTableAltComponent);
customElements.define(
    'bb-data-table-basic-alt2',
    BbDataBasicTableAlt2Component
);
// console.log('created irsc custom elements...');

const bbDataDemo = window.document.getElementById('bb-data-demo');
const queries = window.document.querySelectorAll('.query');

// tslint:disable-next-line:only-arrow-functions
queries.forEach(function(el) {
    // tslint:disable-next-line: only-arrow-functions
    el.addEventListener('click', function(e) {
        e.preventDefault();
        const btn: any = e.target;
        const config = JSON.parse(btn.dataset.queryConfig);
        bbDataDemo.setAttribute('queryname', config.queryname);
    });
});
