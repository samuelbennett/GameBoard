import * as Collections from 'typescript-collections';
import { WeaponType, ObjectType} from './Types';
import { Obstruction, Empty } from './Object';
import { GridLocation, GridObject } from './Core';
import { Enemy, BasicEnemy, ObstructionEnemy, SaintEnemy } from './Enemy';

export class LevelData {
	xSize: number;
	ySize: number;
	weapons: Collections.Dictionary<WeaponType, number>;
	board: Array<GridObject>;
}

//useful within tests
//very quick to define a quick level
//format:
//let str = ['X,X,X',
//			'0,0,0',
//			'0,1,2'].join('\n');
export class StringLevelDeserialiser {
	static create(input: String): LevelData {
		let l = new LevelData;
		let data = input.split('\n');
		l.weapons = StringLevelDeserialiser.weaponParser(data[0]);
		l.xSize = data[1].split(',').length;
		l.ySize = data.length - 1;
		let b = new Array<GridObject>();
		for (let i = 1; i < data.length; i++) {
			let row = data[i].split(',');
			for (let j = 0; j < row.length; j++) {
				let l = new GridLocation(j, i - 1);
				let o: GridObject;
				switch (row[j]) {
					case '0':
						o = new Empty(l);
						break;
					case '1':
						o = new BasicEnemy(l, 1);
						break;
					case '2':
						o = new BasicEnemy(l, 2);
						break;
					case 'OB':
						o =  new Obstruction(l);
						break;
					case 'OE':
						o = new ObstructionEnemy(l);
						break;
					case 'S':
						o = new SaintEnemy(l);
						break;
				}
				b.push(o);
			}
		}
		l.board = b;
		return l;
	}

	static weaponParser(input: String): Collections.Dictionary<WeaponType, number> {
		let incWeapon =	(type: WeaponType, dict: Collections.Dictionary<WeaponType, number>) => {
			if (dict.containsKey(type)) {
				dict.setValue(type, dict.getValue(type) + 1);
			} else {
				dict.setValue(type, 1);
			}
		};

		let data = input.split(',');
		let weapons = new Collections.Dictionary<WeaponType, number>();
		data.forEach(function(ws){
			let t: WeaponType;
			switch (ws) {
				case '+':
					t = 'PLUSFLAME';
					break;
				case 'X':
					t = 'XFLAME';
					break;
				case 'SB':
					t = 'SMALLBOMB';
					break;
				case 'LB':
					t = 'LARGEBOMB';
					break;
				case 'FB':
					t = 'FREEZE';
					break;
			}
			incWeapon(t, weapons);
		});
		return weapons;
	}
}
