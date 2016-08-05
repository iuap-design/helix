var createElement = function (tag, binds, attributes, childs) {
    return new hdom(tag, binds, attributes, childs);
}

var createComponent = function (tag, viewModel) {

}

function hdom(tag, binds, attributes, childNodes) {
    this.nodeName = tag;
    this.binds = binds;
    this.attributes = attributes;
    this.childNodes = childNodes;
    this.setAttribute = function (k, v) {
        if (!this.attributes) {
            this.attributes = {};
        }
        this.attributes[k] = v;
    };
}
export {
    createElement,
    createComponent
}
