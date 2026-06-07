import pkg from '../../package.json' with { type: 'json' };
import axios from 'axios';
import { HardhatPluginError } from 'hardhat/plugins';
import type { HookContext } from 'hardhat/types/hooks';

const API_ENDPOINT = 'https://www.4byte.directory/api/v1/import-abi/';

export const uploadSelectors = async (context: HookContext) => {
  const fullNames = Array.from(
    await context.artifacts.getAllFullyQualifiedNames(),
  );

  const elements: { [key: string]: any } = {};

  await Promise.all(
    fullNames.map(async (fullName) => {
      const { abi } = await context.artifacts.readArtifact(fullName);

      for (let element of abi) {
        elements[JSON.stringify(element)] = element;
      }
    }),
  );

  const compositeAbi = Object.values(elements).filter((el) => {
    return el.type === 'function' || el.type === 'event' || el.type === 'error';
  });

  compositeAbi.forEach((el) => {
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
      pkg.name,
      'failed to upload selectors to 4byte.directory',
    );
  }
};
