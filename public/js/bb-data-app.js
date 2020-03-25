import { BbDataBasicTableAlt2Component } from './components/bb-data-basic-table-alt-2';
customElements.define('bb-data-table-basic-alt2', BbDataBasicTableAlt2Component);
const bbDataDemo = window.document.getElementById('bb-data-demo');
const queries = window.document.querySelectorAll('.query');
queries.forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        const btn = e.target;
        const config = JSON.parse(btn.dataset.queryConfig);
        bbDataDemo.setAttribute('queryname', config.queryname);
    });
});
//# sourceMappingURL=bb-data-app.js.map