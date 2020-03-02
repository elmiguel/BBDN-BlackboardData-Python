export class BbDataState {
    constructor(queryName) {
        this._unsubscribe = new rxjs.Subject();
        const INITIAL_STATE = {};
        this.state = new rxjs.BehaviorSubject(INITIAL_STATE).pipe(rxjs.operators.filter((_state) => _state && _state[queryName]));
    }
    updateState(state) {
        console.log(`[BbDataState.updateState()]`, state);
        this.state.next(state);
    }
    getStateSlice(slice) {
        console.log(`[BbDataState.getStateSlice()]`, slice);
        return this.state.pipe(rxjs.operators.pluck(slice));
    }
    freeze() {
        this._unsubscribe.next(null);
    }
}
//# sourceMappingURL=bb-data-state.js.map