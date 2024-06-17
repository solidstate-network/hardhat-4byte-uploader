# Hardhat 4byte Uploader

Calculate the function selectors found in all local contracts and upload them to the [4byte Directory](https://www.4byte.directory/) Ethereum Signature Database.

## Installation

```bash
npm install --save-dev @solidstate/hardhat-4byte-uploader
# or
yarn add --dev @solidstate/hardhat-4byte-uploader
```

## Usage

Load plugin in Hardhat config:

```javascript
require('@solidstate/hardhat-4byte-uploader');
```

Add configuration under the `fourByteUploader` key:

| option         | description                                                                                                       | default |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| `runOnCompile` | whether to automatically upload selectors during compilation (ignored if Hardhat detects a CI server environment) | `false` |

```javascript
fourByteUploader: {
  runOnCompile: true,
}
```

Run the included Hardhat task manually:

```bash
npx hardhat upload-selectors
# or
yarn run hardhat upload-selectors
```

## Development

Install dependencies via Yarn:

```bash
yarn install
```

Setup Husky to format code on commit:

```bash
yarn prepare
```
