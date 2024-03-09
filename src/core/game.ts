import readline from 'node:readline/promises';
import fs from 'node:fs/promises';
import path from 'node:path';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import Pokemilton from '@/class/Pokemilton';
import PokemiltonWorld from '@/class/PokemiltonWorld';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const DIR = path.resolve(__dirname, '..', 'saves');

async function saveGameState(world: PokemiltonWorld, master: PokemiltonMaster) {
	// Hardcoded name
	const saveFile = 'save.json';

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
	};

	await fs.appendFile(`${DIR}/${saveFile}`, JSON.stringify(save), { flag: 'w' });
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

	return pokemiltons[indexChosen];
}

async function setupGame() {
	const world = new PokemiltonWorld();
	const name = await askForName();
	const master = new PokemiltonMaster(name);
	const pokemilton = await proposeFirstPokemilton(name);
	master.catchPokemilton(pokemilton);

	console.log(pokemilton.toString());
	saveGameState(world, master);
}

setupGame();
