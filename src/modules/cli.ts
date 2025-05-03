import Commands from "../commands/index.ts";

export async function initCli() {
  console.clear();
  Commands.welcome();
  setTimeout(() => {
    Commands.menu();
  }, 3000);
}
