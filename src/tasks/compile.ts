import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';
import { isRunningOnCiServer } from 'hardhat/internal/util/ci-detection';

task(TASK_COMPILE).setAction(async (args, hre, runSuper) => {
  await runSuper(args);

  if (hre.config.fourByteUploader.runOnCompile && !isRunningOnCiServer()) {
    await hre.run('upload-selectors', { noCompile: true });
  }
});
