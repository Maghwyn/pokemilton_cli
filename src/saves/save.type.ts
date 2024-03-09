export type SaveFile = SaveFileWorld & {
	saved_on: string;
	PokemiltonMaster: SaveFileMaster;
};

export type SaveFileWorld = {
	day: number;
	logs: Array<string>;
};

export type SaveFileMaster = {
	name: string;
	'pokemilton™Collection': Array<SaveFilePokemilton>;
	healingItems: number;
	reviveItems: number;
	pokeballs: number;
};

export type SaveFilePokemilton = {
	name: string;
	level: number;
	health: number;
	maxHealth: number;
	experienceMeter: number;
	attackRange: number;
	defenseRange: number;
	catchPhrase: string;
	isDown: boolean;
};
