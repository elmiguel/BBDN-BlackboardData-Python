declare var window: any;
declare var rxjs: any;
import { bbDataVars } from '../bb-data-variables';
import { IBbDataState } from './bb-data-state';
export interface IBbData {
    [key: string]: any;
}

export class BbDataService {
    // tslint:ignore
    public bbdata: any;
    private unsubscribe: any = new rxjs.Subject();
    private bbDataUrl: string = `${bbDataVars.host}/queries`;
    private dataState: IBbDataState;

    constructor() {
        if (!window.hasOwnProperty('bbdata')) {
            window.bbdata = {};
        }

        if (!window.irsc.hasOwnProperty('BbDataService')) {
            window.irsc.PathwayService = this;
        }

        this.bbdata = window.bbdata;
    }

    public isTest(queryName: string): boolean {
        if (
            !queryName ||
            queryName === 'test' ||
            queryName === '' ||
            typeof queryName === 'undefined'
        ) {
            return true;
        }
        return false;
    }

    public addToBbData(queryName: string, data: any = null) {
        this.bbdata.set(queryName, data);
    }

    public runQuery(queryName: string, params: any = null) {
        if (this.isTest(queryName)) {
            return new rxjs.BehaviorSubject(
                rxjs.of(
                    fetch(`${bbDataVars.host}/test`)
                        .then((res: any) => res.json())
                        .catch((err: any) => {
                            console.log(
                                'There was a problem loading test query.....'
                            );
                            console.log(err);
                        })
                )
            ).pipe(rxjs.operators.switchMap((_data: any) => _data));
        }
        console.log('this should not run if test!!!!');
        if (!this.bbdata.hasOwnProperty(queryName) && !this.isTest(queryName)) {
            const data = fetch(`${this.bbDataUrl}/${queryName}`)
                .then((res: any) => res.json())
                .then((res: any) => {
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
            // this.bbdata.set(queryName, new rxjs.BehaviorSubject(data));
            // this.bbdata.set(queryName, new rxjs.BehaviorSubject(data));
            this.bbdata(queryName, new rxjs.BehaviorSubject(data));
        }
        // console.log(this.bbdata);
        // return this.bbdata.get(queryName).pipe(
        return this.bbdata[queryName].pipe(
            rxjs.operators.takeUntil(this.unsubscribe),
            rxjs.operators.switchMap((data: any) => rxjs.from(data))
        );
    }

    public disconnectedCallback() {
        this.unsubscribe.next(null);
    }
}
