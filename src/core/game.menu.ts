import { setTimeout as sleep } from 'node:timers/promises';
import { intro, select, log, spinner, text, isCancel } from '@clack/prompts';
import pc from 'picocolors';

import PokemiltonMaster from '@/class/PokemiltonMaster';
import PokemiltonWorld from '@/class/PokemiltonWorld';
import { loadGameState, doesSaveFileExist } from '@/core/save';
import { launchGameIntro, launchGameLoop } from '@/core/game';
import { killGame } from '@/utils/kill';

enum GAME_MENU_ACTION {
	NEW_GAME = 1,
	LOAD_GAME = 2,
	EXIT = 3,
}

const gameMenuActionSelect = async () => {
	const gameMenuAction = await select({
		message: 'Game Menu',
		options: [
			{ value: GAME_MENU_ACTION.NEW_GAME, label: 'New Game' },
			{ value: GAME_MENU_ACTION.LOAD_GAME, label: 'Load a game file' },
			{ value: GAME_MENU_ACTION.EXIT, label: 'Exit' },
		],
	});

	if (isCancel(gameMenuAction) || gameMenuAction === GAME_MENU_ACTION.EXIT) {
		killGame();
	}

	return gameMenuAction;
};

const gameMenu = async () => {
	intro(pc.bgBlue(' Welcome to the Pokemilton game !'));
	const menuAction = await gameMenuActionSelect();

	if (menuAction === GAME_MENU_ACTION.LOAD_GAME) {
		const filesExist = await doesSaveFileExist();
		if (!filesExist) {
			log.error(pc.red('No save files found !'));
			return gameMenu();
		}

		await onLoadGame();
	} else if (menuAction === GAME_MENU_ACTION.NEW_GAME) {
		await onNewGame();
	}
};

const onLoadGame = async () => {
	const s = spinner();
	s.start('Loading the game');
	const game = await loadGameState();
	// Fake wait for visual
	await sleep(2000);

	const world = PokemiltonWorld.loadWorld({ day: game.day, logs: game.logs });
	const master = PokemiltonMaster.loadMaster(game.PokemiltonMaster);
	s.stop(`Welcome back to the Pokemilton world ${master.name} !`);
	await launchGameLoop(world, master);
};

const onNewGame = async () => {
	const name = await askForPlayerName();
	const world = new PokemiltonWorld();
	const master = new PokemiltonMaster(name);
	log.success(`Welcome to the Pokemilton world ${master.name} !`);
	await launchGameIntro(world, master);
};

async function askForPlayerName() {
	const name = (await text({
		message: 'What is your name ?',
		placeholder: 'Anonymous',
		validate(value) {
			const isNum = /^\d+$/.test(value);
			if (isNum) return 'How about adding some letters for a name...';
			if (value.length < 3) return 'At least use 3 characters...';
		},
	})) as string;

	if (isCancel(name)) {
		killGame();
	}

	return name as string;
}

gameMenu().catch(console.error);
