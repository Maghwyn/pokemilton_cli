import { select, log, isCancel, text, confirm } from '@clack/prompts';
import pc from 'picocolors';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import PokemiltonWorld, { GAME_EVENT } from '@/class/PokemiltonWorld';
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

enum GAME_ACTION {
	HEAL_POKEMILTON = 1,
	REVIVE_POKEMILTON = 2,
	RELEASE_POKEMILTON = 3,
	RENAME_POKEMILTON = 4,
	DO_NOTHING = 5,
}

export const launchGameLoop = async (world: PokemiltonWorld, master: PokemiltonMaster) => {
	await askMasterDailyAction(master);
	await dailyRandomEvent(world, master);

	world.oneDayPasses();
	saveGameState(world, master);
	return launchGameLoop(world, master); // Recursive

	// Part 7:
	// TODO: When a fight start a new Pokemilton is created
	// TODO: Before the master choose to fight or not, the wild pokemilton introduce itself as "A wild level X, XXXXXXX Appears, it has XX Health"
	// TODO: We ask the master to choose a pokemilton from his collection to start the fight with
	// TODO: Then fight start and we ask again what the master wants to do
	// TODO: 1. Atack the wild pokemilton and end the game if the wild pokemilton is KO
	// TODO: 2. Try to catch the pokemilton and it end the game if successfull
	// TODO: 3. Change the pokemilton used for the fight
	// TODO: 4. Run away, it ends the fight
	// TODO: Once the master has done his action, then the wild pokemilton will do its action unless the fight ended
	// TODO: When the fight is over, it display the result of the fight, perform the experience gain and we save the data
};

const askMasterDailyAction = async (master: PokemiltonMaster) => {
	const action = (await select({
		message: 'What do you wish to do ?',
		options: [
			{ value: GAME_ACTION.HEAL_POKEMILTON, label: 'Heal a pokemilton' },
			{ value: GAME_ACTION.REVIVE_POKEMILTON, label: 'Revive a pokemilton' },
			{ value: GAME_ACTION.RELEASE_POKEMILTON, label: 'Release a pokemilton' },
			{ value: GAME_ACTION.RENAME_POKEMILTON, label: 'Rename a pokemilton' },
			{ value: GAME_ACTION.DO_NOTHING, label: 'Do nothing' },
		],
	})) as GAME_ACTION;

	if (isCancel(action)) {
		killGame();
	}

	switch (action) {
		case GAME_ACTION.HEAL_POKEMILTON:
			const healPokemilton = await choosePokemilton(master);
			master.healPokemilton(healPokemilton);
			break;
		case GAME_ACTION.REVIVE_POKEMILTON:
			const revivePokemilton = await choosePokemilton(master);
			master.revivePokemilton(revivePokemilton);
			break;
		case GAME_ACTION.RELEASE_POKEMILTON:
			const releasePokemilton = await choosePokemilton(master);
			master.releasePokemilton(releasePokemilton);
			break;
		case GAME_ACTION.RENAME_POKEMILTON:
			const renamePokemilton = await choosePokemilton(master);
			const newName = await choosePokemiltonName(renamePokemilton);
			master.renamePokemilton(renamePokemilton, newName);
			break;
	}
};

const dailyRandomEvent = async (world: PokemiltonWorld, master: PokemiltonMaster) => {
	const event = world.generateRandomEvent();

	if (event === GAME_EVENT.POKEMILTON_BATTLE) {
		log.info(pc.blue(`A wild pokemon appeared !`));

		const shouldBattle = (await confirm({
			message: 'Do you want to fight the pokemilton ?',
		})) as boolean;

		if (isCancel(shouldBattle)) {
			killGame();
		}

		if (shouldBattle) {
			// START THE FIGHT
		}

		// OR DO NOTHING EITHER CASE
	} else if (event === GAME_EVENT.NOTHING) {
		log.info(pc.blue(`Nothing happen today... moving on to day ${world.today + 1}`));
	}
};

const choosePokemilton = async (master: PokemiltonMaster) => {
	const pokemilton = (await select({
		message: 'Choose one of your pokemilton',
		options: master.collection.map((pokemilton) => {
			return { value: pokemilton, label: pokemilton.toString() };
		}),
	})) as Pokemilton;

	if (isCancel(pokemilton)) {
		killGame();
	}

	return pokemilton;
};

const choosePokemiltonName = async (pokemilton: Pokemilton) => {
	const name = (await text({
		message: `Rename your pokemilton ${pokemilton.name} !`,
		defaultValue: `${pokemilton.name}`,
	})) as string;

	if (isCancel(name)) {
		killGame();
	}

	return name;
};
