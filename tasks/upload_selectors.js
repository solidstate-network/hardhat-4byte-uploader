const axios = require('axios');
const { HardhatPluginError } = require('hardhat/plugins');
const {
  TASK_COMPILE,
} = require('hardhat/builtin-tasks/task-names');

const API_ENDPOINT = 'https://www.4byte.directory/api/v1/import-abi/';

task(
  'upload-selectors', 'Upload local function selectors to the Ethereum Selector Database'
).addFlag(
  'noCompile', 'Don\'t compile before running this task'
).setAction(async function (args, hre) {
  if (!args.noCompile) {
    await hre.run(TASK_COMPILE);
  }

  const fullNames = await hre.artifacts.getAllFullyQualifiedNames();

  const elements = {};

  await Promise.all(fullNames.map(async function (fullName) {
    const { abi } = await hre.artifacts.readArtifact(fullName);

    for (let element of abi) {
      elements[JSON.stringify(element)] = element;
    }
  }));

  const compositeAbi = Object.values(elements).filter(function (el) {
    return el.type === 'function' || el.type === 'event';
  });

  if (compositeAbi.length === 0) {
    throw new HardhatPluginError('no selectors found in local compilation artifacts');
  }

  try {
    const { data } = await axios.post(API_ENDPOINT, { contract_abi: JSON.stringify(compositeAbi) });

    console.log(`Processed ${ data.num_processed } unique items from ${ fullNames.length } ABIs`);
    console.log(`Added ${ data.num_imported } selectors to database`);
    console.log(`Found ${ data.num_duplicates } duplicates`);
    console.log(`Ignored ${ data.num_ignored } items`);
  } catch (e) {
    throw new HardhatPluginError('one or more API requests failed');
  }
});
