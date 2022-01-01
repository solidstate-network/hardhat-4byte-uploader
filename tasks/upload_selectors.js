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

  let errors = 0;

  let processed = 0;
  let imported = 0;
  let duplicates = 0;
  let ignored = 0;

  await Promise.all(fullNames.map(async function (fullName) {
    let { abi } = await hre.artifacts.readArtifact(fullName);

    abi = abi.filter(function (el) {
      return el.type == 'function' || el.type == 'event';
    });

    if (!abi.length) return;

    try {
      const { data } = await axios.post(API_ENDPOINT, { contract_abi: JSON.stringify(abi) });

      processed += data.num_processed;
      imported += data.num_imported;
      duplicates += data.num_duplicates;
      ignored += data.num_ignored;
    } catch (e) {
      errors++;
    }
  }));

  console.log(`Processed ${ processed } selectors from ${ fullNames.length } ABIs`);
  console.log(`Added ${ imported } selectors to database`);
  console.log(`Found ${ duplicates } duplicates`);
  console.log(`Ignored ${ ignored }`);

  if (errors) {
    throw new HardhatPluginError('one or more API requests failed');
  }
});
