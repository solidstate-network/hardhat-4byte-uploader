import { name as pluginName } from '../../package.json';
import axios from 'axios';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';
import { HardhatPluginError } from 'hardhat/plugins';

const API_ENDPOINT = 'https://www.4byte.directory/api/v1/import-abi/';

task(
  'upload-selectors',
  'Upload local function selectors to the Ethereum Selector Database',
)
  .addFlag('noCompile', "Don't compile before running this task")
  .setAction(async function (args, hre) {
    if (!args.noCompile) {
      await hre.run(TASK_COMPILE);
    }

    const fullNames = await hre.artifacts.getAllFullyQualifiedNames();

    const elements: { [key: string]: any } = {};

    await Promise.all(
      fullNames.map(async function (fullName) {
        const { abi } = await hre.artifacts.readArtifact(fullName);

        for (let element of abi) {
          elements[JSON.stringify(element)] = element;
        }
      }),
    );

    const compositeAbi = Object.values(elements).filter(function (el) {
      return (
        el.type === 'function' || el.type === 'event' || el.type === 'error'
      );
    });

    compositeAbi.forEach(function (el) {
      // We convert all errors to 'function' type, since 4byte.directory does not support ABIs that include errors and both types are encoded in the same way.
      if (el.type === 'error') {
        el.type = 'function';
        el.outputs = [];
      }
    });

    try {
      const { data } = await axios.post(API_ENDPOINT, {
        contract_abi: JSON.stringify(compositeAbi),
      });

      console.log(
        `Processed ${data.num_processed} unique items from ${fullNames.length} ABIs`,
      );
      console.log(
        `Added ${data.num_imported} selectors to 4byte.directory database`,
      );
      console.log(`Found ${data.num_duplicates} duplicates`);
      console.log(`Ignored ${data.num_ignored} items`);
    } catch (e) {
      throw new HardhatPluginError(
        pluginName,
        'failed to upload selectors to 4byte.directory',
      );
    }
  });
