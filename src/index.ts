import Commands from "./commands/index.ts";

function main() {
  console.clear();
  Commands.welcome();
  setTimeout(() => {
    Commands.menu();
  }, 1000);
}

main();
