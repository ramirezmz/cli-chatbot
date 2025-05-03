import { initCli } from "./modules/cli.ts";
import { initObservability } from "./modules/observability.ts";

async function main() {
  initObservability();
  await initCli();
}

main();
