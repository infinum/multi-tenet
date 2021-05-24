import path from 'path';

export const CONFIG_PATH = path.join(__dirname, '..', '.flavortownrc.json');
export const PARENT_DIR = 'flavortown';
export const SHARED_DIR = 'shared';
export const LOGFILE_PATH = path.join(__dirname, '..', 'flavortown.log');
export const CACHE_PATH = path.join(__dirname, '..', 'flavortown.cache');

export const DEFAULT_CONFIG = {
	flavors: ['vanilla'],
	envs: ['development', 'production'],
	defaultFlavor: 'vanilla',
	defaultEnv: 'development',
};
