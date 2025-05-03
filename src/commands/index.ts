import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import CEP from "./zipCode.ts";
import Weather from "./weather.ts";
import { availableOptions } from "./options/index.ts";
import logger from "../observability/logger.ts";
import { measureAsync, trackCommand } from "../modules/observability.ts";

function welcome() {
  const title = chalkAnimation.rainbow("Sejam ben-vindos ao Chatbot!");

  setTimeout(() => {
    title.stop();
  }, 1000);
}

async function menu() {
  logger.info("Iniciando o menu principal...");

  const { selectedOption } = await inquirer.prompt({
    type: "list",
    name: "selectedOption",
    message: "O que você deseja fazer?",
    choices: availableOptions,
  });

  trackCommand(selectedOption);

  if (selectedOption === "weather_command") {
    await measureAsync(
      "weather_command",
      async () => {
        await Weather.getWeatherCommand();
      },
      {
        command: "weather_command",
      }
    );

    const { searchAnotherCity } = await inquirer.prompt([
      {
        type: "confirm",
        name: "searchAnotherCity",
        message: "Você deseja consultar o clima de outra cidade?",
        default: false,
      },
    ]);
    if (searchAnotherCity) {
      console.clear();
      trackCommand("repeat_weather_command");
      await measureAsync(
        "repeat_weather_command",
        async () => {
          await Weather.getWeatherCommand();
        },
        { command: "weather", repeated: true }
      );
    }
    return menu();
  } else if (selectedOption === "zip_code_command") {
    await measureAsync(
      "zip_code_command",
      async () => {
        await CEP.getCEPInfoCommand();
      },
      { command: "zip_code" }
    );
    const { searchAnotherCEP } = await inquirer.prompt([
      {
        type: "confirm",
        name: "searchAnotherCEP",
        message: "Você deseja consultar outro CEP?",
        default: false,
      },
    ]);
    if (searchAnotherCEP) {
      console.clear();
      trackCommand("repeat_zip_code_command");
      await measureAsync(
        "repeat_zip_code_command",
        async () => {
          await CEP.getCEPInfoCommand();
        },
        { command: "zip_code", repeated: true }
      );
    }
    return menu();
  } else if (selectedOption === "search_zip_code_command") {
    await measureAsync(
      "search_zip_code_command",
      async () => {
        await CEP.searchCEPCommand();
      },
      { command: "search_zip_code" }
    );
    const { searchAnotherCEP } = await inquirer.prompt([
      {
        type: "confirm",
        name: "searchAnotherCEP",
        message: "Você deseja pesquisar outro CEP?",
        default: false,
      },
    ]);
    if (searchAnotherCEP) {
      console.clear();
      trackCommand("repeat_search_zip_code_command");
      await measureAsync(
        "repeat_search_zip_code_command",
        async () => {
          await CEP.searchCEPCommand();
        },
        { command: "search_zip_code", repeated: true }
      );
    }
    return menu();
  } else if (selectedOption === "exit") {
    logger.info("User exiting application");
    console.log("Saindo...");
    process.exit(0);
  } else if (selectedOption === "settings") {
    logger.info("Settings menu requested (not implemented)");
    console.log("Configurações ainda não implementadas.");
    return menu();
  }
}

export default {
  welcome,
  menu,
};
