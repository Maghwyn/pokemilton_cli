import { select, log, isCancel, text, confirm } from '@clack/prompts';
import pc from 'picocolors';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import PokemiltonWorld, { GAME_EVENT } from '@/class/PokemiltonWorld';
import { saveGameState } from '@/core/save';
import Pokemilton from '@/class/Pokemilton';
import { killGame } from '@/utils/kill';
import PokemiltonBattleManager, { BATTLE_ACTION } from '@/class/PokemiltonBattleManager';

enum GAME_ACTION {
	HEAL_POKEMILTON = 1,
	REVIVE_POKEMILTON = 2,
	RELEASE_POKEMILTON = 3,
	RENAME_POKEMILTON = 4,
	DO_NOTHING = 5,
}

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

export const launchGameLoop = async (world: PokemiltonWorld, master: PokemiltonMaster) => {
	await askMasterDailyAction(master);
	await dailyRandomEvent(world, master);

	world.oneDayPasses();
	saveGameState(world, master);
	return launchGameLoop(world, master); // Recursive
};

const askMasterDailyAction = async (master: PokemiltonMaster) => {
	const action = (await select({
		message: `${master.name}, what do you wish to do ?`,
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
		const wildPokemilton = new Pokemilton();
		log.info(
			pc.blue(
				`A wild level ${wildPokemilton.level}, ${wildPokemilton.name} Appears, it has ${wildPokemilton.health} Health`,
			),
		);

		const shouldBattle = (await confirm({
			message: 'Do you want to fight the pokemilton ?',
		})) as boolean;

		if (isCancel(shouldBattle)) {
			killGame();
		}

		if (shouldBattle) {
			await fightBattle(master, wildPokemilton);
		}
	} else if (event === GAME_EVENT.NOTHING) {
		log.info(pc.blue(`Nothing happen today... moving on to day ${world.today + 1}`));
	}
};

const fightBattle = async (master: PokemiltonMaster, wildPokemilton: Pokemilton) => {
	const masterPokemilton = await choosePokemilton(master);
	const battleManager = new PokemiltonBattleManager(masterPokemilton, wildPokemilton, master);

	while (battleManager.isBattleActive) {
		const options = [
			{
				value: BATTLE_ACTION.ATTACK,
				label: `Attack ${wildPokemilton.name} with ${masterPokemilton.name}`,
			},
			{ value: BATTLE_ACTION.CATCH, label: `Try to catch ${wildPokemilton.name}` },
			{
				value: BATTLE_ACTION.SWITCH,
				label: `Change ${masterPokemilton.name} with another pokemilton`,
			},
			{ value: BATTLE_ACTION.RUN_AWAY, label: `Escape` },
		];

		const action = (await select({
			message: `${master.name}, what do you wish to do ?`,
			options: battleManager.isForcedToSwitch ? [options[2]] : options,
		})) as BATTLE_ACTION;

		await battleManager.playerAction(action);

		if (battleManager.isBattleActive) {
			battleManager.wildPokemiltonAction();
		} else {
			if (battleManager.hasWon) {
				log.success(
					pc.green(`${master.name} won the fight against ${wildPokemilton.name} !`),
				);
				battleManager.awardExperiencePoints();
			} else {
				log.success(
					pc.green(`${master.name} lost the fight against ${wildPokemilton.name} !`),
				);
			}
		}
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
