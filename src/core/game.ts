import readline from 'node:readline/promises';
import fs from 'node:fs/promises';
import path from 'node:path';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import Pokemilton from '@/class/Pokemilton';
import PokemiltonWorld from '@/class/PokemiltonWorld';
import { SaveFile } from '@/saves/save.type';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const DIR = path.resolve(__dirname, '..', 'saves');
// Hardcoded name
const saveFile = 'save.json';

async function doesSaveFileExist() {
	try {
		await fs.stat(`${DIR}/${saveFile}`);
		return true;
	} catch (err) {
		return false;
	}
}

async function saveGameState(world: PokemiltonWorld, master: PokemiltonMaster, failed = 0) {
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
}

async function loadGameState() {
	try {
		const content = (await fs.readFile(`${DIR}/${saveFile}`)).toString();
		return JSON.parse(content) as SaveFile;
	} catch (err) {
		console.error('Failed to load the game');
	}
}

async function askForName() {
	return await rl.question('What is your name ?\n');
}

function displayPokemiltonList(list: string) {
	const tabHeader = 'index | name | level | exp | hp | maxHp | isDown';
	return `${tabHeader}\n${list}`;
}

async function proposeFirstPokemilton(name: string) {
	const pokemiltons = [new Pokemilton(), new Pokemilton(), new Pokemilton()];

	const choices = [
		`1. | ${pokemiltons[0].toString()}`,
		`2. | ${pokemiltons[1].toString()}`,
		`3. | ${pokemiltons[2].toString()}`,
	];

	const answer = await rl.question(
		`Which pokemilton will you start with ${name} ?\n\n` +
			`${displayPokemiltonList(choices.join('\n'))}\n`,
	);
	const indexChosen = parseInt(answer);

	if (isNaN(indexChosen)) {
		console.log("You didn't choose a pokemilton");
		return proposeFirstPokemilton(name); // Ask the question again by calling the function itself (looping)
	}

	if (indexChosen > pokemiltons.length + 1 || indexChosen < 0) {
		console.log(`There's no pokemilton for the ${indexChosen}th choice`);
		return proposeFirstPokemilton(name); // Ask the question again by calling the function itself (looping)
	}

	return pokemiltons[indexChosen - 1];
}

enum GAME_MENU_ACTION {
	NEW_GAME = 1,
	LOAD_GAME = 2,
	EXIT = 3,
}

async function GameMenu() {
	const choices = ['1. Start a new game', '2. Load a save game', '3. Exit'];

	const answer = await rl.question(`${choices.join('\n')}\n`);
	const indexChosen = parseInt(answer) as GAME_MENU_ACTION;

	if (
		isNaN(indexChosen) ||
		indexChosen > choices.length + 1 ||
		indexChosen < 0 ||
		indexChosen === GAME_MENU_ACTION.EXIT
	) {
		process.exit(0); // Kill the terminal
	}

	return indexChosen;
}

async function setupGame() {
	const menuAction = await GameMenu();

	if (menuAction === GAME_MENU_ACTION.LOAD_GAME) {
		if (!(await doesSaveFileExist())) {
			console.log('No save files found !');
			return setupGame();
		}

		const game = await loadGameState();
		const master = PokemiltonMaster.loadMaster(game.PokemiltonMaster);
		const world = PokemiltonWorld.loadWorld({ day: game.day, logs: game.logs });
	} else if (menuAction === GAME_MENU_ACTION.NEW_GAME) {
		const name = await askForName();
		const world = new PokemiltonWorld();
		const master = new PokemiltonMaster(name);
		const pokemilton = await proposeFirstPokemilton(name);
		master.catchPokemilton(pokemilton);

		saveGameState(world, master);
	}
}

setupGame();
