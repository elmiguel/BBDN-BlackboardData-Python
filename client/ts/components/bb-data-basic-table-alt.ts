declare var rxjs: any;
declare var simpleDatatables: any;
import { BbDataAbstractClass } from '../core/bb-data-abstract-class';
import { BbDataService, IBbData } from '../core/bb-data-service';
import { BbDataState, IBbDataState } from '../core/bb-data-state';
export class BbDataBasicTableAltComponent extends BbDataAbstractClass {
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
    private queryNameSub: any = new rxjs.BehaviorSubject('test');
    private select: string;
    private type: string;
    private format: string;
    private self: any;
    private dataState: any = new BbDataState();
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
        // this.data = this.bbDataService.runQuery(this.queryName);
    }

    public connectedCallback() {
        this.dataState.state.subscribe((data: any) => {
            console.log('State Changed!');
            console.log(data);
        });
        this.updateData();
    }

    public updateData() {
        rxjs.combineLatest([this.queryNameSub, this.dataState.state])
            .pipe(
                rxjs.operators.takeUntil(this.unsubscribe),
                rxjs.operators.filter(
                    ([queryName, dataState]: [string, any]) => queryName
                ),
                rxjs.operators.flatMap(
                    ([queryName, dataState]: [string, any]) => {
                        console.log(`The current queryName....`, queryName);
                        console.log(`The current dataState....`, dataState);
                        if (
                            Object.keys(dataState).length === 0 ||
                            !dataState ||
                            !dataState.hasOwnProperty(queryName)
                        ) {
                            this.bbDataService.runQuery(queryName);
                        }
                        return rxjs.combineLatest([
                            this.queryNameSub,
                            this.dataState.getStateSlice(queryName)
                        ]);
                    }
                ),
                rxjs.operators.distinctUntilChanged()

                // rxjs.operators.map(([queryName, dataState]: [string, any]) =>
                //     this.bbDataService.runQuery(queryName)
                // ),
                // rxjs.operators.map(
                //     async ([queryName, data]: [string, IBbData]) => {
                //         // mutate the state if needed then return the new state
                //         const _state: IBbDataState = { queryName: data };
                //         // return _state;
                //         // for now just return the data as state as we do not know what data
                //         // we are returning, return as a copy for demostrative purposes
                //         this.dataState.updateState(_state);
                //     }
                // )
            )
            .subscribe(([queryName, dataState]: [string, any]) => {
                console.log('[this.data.pipe.subscribe]');
                console.log(queryName);
                console.log(dataState);
                // if you want this to be one-time and not streamed this disconnect...
                // this.disconnectedCallback();
            });
    }

    public disconnectedCallback() {
        this.unsubscribe.next();
    }

    // Called anytime the 'selected' attribute is changed
    // BbDataAbstractClass contains this function, so consider
    // this as an override
    public async attributeChangedCallback(
        attrName: any,
        oldVal: any,
        newVal: any
    ) {
        if (oldVal !== newVal) {
            // console.log(attrName, oldVal, newVal);
            if (attrName === 'queryname' && newVal) {
                this[attrName] = newVal;
                this.queryNameSub.next(newVal);
            }
        }
    }

    public updateTable(data: any) {
        this.table = this.shadowRoot.querySelector('table');
        this.table.innerHTML = '';
        this.dataTable = null;
        console.log('in bewtween data loading.......');
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
