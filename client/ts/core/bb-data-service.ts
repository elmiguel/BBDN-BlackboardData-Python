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

    public runQuery(queryName: string, params: any = null) {
        if (queryName === 'test') {
            return new rxjs.BehaviorSubject({
                headings: [
                    'Name',
                    'Company',
                    'Ext.',
                    'Start Date',
                    'Email',
                    'Phone No.'
                ],
                data: [
                    [
                        'Hedwig F. Nguyen',
                        'Arcu Vel Foundation',
                        '9875',
                        '03/27/2017',
                        'nunc.ullamcorper@metusvitae.com',
                        '070 8206 9605'
                    ],
                    [
                        'Genevieve U. Watts',
                        'Eget Incorporated',
                        '9557',
                        '07/18/2017',
                        'Nullam.vitae@egestas.edu',
                        '0800 025698'
                    ],
                    [
                        'Kyra S. Baldwin',
                        'Lorem Vitae Limited',
                        '3854',
                        '04/14/2016',
                        'in@elita.org',
                        '0800 237 8846'
                    ],
                    [
                        'Stephen V. Hill',
                        'Eget Mollis Institute',
                        '8820',
                        '03/03/2016',
                        'eu@vel.com',
                        '0800 682 4591'
                    ],
                    [
                        'Vielka Q. Chapman',
                        'Velit Pellentesque Ultricies Institute',
                        '2307',
                        '06/25/2017',
                        'orci.Donec.nibh@mauriserateget.edu',
                        '0800 181 5795'
                    ],
                    [
                        'Ocean W. Curtis',
                        'Eu Ltd',
                        '6868',
                        '08/24/2017',
                        'cursus.et@cursus.edu',
                        '(016977) 9585'
                    ],
                    [
                        'Kato F. Tucker',
                        'Vel Lectus Limited',
                        '4713',
                        '11/06/2017',
                        'Duis@Lorem.edu',
                        '070 0981 8503'
                    ],
                    [
                        'Robin J. Wise',
                        'Curabitur Dictum PC',
                        '3285',
                        '02/09/2017',
                        'blandit@montesnascetur.edu',
                        '0800 259158'
                    ],
                    [
                        'Uriel H. Guerrero',
                        'Mauris Inc.',
                        '2294',
                        '02/11/2018',
                        'vitae@Innecorci.net',
                        '0500 948772'
                    ],
                    [
                        'Yasir W. Benson',
                        'At Incorporated',
                        '3897',
                        '01/13/2017',
                        'ornare.elit.elit@atortor.edu',
                        '0391 916 3600'
                    ],
                    [
                        'Shafira U. French',
                        'Nisi Magna Incorporated',
                        '5116',
                        '07/23/2016',
                        'metus.In.nec@bibendum.ca',
                        '(018013) 26699'
                    ],
                    [
                        'Casey E. Hood',
                        'Lorem Vitae Odio Consulting',
                        '7079',
                        '05/05/2017',
                        'justo.Praesent@sitamet.ca',
                        '0800 570796'
                    ],
                    [
                        'Caleb X. Finch',
                        'Elit Associates',
                        '3629',
                        '09/19/2016',
                        'condimentum@eleifend.com',
                        '056 1551 7431'
                    ]
                ]
            });
        }
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
