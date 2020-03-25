var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { bbDataVars } from '../bb-data-variables';
import { BbDataState } from './bb-data-state';
export class BbDataService {
    constructor() {
        this.bbDataUrl = `${bbDataVars.host}/queries`;
        this.dataState = new BbDataState();
        if (!window.hasOwnProperty('bbdata')) {
            window.bbdata = {};
        }
        if (!window.irsc.hasOwnProperty('BbDataService')) {
            window.irsc.PathwayService = this;
        }
        this.bbdata = window.bbdata;
    }
    isTest(queryName) {
        if (!queryName ||
            queryName === 'test' ||
            queryName === '' ||
            typeof queryName === 'undefined') {
            return true;
        }
        return false;
    }
    runQuery(queryName, params = null) {
        console.log(`[BbDataState.runQuery('${queryName}', ${params})]`);
        if (this.isTest(queryName)) {
            console.log(`${bbDataVars.host}/test`);
            fetch(`${bbDataVars.host}/test`)
                .then((res) => res.json())
                .then((_data) => {
                console.log(_data);
                const state = {};
                state[queryName] = _data;
                this.dataState.updateState(state);
            })
                .catch((err) => {
                console.log('There was a problem loading test query.....');
                console.log(err);
            });
        }
        else {
            console.log('this should not run if test!!!!');
            if (!this.bbdata.hasOwnProperty(queryName) &&
                !this.isTest(queryName)) {
                fetch(`${this.bbDataUrl}/${queryName}`)
                    .then((res) => res.json())
                    .then((data) => {
                    console.log(data);
                    const state = {};
                    state[queryName] = data;
                    this.dataState.updateState(state);
                })
                    .catch((err) => {
                    console.log(`There was an error in retrieving data with queryName: ${queryName}`);
                    console.log(err);
                });
            }
        }
    }
    runQuery2(queryName, params = null) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[BbDataService.runQuery('${queryName}', ${params})]`);
            let url = '';
            if (this.isTest(queryName)) {
                url = `${bbDataVars.host}/test`;
            }
            else {
                url = `${this.bbDataUrl}/${queryName}`;
            }
            console.log(`${bbDataVars.host}/test`);
            try {
                const _data = yield fetch(url).then((res) => res.json());
                console.log('[BbDataService.runQuery.fetch(url)]...', _data);
                const state = {};
                state[queryName] = _data;
                return state;
            }
            catch (err) {
                console.log(`There was an error in retrieving data with queryName: ${queryName}`);
                console.log(err);
            }
        });
    }
}
//# sourceMappingURL=bb-data-service.js.map