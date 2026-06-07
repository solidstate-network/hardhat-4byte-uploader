import type {
  SelectorUploaderConfig,
  SelectorUploaderUserConfig,
} from './types.js';

declare module 'hardhat/types/config' {
  export interface HardhatConfig {
    selectorUploader: SelectorUploaderConfig;
  }

  export interface HardhatUserConfig {
    selectorUploader?: SelectorUploaderUserConfig;
  }
}

declare module 'hardhat/types/global-options' {
  interface GlobalOptions {
    noUploadSelectors: boolean;
  }
}
