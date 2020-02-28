declare var rxjs: any;
declare var simpleDatatables: any;
import { BbDataAbstractClass } from '../core/bb-data-abstract-class';
import { BbDataService, IBbData } from '../core/bb-data-service';
import { BbDataState, IBbDataState } from '../core/bb-data-state';
export class BbDataBasicTableComponent extends BbDataAbstractClass {
    static get observedAttributes() {
        return ['queryname'];
    }
    private data: any;
    private table: any;
    private dataTable: any;
    private bbDataService: BbDataService = new BbDataService();
    private unsubscribe: any = new rxjs.Subject();
    private template: any;
    private queryName: string;
    private dataState: IBbDataState;

    constructor() {
        super();
        // ts can be annoying, se we create a reference to this class
        // slots getters and setters are dynamically added to the class
        // so creating self at the top level will reference the current element state
        // remove this comment if you are experiencing issue with access slots
        // then reference this.self[slotName] instead of this.slotName
        // const self: any = this;

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

    public connectedCallback() {
        this.data
            .pipe(
                rxjs.operators.takeUntil(this.unsubscribe),
                rxjs.operators.filter((data: IBbData) => data !== null),
                rxjs.operators.map((data: IBbData) => {
                    // mutate the state if needed then return the new state
                    // const _state: IBbDataState = { ...data };
                    // return _state;

                    // for now just return the data as state as we do not know what data
                    // we are returning, return as a copy for demostrative purposes
                    return { ...data };
                })
            )
            .subscribe((data: IBbData) => {
                const state = {};
                state[this.queryName] = data;
                this.dataState.updateState(state);
                // if you want this to be one-time and not streamed this disconnect...
                this.disconnectedCallback();
            });

        this.dataState
            .getStateSlice(this.queryName)
            .subscribe((data: IBbData) => {
                console.log(`[dataState.getStateSlice.subscribe()]`, data);
                this.dataTable.data = null;
                this.dataTable.import(data);
                // this.dataTable.update();
                // this.dataTable.refresh();
            });
    }

    public disconnectedCallback() {
        this.unsubscribe.next();
    }
}
