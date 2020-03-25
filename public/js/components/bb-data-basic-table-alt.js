var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BbDataAbstractClass } from '../core/bb-data-abstract-class';
import { BbDataService } from '../core/bb-data-service';
import { BbDataState } from '../core/bb-data-state';
export class BbDataBasicTableAltComponent extends BbDataAbstractClass {
    constructor() {
        super();
        this.bbDataService = new BbDataService();
        this.unsubscribe = new rxjs.Subject();
        this.queryNameSub = new rxjs.BehaviorSubject(null);
        this.dataState = new BbDataState();
        this.loading = false;
        this.self = this;
        this.template = window.document.getElementById('bb-data-table-basic-tmpl-alt');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.queryName = this.getAttribute('queryname');
        this.select = this.getAttribute('select');
        this.type = this.getAttribute('type');
        this.format = this.getAttribute('format');
        console.log(`[queryName] ${this.queryName}`);
    }
    static get observedAttributes() {
        return ['queryname', 'select', 'type', 'format'];
    }
    connectedCallback() {
        this.updateData();
    }
    updateData() {
        rxjs.combineLatest([this.queryNameSub])
            .pipe(rxjs.operators.takeUntil(this.unsubscribe), rxjs.operators.filter(([queryName]) => queryName), rxjs.operators.distinctUntilChanged())
            .subscribe(([queryName]) => {
            console.log('[this.data.pipe.subscribe]');
            this.loading = true;
            console.log(`data is loading...${this.loading}`);
            this.bbDataService.runQuery(queryName);
        });
        this.addEventListener('bb-data-update', () => {
            this.dataState
                .getStateSlice(this.queryName)
                .pipe(rxjs.operators.take(1))
                .subscribe((data) => {
                this.self.updateTable(data);
            });
        });
    }
    disconnectedCallback() {
        this.unsubscribe.next();
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldVal !== newVal && attrName === 'queryname' && newVal) {
                this[attrName] = newVal;
                this.queryNameSub.next(newVal);
            }
        });
    }
    updateTable(data) {
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
//# sourceMappingURL=bb-data-basic-table-alt.js.map