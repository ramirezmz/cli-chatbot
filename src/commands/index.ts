import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import CEP from "./zipCode.ts";
import Weather from "./weather.ts";
import { availableOptions } from "./options/index.ts";

function welcome() {
  const title = chalkAnimation.rainbow("Sejam ben-vindos ao Chatbot!");

  setTimeout(() => {
    title.stop();
  }, 1000);
}

async function menu() {
  const { selectedOption } = await inquirer.prompt({
    type: "list",
    name: "selectedOption",
    message: "O que você deseja fazer?",
    choices: availableOptions,
  });

  if (selectedOption === "weather_command") {
    await Weather.getWeatherCommand();
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
      await Weather.getWeatherCommand();
    }
    return menu();
  } else if (selectedOption === "zip_code_command") {
    await CEP.getCEPInfoCommand();
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
      await CEP.getCEPInfoCommand();
    }
    menu();
  } else if (selectedOption === "search_zip_code_command") {
    await CEP.searchCEPCommand();

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
      await CEP.searchCEPCommand();
    }
    menu();
  } else if (selectedOption === "exit") {
    console.log("Saindo...");
    process.exit(0);
  } else if (selectedOption === "settings") {
    // await settingsCommand();
    console.log("Configurações ainda não implementadas.");
    menu();
  }
}

export default {
  welcome,
  menu,
};
