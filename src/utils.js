import chalk from 'chalk';
import fs from 'fs';
import { promisify } from 'util';
import { CACHE_PATH, CONFIG_PATH, DEFAULT_CONFIG, SHARED_DIR } from './consts';
import { resolve } from 'path';
import forceSymlink from 'force-symlink';
import uniq from 'lodash.uniq';
import path from 'path';

export const createDirectory = promisify(fs.mkdir);
export const writeFile = promisify(fs.writeFile);
export const readFile = promisify(fs.readFile);
export const exists = promisify(fs.exists);
export const appendFile = promisify(fs.appendFile);
export const symlink = promisify(forceSymlink);

const readdir = promisify(fs.readdir);
export async function readDir(dir) {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map((dirent) => {
			const res = resolve(dir, dirent.name);
			return dirent.isDirectory() ? readDir(res) : res;
		})
	);
	return Array.prototype.concat(...files);
}

export function logError(...args) {
	console.log(chalk.red('ERROR'), ...args);
}

export function logWarn(...args) {
	console.log(chalk.yellow('WARN'), ...args);
}

export function logDone(...args) {
	console.log(chalk.green('DONE'), ...args);
}

export async function createDefaultConfig(configPath = CONFIG_PATH) {
	if (!(await exists(configPath))) {
		await writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 4));
		logWarn('No configuration file found');
		logWarn('Using default configuration and writing that to', configPath);
	}
}

export async function getConfig(configPath = CONFIG_PATH) {
	await createDefaultConfig(configPath);

	const rawConfig = await readFile(configPath, { encoding: 'utf-8' });

	const config = JSON.parse(rawConfig);

	config.flavors.push(SHARED_DIR);

	return {
		envs: config.envs,
		flavors: config.flavors,
		defaultFlavor: config.defaultFlavor,
		defaultEnv: config.defaultEnv,
	};
}

export async function createCache(files = []) {
	const gitignore = path.join('.gitignore');

	const affectedFiles = uniq(files);

	let cache = '### FLAVORTOWN CACHE START ###\n';

	cache += affectedFiles.join('\n');

	cache += '\n### FLAVORROWN CACHE END ###\n';

	if (await exists(gitignore)) {
		await appendFile(gitignore, cache);
		return;
	}

	await writeFile(CACHE_PATH, cache);
}
