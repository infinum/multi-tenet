import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { init } from './init';
import { pick } from './pick';

yargs(hideBin(process.argv))
	.command('init', 'init the tenet project', (argv) => {
		init();
	})
	.command('pick', 'pick a flavor', (argv) => {
		pick();
	}).argv;
