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
        console.log(`[BbDataState.runQuery('${queryName}', ${params})]`);
        if (this.isTest(queryName)) {
            console.log(`${bbDataVars.host}/test`);
            fetch(`${bbDataVars.host}/test`)
                .then((res: any) => res.json())
                .then((_data: any) => {
                    this.dataState.updateState(queryName, _data);
                })
                .catch((err: any) => {
                    console.log('There was a problem loading test query.....');
                    console.log(err);
                });
        } else {
            console.log('this should not run if test!!!!');
            if (
                !this.bbdata.hasOwnProperty(queryName) &&
                !this.isTest(queryName)
            ) {
                fetch(`${this.bbDataUrl}/${queryName}`)
                    .then((res: any) => res.json())
                    .then((data: any) => {
                        this.dataState.updateState(queryName, data);
                    })
                    .catch((err: any) => {
                        console.log(
                            `There was an error in retrieving data with queryName: ${queryName}`
                        );
                        console.log(err);
                    });
            }
        }
    }

    public disconnectedCallback() {
        this.unsubscribe.next(null);
    }
}
