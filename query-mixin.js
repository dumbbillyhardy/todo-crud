export const QueryMixin = (clazz) => class extends clazz {
    $$(cssSelector) {
        return this.shadowRoot.querySelector(cssSelector);
    }
    $all(cssSelector) {
        return [...this.shadowRoot.querySelectorAll(cssSelector)];
    }
    fire(eventName, detail, eventConfig={}) {
        const opt = {};
        opt.detail = detail;
        for(const key of Object.keys(eventConfig)) {
            opt[key] = eventConfig[key];
        }
        this.dispatchEvent(new CustomEvent(eventName, opt));
    }
    getSlotted(cssSelector) {
        return this.querySelector(cssSelector) || this.$$(cssSelector);
    }
}
