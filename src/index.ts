import pkg from '../package.json' with { type: 'json' };
import taskUploadSelectors from './tasks/upload_selectors.js';
import './type_extensions.js';
import { globalOption } from 'hardhat/config';
import { definePlugin } from 'hardhat/plugins';
import { ArgumentType } from 'hardhat/types/arguments';
import type { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = definePlugin({
  id: pkg.name!,
  npmPackage: pkg.name!,
  dependencies: () => [import('@solidstate/hardhat-solidstate-utils')],
  tasks: [taskUploadSelectors],
  hookHandlers: {
    config: () => import('./hook_handlers/config.js'),
    solidity: () => import('./hook_handlers/solidity.js'),
  },
  globalOptions: [
    globalOption({
      name: 'noUploadSelectors',
      description: 'Disables selector uploading',
      defaultValue: false,
      type: ArgumentType.BOOLEAN,
    }),
  ],
});

export default plugin;
