import readline from 'node:readline/promises';
import fs from 'node:fs/promises';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import Pokemilton from '@/class/Pokemilton';
import PokemiltonWorld from '@/class/PokemiltonWorld';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function saveGameState() {}

function askForName() {}

function proposeFirstPokemilton(rl) {}

function displayPokemiltonList(list: string) {
	const tabHeader = 'index | name | level | exp | hp | maxHp | isDown';
	return `${tabHeader}\n${list}`;
}

async function getMyFirstPokemilton(name: string) {
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
		return getMyFirstPokemilton(name); // Ask the question again by calling the function itself (looping)
	}

	if (indexChosen > pokemiltons.length + 1 || indexChosen < 0) {
		console.log(`There's no pokemilton for the ${indexChosen}th choice`);
		return getMyFirstPokemilton(name); // Ask the question again by calling the function itself (looping)
	}

	return pokemiltons[indexChosen];
}

async function setupGame() {
	const world = new PokemiltonWorld();
	const name = await rl.question('What is your name ?\n');
	const master = new PokemiltonMaster(name);
	const pokemilton = await getMyFirstPokemilton(name);
	master.catchPokemilton(pokemilton);

	console.log(pokemilton.toString());
}

setupGame();
