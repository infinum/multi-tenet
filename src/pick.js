import chalk from 'chalk';
import path from 'path';
import { PARENT_DIR, SHARED_DIR } from './consts';
import { createCache, getConfig, logDone, logWarn, readDir, symlink } from './utils';

async function mirrorStructure(dir) {
	const files = await readDir(dir);
	const affectedFiles = [];

	for (let file of files) {
		const dest = file.replace(`${dir}/`, '');
		await symlink(file, dest);
		affectedFiles.push(dest);
		logDone('Symlink', file, 'to', dest);
	}

	return affectedFiles;
}

export async function pick(flavor, env) {
	const { defaultFlavor, defaultEnv } = await getConfig();

	if (!flavor) {
		logWarn('No flavor picked, using the default', chalk.green(defaultFlavor));
	}
	const selectedFlavor = flavor || defaultFlavor;

	if (!env) {
		logWarn('No environment picked, using the default', chalk.green(defaultEnv));
	}
	const selectedEnv = env || defaultEnv;

	const sharedPath = path.join(__dirname, '..', PARENT_DIR, SHARED_DIR, selectedEnv);
	const basePath = path.join(__dirname, '..', PARENT_DIR, selectedFlavor, selectedEnv);

	const sharedAffectedFiles = await mirrorStructure(sharedPath);
	const currentAffectedFiles = await mirrorStructure(basePath);

	await createCache([...sharedAffectedFiles, ...currentAffectedFiles]);
}
