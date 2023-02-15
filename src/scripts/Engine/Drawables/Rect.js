"use strict";
import { Mesh } from "./Mesh.js";


export class Rect {
    sid = 0;
	name = '';
    mesh = null;
    display = true;
    defScale = [1,1];
	gfxInfo= null;
}

export function RectCreateRect(name, sid, col, dim, scale, tex, pos, style, time){

    const rect = new Rect;
    rect.mesh = new Mesh(col, dim, scale, tex, pos, style, time);

    rect.sid = sid;
    rect.display = true;

    rect.defScale[0] = rect.mesh.scale[0];
    rect.defScale[1] = rect.mesh.scale[1];

    rect.name = name;

    return rect;
}