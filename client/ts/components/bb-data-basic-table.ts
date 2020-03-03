declare var rxjs: any;
declare var simpleDatatables: any;
import { BbDataAbstractClass } from '../core/bb-data-abstract-class';
import { BbDataService, IBbData } from '../core/bb-data-service';
import { BbDataState, IBbDataState } from '../core/bb-data-state';
export class BbDataBasicTableComponent extends BbDataAbstractClass {
    static get observedAttributes() {
        return ['queryname', 'select', 'type', 'format'];
    }
    private data: any; // BehaviorSubject()
    private table: any;
    private dataTable: any;
    private bbDataService: BbDataService = new BbDataService();
    private unsubscribe: any = new rxjs.Subject();
    private template: any;
    private queryName: string;
    private select: string;
    private type: string;
    private format: string;
    private dataState: IBbDataState;

    constructor() {
        super();
        // ts can be annoying, se we create a reference to this class
        // slots getters and setters are dynamically added to the class
        // so creating self at the top level will reference the current element state
        // remove this comment if you are experiencing issue with access slots
        // then reference this.self[slotName] instead of this.slotName
        // const self: any = this;

        // this.template = window.document.createElement('table');
        this.template = window.document.getElementById(
            'bb-data-table-basic-tmpl'
        );
        // console.log('[Bb Data Table - Basic Loaded]');
        this.attachShadow({ mode: 'open' });
        // this.shadowRoot.appendChild(this.template);
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.queryName = this.getAttribute('queryName');
        this.select = this.getAttribute('select');
        this.type = this.getAttribute('type');
        this.format = this.getAttribute('format');
        // console.log(`[queryName] ${this.queryName}`);
        // this.updateTable({});
        this.data = this.bbDataService.runQuery(this.queryName);
        this.dataState = new BbDataState(this.queryName);
    }

    public connectedCallback() {
        this.data
            .pipe(
                rxjs.operators.takeUntil(this.unsubscribe),
                rxjs.operators.filter((data: IBbData) => data !== null),
                rxjs.operators.switchMap(async (data: IBbData) => {
                    // mutate the state if needed then return the new state
                    // const _state: IBbDataState = { ...data };
                    // return _state;
                    // for now just return the data as state as we do not know what data
                    // we are returning, return as a copy for demostrative purposes
                    return data;
                })
            )
            .subscribe((data: IBbData) => {
                // console.log('[this.data.pipe.subscribe]', data);
                this.dataState.updateState(data);
                this.updateTable(data);

                // if you want this to be one-time and not streamed this disconnect...
                // this.disconnectedCallback();
            });

        // this.dataState.subscribe((data: any) => this.dataTable.import(data));
    }

    public disconnectedCallback() {
        this.unsubscribe.next();
    }

    // Called anytime the 'selected' attribute is changed
    // BbDataAbstractClass contains this function, so consider
    // this as an override
    // public attributeChangedCallback(attrName: any, oldVal: any, newVal: any) {
    //     if (oldVal !== newVal) {
    //         console.log(attrName, oldVal, newVal);
    //     }
    //     this[attrName] = newVal;
    // }

    public updateTable(data: any) {
        // this.dataTable.import(data);
        // console.log(this.table);

        this.table = this.shadowRoot.querySelector('table');
        this.dataTable = new simpleDatatables.DataTable(this.table, {
            data,
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
