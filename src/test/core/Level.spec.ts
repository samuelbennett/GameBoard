import {expect, assert} from 'chai';

import {StringLevelDeserialiser} from '../../lib/core/Level';
import {BoardState, Grid, Inventory} from '../../lib/core/Board';
import {GridLocation} from '../../lib/core/Core';
import {Empty} from '../../lib/core/Object';
import {BasicEnemy} from '../../lib/core/Enemy';

describe('StringLevelDeserialiser Tests', () => {

	let s = ['X,X,X',
			'0,0,0',
			'0,1,2'].join('\n');
	let l = StringLevelDeserialiser.create(s);

	let b = new BoardState(l);

	it('Level should be of the correct size', () => {
		expect(l.xSize).equals(3);
		expect(l.ySize).equals(2);
	});

	it('Level should have 3 xflames', () => {
		expect(l.weapons.size()).equals(1);
		expect(l.weapons.getValue('XFLAME')).equals(3);
	});

	it('Level should have 6 enemys', () => {
		expect(l.board.length).equals(6);
	});

	it('Level board should have enemys in right location', () => {
		expect(b.grid.getObject(new GridLocation(0, 0))).instanceOf(Empty);
		expect(b.grid.getObject(new GridLocation(1, 1))).instanceOf(BasicEnemy);
		expect(b.grid.getObject(new GridLocation(2, 1))).instanceOf(BasicEnemy);
	});

});
