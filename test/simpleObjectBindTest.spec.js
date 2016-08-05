import {helix} from '../src/index';
import {renderHTML} from '../src/core/render';

import {expect} from 'chai';

var dom = helix.createElement("div", [], {
    id: "main"
}, [helix.createElement("div", {
    text: 'text'
}, {
    id: "test"
}, [], null), helix.createElement("div", {
    text: 'attr1.childAttr1'
}, {
    id: "childAttr1"
}, [], null), helix.createElement("div", {
    text: 'attr2.childAttr2.childAttr21'
}, {
    id: "childAttr21"
}, [], null)], null);


var model = {
    text: "hello world!",
    attr1: {childAttr1: "childAttr1"},
    attr2: {childAttr2: {childAttr21: "childAttr21"}}
}

var view1 = helix.def(dom, model);
var html = renderHTML(dom);

describe('一级对象绑定', function () {
    it('一级属性渲染', function () {
        expect(html.indexOf(">hello world!<") != -1).to.be.equal(true);
    });

    it('一级属性修改', function () {
        view1.text = "test modify";
        expect(view1.text).to.be.equal("test modify");
    });
    it('一级属性修改后dom自动更新', function () {
        expect(dom.childNodes[0].attributes.text).to.be.equal("test modify");
    });
});


describe('二级对象绑定', function () {
    it('二级属性渲染', function () {
        expect(html.indexOf(">childAttr1<") != -1).to.be.equal(true);
    });
    it('二级属性修改', function () {
        view1.attr1.childAttr1 = "test childAttr1 modify";
        expect(view1.attr1.childAttr1).to.be.equal("test childAttr1 modify");
    });
    it('二级属性修改后dom自动更新', function () {
        expect(dom.childNodes[1].attributes.text).to.be.equal("test childAttr1 modify");
    });
});


describe('三级对象绑定', function () {
    it('三级属性渲染', function () {
        expect(html.indexOf(">childAttr21<") != -1).to.be.equal(true);
    });
    it('三级属性修改', function () {
        view1.attr1.childAttr1 = "test childAttr21 modify";
        expect(view1.attr1.childAttr1).to.be.equal("test childAttr21 modify");
    });
    it('三级属性修改后dom自动更新', function () {
        expect(dom.childNodes[1].attributes.text).to.be.equal("test childAttr21 modify");
    });
});
