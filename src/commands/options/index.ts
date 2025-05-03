import inquirer from "inquirer";

export const availableOptions = [
  {
    name: "Consultar clima",
    value: "weather_command",
  },
  {
    name: "Consultar CEP",
    value: "zip_code_command",
  },
  {
    name: "Pesquisar CEP",
    value: "search_zip_code_command",
  },
  new inquirer.Separator(),
  {
    name: "Sair",
    value: "exit",
  },
  {
    name: "Configurações",
    value: "settings",
  },
];
