'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderHTML = renderHTML;

var _util = require('../util/util.js');

function renderHTML(hdom) {
    var html = new _util.StringBuffer();
    html.append('<').append(hdom.nodeName);
    if (hdom.attributes) {
        for (var attr in hdom.attributes) {
            if (hdom.attributes.hasOwnProperty(attr) && attr !== 'text') {
                html.append(' ').append(attr).append('="').append(hdom.attributes[attr]).append('"');
            }
        }
    }
    html.append('>');
    if (hdom.attributes['text']) {
        html.append(hdom.attributes['text']);
    } else if (hdom.childNodes) {
        for (var i = 0; i < hdom.childNodes.length; i++) {
            var child = hdom.childNodes[i];
            html.append(renderHTML(child));
        }
    }

    html.append('</').append(hdom.nodeName).append('>');
    html.append('\n');
    return html.toString();
}