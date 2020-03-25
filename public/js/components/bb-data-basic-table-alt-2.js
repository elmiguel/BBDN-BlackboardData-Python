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
export class BbDataBasicTableAlt2Component extends BbDataAbstractClass {
    constructor() {
        super();
        this.dataTable = null;
        this.bbDataService = new BbDataService();
        this.unsubscribe = new rxjs.Subject();
        this.self = this;
        this.template = window.document.getElementById('bb-data-table-basic-tmpl-alt');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.queryName = this.getAttribute('queryname');
        this.select = this.getAttribute('select');
        this.type = this.getAttribute('type');
        this.format = this.getAttribute('format');
        this.dataState = new BbDataState();
        console.log(`[queryName] ${this.queryName}`);
        this.dataState.state
            .pipe(rxjs.operators.takeUntil(this.unsubscribe), rxjs.operators.filter(() => this.queryName !== null))
            .subscribe((data) => {
            console.log('Data State Changed!');
            console.log('='.repeat(10));
            console.log(data);
            console.log('='.repeat(10));
        });
    }
    static get observedAttributes() {
        return ['queryname', 'select', 'type', 'format'];
    }
    connectedCallback() { }
    disconnectedCallback() {
        this.unsubscribe.next();
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldVal !== newVal && attrName === 'queryname' && newVal) {
                console.log(attrName, oldVal, newVal);
                this[attrName] = newVal;
                const data = yield this.bbDataService.runQuery2(newVal);
                this.data = data[newVal];
                console.log('[change detection]', this.data);
                this.updateTable();
            }
        });
    }
    updateTable() {
        console.log('[updateTable] re-rendering table data...');
        console.log('=== DATA ===/>', this.data);
        this.table = this.shadowRoot.querySelector('table');
        if (this.dataTable !== null) {
            this.dataTable.destroy();
        }
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
//# sourceMappingURL=bb-data-basic-table-alt-2.js.map