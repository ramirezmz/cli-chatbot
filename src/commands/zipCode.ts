import inquirer from "inquirer";
import { spinner } from "../utils/spinner.ts";
import validator from "../utils/validator.ts";
import { getAddressByZipCode, searchZipCodeByAddress } from "../api/viaCEP.ts";
import chalk from "chalk";
import { getAllStates, getCitiesByState } from "../api/brasil.ts";

async function getCEPInfoCommand() {
  console.clear();
  const { cep } = await inquirer.prompt([
    {
      type: "input",
      name: "cep",
      message: "Digite o CEP que deseja consultar:",
      validate: validator.cep,
      default: "00000000",
    },
  ]);

  spinner.start();
  try {
    const response = await getAddressByZipCode(cep);
    if (!response || response.erro) {
      spinner.error({
        text: "CEP não encontrado!",
        mark: "✖",
      });
      return;
    }

    spinner.success({
      text: "CEP consultado com sucesso!",
      mark: "✔",
    });

    console.log("\n" + chalk.bold.blue("📍 Informações do CEP:"));
    console.log("╔══════════════════════════════════════════════════");

    const displayField = (label: string, value: string) => {
      if (value?.trim() !== "") {
        console.log(
          `║ ${chalk.yellow(label.padEnd(12))}: ${chalk.green(value)}`
        );
      }
    };

    displayField("CEP", response.cep);
    displayField("Logradouro", response.logradouro);
    displayField("Bairro", response.bairro);
    displayField("Cidade", response.localidade);
    displayField("Estado", `${response.uf} - ${response.estado || ""}`);
    displayField("Região", response.regiao);

    if (response.complemento) {
      displayField("Complemento", response.complemento);
    }

    if (response.ddd) {
      displayField("DDD", response.ddd);
    }

    console.log("╚══════════════════════════════════════════════════");
  } catch (error) {
    spinner.error({
      text: "Erro ao consultar o CEP!",
      mark: "✖",
    });
    console.error(error);
  }
}

async function searchCEPCommand() {
  console.clear();
  spinner.start({ text: "Carregando estados..." });
  try {
    const states = await getAllStates();
    spinner.success({ text: "Estados carregados!", mark: "✓" });

    const stateChoices = states.map((state) => ({
      name: `${state.nome} (${state.sigla})`,
      value: state.sigla,
    }));

    const { uf } = await inquirer.prompt([
      {
        type: "list",
        name: "uf",
        message: "Selecione um estado:",
        choices: stateChoices,
      },
    ]);

    spinner.start({ text: "Carregando cidades..." });
    const cities = await getCitiesByState(uf);
    spinner.success({ text: "Cidades carregadas!", mark: "✓" });

    const cityChoices = cities.map((city) => ({
      name: city.nome,
      value: city.nome,
    }));

    const { city } = await inquirer.prompt([
      {
        type: "list",
        name: "city",
        message: "Selecione uma cidade:",
        choices: cityChoices,
      },
    ]);

    const { street } = await inquirer.prompt([
      {
        type: "input",
        name: "street",
        message: "Digite o nome da rua (ou parte dele):",
        validate: validator.minimumCharacters,
      },
    ]);

    spinner.start({ text: "Buscando CEPs..." });
    const addresses = await searchZipCodeByAddress(uf, city, street);

    if (!addresses || addresses.length === 0) {
      spinner.error({
        text: "Nenhum CEP encontrado com esses critérios!",
        mark: "✖",
      });
      return;
    }

    spinner.success({
      text: `${addresses.length} CEPs encontrados!`,
      mark: "✓",
    });

    console.log("\n" + chalk.bold.blue("📍 CEPs encontrados:"));
    console.log("╔══════════════════════════════════════════════════");

    addresses.forEach((address, index) => {
      console.log(
        `║ ${chalk.yellow((index + 1).toString().padEnd(3))} ${chalk.green(
          address.cep
        )} - ${chalk.green(address.logradouro)}`
      );
      console.log(
        `║     ${chalk.dim(address.bairro)}, ${chalk.dim(
          address.localidade
        )}/${chalk.dim(address.uf)}`
      );
      if (index < addresses.length - 1) {
        console.log("║ " + "─".repeat(48));
      }
    });

    console.log("╚══════════════════════════════════════════════════");
  } catch (error) {
    spinner.error({ text: "Ocorreu um erro na busca!", mark: "✖" });
    console.error(error);
  }
}

export default {
  getCEPInfoCommand,
  searchCEPCommand,
};
