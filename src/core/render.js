import {StringBuffer} from '../util/util.js';

export function renderHTML(hdom) {
    var html = new StringBuffer();
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
 
