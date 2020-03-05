declare var window: any;
export class BbDataAbstractClass extends HTMLElement {
    // tslint:disable-next-line:cognitive-complexity
    constructor() {
        super();

        const self: any = this;
        // Check to see if observedAttributes are defined and has length
        if (!window.irsc) {
            window.irsc = {};
        }
        if (
            self.constructor.observedAttributes &&
            self.constructor.observedAttributes.length
        ) {
            // Loop through the observed attributes
            self.constructor.observedAttributes.forEach((attribute: any) => {
                if (attribute !== 'data') {
                    if (/[-]/gim.test(attribute)) {
                        attribute = this.pascalCase(attribute);
                    }
                    // console.log(attribute);
                    // Dynamically define the property getter/setter d
                    Object.defineProperty(this, attribute, {
                        get() {
                            return this.getAttribute(attribute);
                        },
                        set(attrValue) {
                            if (attrValue) {
                                this.setAttribute(attribute, attrValue);
                            } else {
                                this.removeAttribute(attribute);
                            }
                        }
                    });
                }
            });
        }
    }

    public attributeChangedCallback(
        attrName: string,
        oldValue: any,
        newValue: any
    ) {
        if (oldValue !== newValue) {
            console.log('Abstract attributeChangedCallback....');
            const slot: any = this[
                `slot${this.titleize(this.pascalCase(attrName))}`
            ];

            if (slot) {
                slot.innerText = newValue;
            }
        }
    }

    private pascalCase(attribute: string) {
        return attribute
            .split('-')
            .map((part: string, idx: number) => {
                if (idx === 0) {
                    return part;
                }
                return this.titleize(part);
            })
            .join('');
    }

    private titleize(part: string) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }
}
