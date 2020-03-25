export class BbDataState {
    constructor() {
        this._unsubscribe = new rxjs.Subject();
        if (!window.hasOwnProperty('bbdata')) {
            window.bbdata = {};
        }
        if (!window.bbdata.hasOwnProperty('BbDataState')) {
            window.bbdata.BbDataState = this;
        }
        const INITIAL_STATE = {};
        this.state = new rxjs.BehaviorSubject(INITIAL_STATE).pipe(rxjs.operators.distinctUntilChanged(), rxjs.operators.filter((_state) => _state));
    }
    updateState(state) {
        console.log(`[BbDataState.updateState()]`, state);
        this.state.next(state);
        const event = new CustomEvent('bb-data-update', {
            detail: state,
            bubbles: true,
            composed: true
        });
        window.document
            .querySelectorAll("[class*='bb-data-table']")
            .forEach((dt) => {
            dt.dispatchEvent(event);
        });
    }
    getStateSlice(slice) {
        return this.state.pipe(rxjs.operators.pluck(slice));
    }
    freeze() {
        this._unsubscribe.next(null);
    }
}
//# sourceMappingURL=bb-data-state.js.map