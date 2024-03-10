import { log } from '@clack/prompts';

export const killGame = () => {
	log.info('See you later !');
	process.exit(0); // Kill the terminal
};
