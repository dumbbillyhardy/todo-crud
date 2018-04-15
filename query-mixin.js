export const QueryMixin = (clazz) => class extends clazz {
    $$(cssSelector) {
        return this.shadowRoot.querySelector(cssSelector);
    }
    $all(cssSelector) {
        return [...this.shadowRoot.querySelectorAll(cssSelector)];
    }
    fire(eventName, detail) {
        this.dispatchEvent(new CustomEvent(eventName, {
            detail
        }));
    }
}
