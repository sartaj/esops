#!/usr/bin/env babel-node --

/* eslint-disable no-console */

import opn from 'opn';

import log from '../logger';
import { compile, bootstrap } from '../index';
import wizard from './wizard';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';


const runCommand = (command) => {

  // Get current working directory
  const cwd = process.cwd();

  // Choose command
  switch (command) {
    case 'start':
    case 'dev':
      compile({
        cwd,
        devMode: true,
      });
      break;
    case 'setup':
      wizard({ cwd });
      break;
    case 'build':
    case 'compile':
      compile();
      break;
    case 'setup:base':
      bootstrap.base({ cwd });
      break;
    case 'setup:react':
      bootstrap.react({ cwd });
      break;
    case 'help':
      log.info('opening help documentation in your browser...');
      opn('http://cdd-docs.apps.system.pcf.ntrs.com/ui/overview/', { wait: false });
      break;
    default:
      log.help();
      process.exit(1);
  }
};

const init = () => {
  const command = process.argv[2];
  runCommand(command);
};

init();
