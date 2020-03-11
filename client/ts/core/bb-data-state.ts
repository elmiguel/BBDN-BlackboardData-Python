declare var window: any;
declare var rxjs: any;
export interface IBbDataState {
    [key: string]: any;
}
export class BbDataState {
    public state: any;
    private _unsubscribe: any = new rxjs.Subject();
    constructor() {
        // setup _state filtering...

        if (!window.hasOwnProperty('bbdata')) {
            window.bbdata = {};
        }

        if (!window.bbdata.hasOwnProperty('BbDataState')) {
            window.bbdata.BbDataState = this;
        }

        const INITIAL_STATE: IBbDataState = {};
        this.state = new rxjs.BehaviorSubject(INITIAL_STATE).pipe(
            rxjs.operators.distinctUntilChanged(),
            rxjs.operators.filter((_state: IBbDataState) => _state)
        );
    }

    public updateState(state: IBbDataState) {
        console.log(`[BbDataState.updateState()]`, state);
        this.state.next(state);
        const event = new CustomEvent('bb-data-update', {
            detail: state,
            bubbles: true,
            composed: true
        });
        window.document
            .querySelectorAll("[class*='bb-data-table']")
            .forEach((dt: any) => {
                dt.dispatchEvent(event);
            });
    }

    public getStateSlice(slice: string) {
        // console.log(`[BbDataState.getStateSlice()]`, slice);
        return this.state.pipe(rxjs.operators.pluck(slice));
    }

    public freeze() {
        this._unsubscribe.next(null);
    }
}
