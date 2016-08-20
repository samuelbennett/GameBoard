export type EnemyType =
	'BASIC_ENEMY'
	| 'OBSTRUCTION_ENEMY'
	| 'SAINT_ENEMY';

export type WeaponType =
	'XFLAME'
	| 'PLUSFLAME'
	| 'SMALLBOMB'
	| 'LARGEBOMB'
	| 'FREEZE';

export type BoardPlacedType =
	'OBSTRUCTION'
	| 'EMPTY'
	| EnemyType;

export type ObjectType =
	BoardPlacedType
	| WeaponType;

export type DirectionType =
	'NORTH'
	| 'EAST'
	| 'SOUTH'
	| 'WEST'
	| 'NORTH_EAST'
	| 'SOUTH_EAST'
	| 'SOUTH_WEST'
	| 'NORTH_WEST';

export type ObjectStates =
	'DEFAULT'
	| EnemyStates
	| WeaponStates;

export type EnemyStates =
	'TO_BE_REMOVED'
	| 'DEAD';

export type WeaponStates =
	'DEFAULT'
	| 'ACTIVATED';

export type EnemyFlag =
	'INVINCIBLE'
	| 'FROZEN';

export type AfterPlaceStages =
	'FIRST'
	| 'SECOND';
