declare var rxjs: any;
export interface IBbDataState {
    [key: string]: any;
}
export class BbDataState {
    public state: any;
    private _unsubscribe: any = new rxjs.Subject();
    constructor(code: string) {
        // setup _state filtering...
        const INITIAL_STATE: IBbDataState = {};
        this.state = new rxjs.BehaviorSubject(INITIAL_STATE).pipe(
            rxjs.operators.filter(
                (_state: IBbDataState) => _state && _state.data.fullTime
            )
        );
    }

    public updateState(state: IBbDataState) {
        this.state.next(state);
    }

    public freeze() {
        this._unsubscribe.next(null);
    }
}
