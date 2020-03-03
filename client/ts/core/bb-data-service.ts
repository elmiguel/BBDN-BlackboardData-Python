declare var window: any;
declare var rxjs: any;
import { bbDataVars } from '../bb-data-variables';
export interface IBbData {
    [key: string]: any;
}

export class BbDataService {
    // tslint:ignore
    public bbdata: any;
    private unsubscribe: any = new rxjs.Subject();
    private bbDataUrl: string = `${bbDataVars.host}/queries`;

    constructor() {
        // console.(this.http);
        if (!window.hasOwnProperty('bbdata')) {
            window.bbdata = {};
        }

        if (!window.irsc.hasOwnProperty('BbDataService')) {
            window.irsc.PathwayService = this;
        }

        this.bbdata = window.bbdata;
    }

    public async runQuery(queryName: string, params: any = null) {
        if (queryName === 'test') {
            console.log(`test url: ==> ${bbDataVars.host}/test`);
            const data = await fetch(`${bbDataVars.host}/test`)
                .then((res: any) => {
                    const _data = res.json();
                    console.log(`inside the then chain res.json()`);
                    console.log(_data);
                    return _data.data;
                })
                .catch((err: any) => {
                    console.log('There was a problem loading test query.....');
                    console.log(err);
                });
            return new rxjs.BehaviorSubject(rxjs.from(data)).pipe(
                rxjs.operators.tap((_data: any) => {
                    console.log('ASYNC======>');
                    console.log(_data);
                })
            );
        }

        if (!this.bbdata.hasOwnProperty(queryName)) {
            const data = await fetch(`${this.bbDataUrl}/${queryName}`)
                .then((res: any) => res.json())
                .then(async (res: any) => {
                    // do something with data then return data
                    // TODO: do something with data and return new data
                    return res;
                })
                .catch((err: any) => {
                    console.log(
                        `There was an error in retrieving data with queryName: ${queryName}`
                    );
                    console.log(err);
                });

            this.bbdata.set(
                queryName,
                new rxjs.BehaviorSubject(rxjs.from(data))
            );
        }

        return this.bbdata.get(queryName).pipe(
            rxjs.operators.takeUntil(this.unsubscribe),
            rxjs.operators.switchMap((data: any) => rxjs.from(data))
        );
    }

    public disconnectedCallback() {
        this.unsubscribe.next(null);
    }
}
