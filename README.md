# Hardhat 4byte Uploader

Calculate the function selectors found in all local contracts and upload them to the [4byte Directory](https://www.4byte.directory/) Ethereum Signature Database.

## Installation

```bash
yarn add --dev @solidstate/hardhat-4byte-uploader
```

## Usage

Load plugin in Hardhat config:

```javascript
require('@solidstate/hardhat-4byte-uploader');
```

Run the included Hardhat task manually:

```bash
yarn run hardhat upload-selectors
```
