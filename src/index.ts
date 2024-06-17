import './tasks/compile';
import './tasks/upload_selectors';
import { extendConfig } from 'hardhat/config';

declare module 'hardhat/types/config' {
  export interface HardhatUserConfig {
    fourByteUploader: { runOnCompile?: boolean };
  }

  export interface HardhatConfig {
    fourByteUploader: { runOnCompile: boolean };
  }
}

extendConfig((config, userConfig) => {
  config.fourByteUploader = Object.assign(
    { runOnCompile: false },
    userConfig.fourByteUploader,
  );
});
