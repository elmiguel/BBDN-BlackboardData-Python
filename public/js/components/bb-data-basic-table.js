import { BbDataAbstractClass } from '../core/bb-data-abstract-class';
import { BbDataService } from '../core/bb-data-service';
import { BbDataState } from '../core/bb-data-state';
export class BbDataBasicTableComponent extends BbDataAbstractClass {
    constructor() {
        super();
        this.bbDataService = new BbDataService();
        this.unsubscribe = new rxjs.Subject();
        this.template = window.document.createElement('table');
        console.log('[Bb Data Table - Basic Loaded]');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.template);
        this.queryName = this.getAttribute('queryName');
        console.log(`[queryName] ${this.queryName}`);
        this.table = this.shadowRoot.querySelector('table');
        this.dataTable = new simpleDatatables.DataTable(this.table, {
            data: {},
            columns: [
                {
                    select: 3,
                    type: 'date',
                    format: 'MM/DD/YYYY'
                }
            ]
        });
        this.data = this.bbDataService.runQuery(this.queryName);
        this.dataState = new BbDataState(this.queryName);
    }
    static get observedAttributes() {
        return ['queryname'];
    }
    connectedCallback() {
        this.dataState
            .getStateSlice(this.queryName)
            .pipe(rxjs.operators.tap(console.log))
            .subscribe((data) => {
            console.log(`[dataState.getStateSlice.subscribe()]`, data);
            this.dataTable.insert(data);
        });
    }
    disconnectedCallback() {
        this.unsubscribe.next();
    }
}
//# sourceMappingURL=bb-data-basic-table.js.map