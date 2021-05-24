import { createDirectory, getConfig, exists, write, logError, logDone } from './utils';
import { LOGFILE_PATH, PARENT_DIR } from './consts';
import path from 'path';

export async function init() {
	const { flavors, envs } = await getConfig();

	if (await exists(PARENT_DIR)) {
		logError('Directory tree already exists, exiting to protect you');
		return;
	}

	try {
		await createDirectory(PARENT_DIR);

		for (let flavor of flavors) {
			for (let env of envs) {
				await createDirectory(path.join(PARENT_DIR, flavor, env), { recursive: true });
			}
		}

		logDone('Directory tree created');
	} catch (e) {
		logError('There was an error while creating directory tree');
		await write(LOGFILE_PATH, JSON.stringify(e));
	}
}
