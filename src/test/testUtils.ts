import {expect, assert} from 'chai';
import {ObjectStates, ObjectType} from '../lib/core/Types';
import {Grid} from '../lib/core/Board';
import {GridLocation, GridObject} from '../lib/core/Core';
import * as _ from 'lodash';

//array of [x, y, states] tuples
export function assertLocationsAreInState(grid: Grid, locs: Array<[number, number, ObjectStates]>) {
	_.each(locs, function(tuple: [number, number, ObjectStates]){
		let l = new GridLocation(tuple[0], tuple[1]);
		let o = grid.getObject(l);
		expect(o.state, `Loc: x:${l.x} y:${l.y}`).equals(tuple[2]);
	});
}

export function assertLocationsAreAllInState(grid: Grid, state: ObjectStates, locs: Array<[number, number]>) {
	_.each(locs, function(tuple: [number, number, ObjectStates]){
		let l = new GridLocation(tuple[0], tuple[1]);
		let o = grid.getObject(l);
		expect(o.state, `Loc: x:${l.x} y:${l.y}`).equals(state);
	});
}

export function assertLocationsAreOfType(grid: Grid, locs: Array<[number, number, ObjectType]>) {
	_.each(locs, function(tuple: [number, number, Object]){
		let l = new GridLocation(tuple[0], tuple[1]);
		let o = grid.getObject(l);
		expect(o.type, `Loc: x:${l.x} y:${l.y}`).equals(tuple[2]);
	});
}
