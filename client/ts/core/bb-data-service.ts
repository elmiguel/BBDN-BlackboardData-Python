declare var window: any;
declare var rxjs: any;
import { bbDataVars } from '../bb-data-variables';
import { BbDataState } from './bb-data-state';
export interface IBbData {
    [key: string]: any;
}

export class BbDataService {
    // tslint:ignore
    public bbdata: any;
    private bbDataUrl: string = `${bbDataVars.host}/queries`;
    private dataState: BbDataState = new BbDataState();

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

    public runQuery(queryName: string, params: any = null) {
        console.log(`[BbDataState.runQuery('${queryName}', ${params})]`);
        if (this.isTest(queryName)) {
            console.log(`${bbDataVars.host}/test`);
            fetch(`${bbDataVars.host}/test`)
                .then((res: any) => res.json())
                .then((_data: any) => {
                    console.log(_data);
                    const state: any = {};
                    state[queryName] = _data;
                    this.dataState.updateState(state);
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
                    // .then((res: any) => res.json())
                    .then((data: any) => {
                        console.log(data);
                        const state: any = {};
                        state[queryName] = data;
                        this.dataState.updateState(state);
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

    public async runQuery2(
        queryName: string,
        params: any = null
    ): Promise<void> {
        console.log(`[BbDataService.runQuery('${queryName}', ${params})]`);
        let url = '';
        if (this.isTest(queryName)) {
            url = `${bbDataVars.host}/test`;
        } else {
            url = `${this.bbDataUrl}/${queryName}`;
        }
        console.log(`${bbDataVars.host}/test`);
        try {
            const _data = await fetch(url).then((res: any) => res.json());
            console.log('[BbDataService.runQuery.fetch(url)]...', _data);
            const state: any = {};
            state[queryName] = _data;
            return state;
        } catch (err) {
            console.log(
                `There was an error in retrieving data with queryName: ${queryName}`
            );
            console.log(err);
        }
    }
}
