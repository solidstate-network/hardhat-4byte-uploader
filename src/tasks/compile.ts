import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';

task(TASK_COMPILE).setAction(async (args, hre, runSuper) => {
  await runSuper(args);

  if (hre.config.fourByteUploader.runOnCompile) {
    await hre.run('upload-selectors', { noCompile: true });
  }
});
