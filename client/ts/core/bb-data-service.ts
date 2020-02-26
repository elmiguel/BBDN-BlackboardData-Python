declare var window: any;
declare var rxjs: any;

export interface IBbData {
    [key: string]: any;
}

export class BbDataService {
    public bbdata: any;
    private unsubscribe: any = new rxjs.Subject();
    private bbDataUrl: string = 'http://localhost:3000/queries';
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

    // public async getClockHoursFilter() {
    //     this.clockHoursFilter = await fetch(this.filterUrl)
    //         .then((res: any) => res.json())
    //         .then((res: any) => res.filter)
    //         .catch((err: any) => {
    //             console.log(
    //                 'There was an error retrieving the clock hours filter.'
    //             );
    //             console.log(err.message);
    //         });
    // }

    public runQuery(queryName: string, params: any = null;) {
        if (!this.bbdata.hasOwnProperty(queryName)) {
            this.bbdata.set(
                queryName,
                new rxjs.BehaviorSubject(
                    fetch(`${this.bbDataUrl}/${queryName}`)
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
                        })
                )
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
