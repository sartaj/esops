/* eslint-disable global-require */

import { prompt } from 'inquirer';

import log from '../logger';
import { bootstrap } from '../index';

const choicesMap = {
  ...bootstrap,
};

const questions = [
  {
    type: 'checkbox',
    name: 'setupOptions',
    choices: Object.keys(choicesMap),
    message: 'What would you like to setup?',
  },
];

const askQuestions = async () => {
  const answers = await prompt(questions)
    .catch(log.error);
  return answers;
};

export default async (options) => {
  try {
    const { setupOptions } = await askQuestions();
    setupOptions.forEach((choice) => {
      choicesMap[choice](options);
    });
  } catch (err) {
    log.error(err);
  }
};
