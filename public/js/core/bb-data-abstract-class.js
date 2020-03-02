export class BbDataAbstractClass extends HTMLElement {
    constructor() {
        super();
        const self = this;
        if (!window.irsc) {
            window.irsc = {};
        }
        if (self.constructor.observedAttributes &&
            self.constructor.observedAttributes.length) {
            self.constructor.observedAttributes.forEach((attribute) => {
                if (attribute !== 'data') {
                    if (/[-]/gim.test(attribute)) {
                        attribute = this.pascalCase(attribute);
                    }
                    Object.defineProperty(this, attribute, {
                        get() {
                            return this.getAttribute(attribute);
                        },
                        set(attrValue) {
                            if (attrValue) {
                                this.setAttribute(attribute, attrValue);
                            }
                            else {
                                this.removeAttribute(attribute);
                            }
                        }
                    });
                }
            });
        }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        const slot = this[`slot${this.titleize(this.pascalCase(attrName))}`];
        if (slot) {
            slot.innerText = newValue;
        }
    }
    pascalCase(attribute) {
        return attribute
            .split('-')
            .map((part, idx) => {
            if (idx === 0) {
                return part;
            }
            return this.titleize(part);
        })
            .join('');
    }
    titleize(part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }
}
//# sourceMappingURL=bb-data-abstract-class.js.map