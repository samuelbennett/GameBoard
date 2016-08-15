import {expect, assert} from 'chai';

import {GridLocation, GridCursor} from '../../lib/core/Core';
import {DirectionType} from '../../lib/core/Types';

describe('GridCursor Tests', () => {

	it('GridCursor moves north and throws at the edge', () => {
		let l = new GridLocation(5, 5);
		let c = new GridCursor(l, 9, 9);

		c.move('NORTH');
		c.move('NORTH');
		c.move('NORTH');
		c.move('NORTH');
		c.move('NORTH');

		expect(c.loc.x).equals(5);
		expect(c.loc.y).equals(0);

		expect(function(){
			c.move('NORTH');
		}).to.throw('Invalid movement');
	});

	it('GridCursor ends up at the same place after a move around', () => {
		let l = new GridLocation(5, 5);
		let c = new GridCursor(l, 9, 9);

		c.move('NORTH');
		c.move('EAST');
		c.move('SOUTH');
		c.move('WEST');

		expect(c.loc.x).equals(5, 'x');
		expect(c.loc.y).equals(5, 'y');
	});

	it('GridCursor ends up at the same place after a move around diagonally', () => {
		let l = new GridLocation(5, 5);
		let c = new GridCursor(l, 9, 9);

		c.move('NORTH_EAST');
		c.move('SOUTH_EAST');
		c.move('SOUTH_WEST');
		c.move('NORTH_WEST');

		expect(c.loc.x).equals(5, 'x');
		expect(c.loc.y).equals(5, 'y');
	});

});
