import { createDirectory, getConfig, exists } from './utils';
import { PARENT_DIR } from './consts';
import path from 'path';

export async function init() {
	const { flavours, envs } = await getConfig();

	if (await exists(PARENT_DIR)) {
		console.log('Exiting.');
		return;
	}

	await createDirectory(PARENT_DIR);

	for (let flavour of flavours) {
		for (let env of envs) {
			await createDirectory(path.join(PARENT_DIR, flavour, env), { recursive: true });
		}
	}
}
