declare var rxjs: any;
declare var simpleDatatables: any;
import { BbDataAbstractClass } from '../core/bb-data-abstract-class';
import { BbDataService, IBbData } from '../core/bb-data-service';
import { BbDataState, IBbDataState } from '../core/bb-data-state';
export class BbDataBasicTableAlt2Component extends BbDataAbstractClass {
    static get observedAttributes() {
        return ['queryname', 'select', 'type', 'format'];
    }
    private data: any; // BehaviorSubject()
    private table: any;
    private dataTable: any;
    private bbDataService: BbDataService = new BbDataService();
    private template: any;
    private queryName: string;
    private select: string;
    private type: string;
    private format: string;
    private self: any;
    constructor() {
        super();
        // ts can be annoying, se we create a reference to this class
        // slots getters and setters are dynamically added to the class
        // so creating self at the top level will reference the current element state
        // remove this comment if you are experiencing issue with access slots
        // then reference this.self[slotName] instead of this.slotName
        this.self = this;

        // this.template = window.document.createElement('table');
        this.template = window.document.getElementById(
            'bb-data-table-basic-tmpl-alt'
        );
        // console.log('[Bb Data Table - Basic Loaded]');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.queryName = this.getAttribute('queryname');
        this.select = this.getAttribute('select');
        this.type = this.getAttribute('type');
        this.format = this.getAttribute('format');
        console.log(`[queryName] ${this.queryName}`);
    }

    public connectedCallback() {}

    public disconnectedCallback() {}

    // Called anytime the 'selected' attribute is changed
    // BbDataAbstractClass contains this function, so consider
    // this as an override
    public async attributeChangedCallback(
        attrName: any,
        oldVal: any,
        newVal: any
    ) {
        if (oldVal !== newVal && attrName === 'queryname' && newVal) {
            console.log(attrName, oldVal, newVal);
            this[attrName] = newVal;
            const data = await this.bbDataService.runQuery2(newVal);
            this.data = data[newVal];
            console.log('[change detection]', this.data);
            this.updateTable();
        }
    }

    public updateTable() {
        console.log('[updateTable] re-rendering table data...');
        console.log('=== DATA ===/>', this.data);
        this.table = this.shadowRoot.querySelector('table');
        this.table.innerHTML = '';
        // this.dataTable = null;
        this.dataTable = new simpleDatatables.DataTable(this.table, {
            data: this.data,
            columns: [
                {
                    select: +this.select,
                    type: this.type,
                    format: this.format
                }
            ]
        });
    }
}
