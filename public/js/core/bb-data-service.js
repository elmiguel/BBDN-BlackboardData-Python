var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class BbDataService {
    constructor() {
        this.unsubscribe = new rxjs.Subject();
        this.bbDataUrl = 'http://localhost:3000/queries';
        if (!window.hasOwnProperty('bbdata')) {
            window.bbdata = {};
        }
        if (!window.irsc.hasOwnProperty('BbDataService')) {
            window.irsc.PathwayService = this;
        }
        this.bbdata = window.bbdata;
    }
    runQuery(queryName, params = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryName === 'test') {
                const data = yield fetch('http://localhost:5000/test')
                    .then((res) => res.json())
                    .catch((err) => {
                    console.log('There was a problem loading test query.....');
                    console.log(err);
                });
                return new rxjs.BehaviorSubject(rxjs.from(data)).pipe(rxjs.operators.tap((_data) => {
                    console.log('ASYNC======>');
                    console.log(_data);
                }));
            }
            if (!this.bbdata.hasOwnProperty(queryName)) {
                const data = yield fetch(`${this.bbDataUrl}/${queryName}`)
                    .then((res) => res.json())
                    .then((res) => __awaiter(this, void 0, void 0, function* () {
                    return res;
                }))
                    .catch((err) => {
                    console.log(`There was an error in retrieving data with queryName: ${queryName}`);
                    console.log(err);
                });
                this.bbdata.set(queryName, new rxjs.BehaviorSubject(rxjs.from(data)));
            }
            return this.bbdata.get(queryName).pipe(rxjs.operators.takeUntil(this.unsubscribe), rxjs.operators.switchMap((data) => rxjs.from(data)));
        });
    }
    disconnectedCallback() {
        this.unsubscribe.next(null);
    }
}
//# sourceMappingURL=bb-data-service.js.map