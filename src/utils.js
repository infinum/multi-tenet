import fs from 'fs';
import { promisify } from 'util';
import { CONFIG_PATH, SHARED_DIR } from './consts';

export const createDirectory = promisify(fs.mkdir);
export const readFile = promisify(fs.readFile);
export const exists = promisify(fs.exists);

export async function getConfig(configPath = CONFIG_PATH) {
	const rawConfig = await readFile(configPath, { encoding: 'utf-8' });

	const config = JSON.parse(rawConfig);

	config.flavours.push(SHARED_DIR);

	return {
		envs: config.envs,
		flavours: config.flavours,
	};
}
