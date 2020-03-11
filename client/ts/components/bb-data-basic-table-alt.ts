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
    private queryNameSub: any = new rxjs.BehaviorSubject(null);
    private select: string;
    private type: string;
    private format: string;
    private self: any;
    private dataState: any = new BbDataState();
    private loading: boolean = false;
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

    public connectedCallback() {
        this.updateData();
    }

    public updateData() {
        rxjs.combineLatest([this.queryNameSub])
            .pipe(
                rxjs.operators.takeUntil(this.unsubscribe),
                rxjs.operators.filter(([queryName]: [string]) => queryName),
                rxjs.operators.distinctUntilChanged()
            )
            .subscribe(([queryName]: [string]) => {
                console.log('[this.data.pipe.subscribe]');
                this.loading = true;
                console.log(`data is loading...${this.loading}`);
                this.bbDataService.runQuery(queryName);

                // if you want this to be one-time and not streamed...
                // this.disconnectedCallback();
            });

        // this.dataState.state.subscribe((data: any) => {
        //     console.log('State Changed!');
        //     this.loading = false;
        //     console.log(
        //         `data should be loaded. loading should be false: ${this.loading}`
        //     );

        //     if (Object.keys(data).length > 0) {
        //         this.updateTable(data);
        //     }
        // });

        this.addEventListener('bb-data-update', () => {
            this.dataState
                .getStateSlice(this.queryName)
                .pipe(rxjs.operators.take(1))
                .subscribe((data: any) => {
                    this.self.updateTable(data);
                });
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
        if (oldVal !== newVal && attrName === 'queryname' && newVal) {
            // console.log(attrName, oldVal, newVal);
            this[attrName] = newVal;
            this.queryNameSub.next(newVal);
        }
    }

    public updateTable(data: any) {
        console.log('[updateTable] re-rendering table data...');
        console.log('=== DATA ===>', data);
        if (!this.loading) {
            console.log(`loading is false, apply new data to table...`);
            this.table = this.shadowRoot.querySelector('table');
            this.table.innerHTML = '';
            this.dataTable = null;
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
}
