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

  await Promise.all(fullNames.map(async function (fullName) {
    const { abi } = await hre.artifacts.readArtifact(fullName);

    try {
      const res = await axios.post(API_ENDPOINT, { contract_abi: JSON.stringify(abi) });
      // TODO: aggregate output data and print before exit
      console.log(res.data);
    } catch (e) {
      errors++;
    }
  }));

  if (errors) {
    throw new HardhatPluginError('one or more API requests failed');
  }
});
