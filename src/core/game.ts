import { select, log, isCancel } from '@clack/prompts';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import PokemiltonWorld from '@/class/PokemiltonWorld';
import { saveGameState } from '@/core/save';
import Pokemilton from '@/class/Pokemilton';
import { killGame } from '@/utils/kill';

export const launchGameIntro = async (world: PokemiltonWorld, master: PokemiltonMaster) => {
	const pokemilton = await proposeFirstPokemilton(master.name);
	master.catchPokemilton(pokemilton);

	saveGameState(world, master);
	await launchGameLoop(world, master);
};

export const proposeFirstPokemilton = async (name: string) => {
	const pokemiltons = [new Pokemilton(), new Pokemilton(), new Pokemilton()];

	const pokemiltonChoosen = (await select<any, Pokemilton>({
		message: `Which Pokemilton will you start with ${name} ?`,
		options: [
			{ value: pokemiltons[0], label: `${pokemiltons[0].toString()}` },
			{ value: pokemiltons[1], label: `${pokemiltons[1].toString()}` },
			{ value: pokemiltons[2], label: `${pokemiltons[2].toString()}` },
		],
	})) as Pokemilton;

	if (isCancel(pokemiltonChoosen)) {
		killGame();
	}

	log.info(
		`${pokemiltonChoosen.name} is happy to be your first Pokemilton and is excited to start the adventure !`,
	);

	return pokemiltonChoosen;
};

export const launchGameLoop = (_: PokemiltonWorld, master: PokemiltonMaster) => {
	log.info(
		`You sucessfully started the game ${master.name}, but the logic isn't yet implemented so you'll have to wait..`,
	);
};
