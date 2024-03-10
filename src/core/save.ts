import fs from 'node:fs/promises';
import path from 'node:path';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import PokemiltonWorld from '@/class/PokemiltonWorld';
import { SaveFile } from '@/saves/save.type';

const DIR = path.resolve(__dirname, '..', 'saves');
const saveFile = 'save.json';

export const saveGameState = async (
	world: PokemiltonWorld,
	master: PokemiltonMaster,
	failed = 0,
) => {
	const save = {
		saved_on: new Date().toISOString(),
		PokemiltonMaster: {
			name: master.name,
			'pokemilton™Collection': master.pokemiltons,
			healingItems: master.healingItems,
			reviveItems: master.reviveItems,
			pokeballs: master.pokeballs,
		},
		day: world.today,
		logs: world.logs,
	} satisfies SaveFile; // Type the object manually

	try {
		await fs.appendFile(`${DIR}/${saveFile}`, JSON.stringify(save), { flag: 'w' });
	} catch (error) {
		if (failed === 3) {
			console.error('Failed to save the game, tried 3 times...');
			process.exit(0); // Kill the terminal
		}

		failed++;
		return saveGameState(world, master, failed);
	}
};

export const loadGameState = async () => {
	try {
		const content = (await fs.readFile(`${DIR}/${saveFile}`)).toString();
		return JSON.parse(content) as SaveFile;
	} catch (err) {
		console.error('Failed to load the game');
	}
};

export const doesSaveFileExist = async () => {
	try {
		await fs.stat(`${DIR}/${saveFile}`);
		return true;
	} catch (err) {
		return false;
	}
};
