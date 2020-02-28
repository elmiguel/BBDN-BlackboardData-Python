declare var rxjs: any;
export interface IBbDataState {
    [key: string]: any;
}
export class BbDataState {
    public state: any;
    private _unsubscribe: any = new rxjs.Subject();
    constructor(queryName: string) {
        // setup _state filtering...
        const INITIAL_STATE: IBbDataState = {};
        this.state = new rxjs.BehaviorSubject(INITIAL_STATE).pipe(
            rxjs.operators.filter(
                (_state: IBbDataState) => _state && _state[queryName]
            )
        );
    }

    public updateState(state: IBbDataState) {
        console.log(`[BbDataState.updateState()]`, state);
        this.state.next(state);
    }

    public getStateSlice(slice: string) {
        console.log(`[BbDataState.getStateSlice()]`, slice);
        return this.state.pipe(rxjs.operators.pluck(slice));
    }

    public freeze() {
        this._unsubscribe.next(null);
    }
}
