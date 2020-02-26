declare var rxjs: any;
import { BbDataAbstractClass } from '../core/bb-data-abstract-class';
import { BbDataService, IBbData } from '../core/bb-data-service';
import { BbDataState, IBbDataState } from '../core/bb-data-state';
export class BbDataBasicTableComponent extends BbDataAbstractClass {
    static get observedAttributes() {
        return ['code', 'title', 'level'];
    }
    private data: any;
    private bbDataService: BbDataService = new BbDataService();
    private unsubscribe: any = new rxjs.Subject();
    private template: any;
    private state: IBbDataState;

    constructor() {
        super();
        // ts can be annoying, se we create a reference to this class
        // slots getters and setters are dynamically added to the class
        const self: any = this;

        this.template = window.document.querySelector('#irsc-pathway-ce-tmpl');
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        self.slotCode = this.shadowRoot.querySelector('slot[name="code"]');
        self.slotTitle = this.shadowRoot.querySelector('slot[name="title"]');
        self.slotLevel = this.shadowRoot.querySelector('slot[name="level"]');
        this.data = this.bbDataService.runQuery();
        this.state = new BbDataState();

        this.shadowRoot.addEventListener(
            'request-pathway-code',
            (event: any) => {
                event.detail.code = self.code;
            }
        );
        this.shadowRoot.addEventListener(
            'request-pathway-state',
            (event: any) => {
                event.detail.state = this.state;
            }
        );
    }

    public connectedCallback() {
        this.data
            .pipe(
                rxjs.operators.takeUntil(this.unsubscribe),
                rxjs.operators.filter(
                    (pathway: IPathway) => pathway.code !== null
                ),
                rxjs.operators.map((pathway: IPathway) => {
                    // tslint:disable-next-line: prefer-immediate-return
                    const _state: IPathwayState = {
                        code: pathway.code,
                        data: pathway.data,
                        controls: {
                            hasNotes:
                                pathway.data[pathway.currentTrack].notes
                                    .length > 0,
                            showNotes: false,
                            showPartTime: false,
                            hasPartTime: pathway.hasPartTime,
                            title: pathway.hasPartTime
                                ? 'Full-time (Sample)'
                                : 'Sample'
                        },
                        currentTrack: pathway.currentTrack,
                        pagination: {
                            fullTime: {
                                currentPage: 1,
                                totalPages:
                                    pathway.data.fullTime.semesters.length
                            },
                            partTime: pathway.hasPartTime
                                ? {
                                      currentPage: 1,
                                      totalPages:
                                          pathway.data.partTime.semesters.length
                                  }
                                : null
                        },
                        total: {
                            title: pathway.isClockHour
                                ? 'Clock Hours'
                                : 'Credits',
                            total:
                                pathway.data[pathway.currentTrack].creditHours,
                            isClockHour: pathway.isClockHour
                        }
                    };

                    return _state;
                })
            )
            .subscribe((data: IPathwayState) => {
                this.state.updateState(data);
                this.disconnectedCallback();
            });
    }

    public disconnectedCallback() {
        this.unsubscribe.next();
    }
}
