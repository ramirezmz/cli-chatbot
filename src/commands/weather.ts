import chalk from "chalk";
import inquirer from "inquirer";
import { spinner } from "../utils/spinner.ts";
import { searchPlaceInformation } from "../api/nominatim.ts";
import { getWeather } from "../api/openMeteo.ts";
import validator from "../utils/validator.ts";

async function getWeatherCommand() {
  try {
    const { city } = await inquirer.prompt([
      {
        type: "input",
        name: "city",
        message: "Digite o nome da cidade:",
        validate: validator.minimumCharacters,
      },
    ]);

    spinner.start({ text: "Buscando informações sobre a cidade..." });
    const locations = await searchPlaceInformation(city);

    if (!locations || locations.length === 0) {
      spinner.error({
        text: "Nenhuma cidade encontrada com esse nome!",
        mark: "✖",
      });
      return;
    }

    spinner.success({
      text: `${locations.length} locais encontrados!`,
      mark: "✓",
    });

    const locationChoices = locations.map((location) => ({
      name: `${location.name}, ${
        location.address.state || location.address.country
      } (${location.display_name})`,
      value: location,
    }));

    const { selectedLocation } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedLocation",
        message: "Selecione a localização exata:",
        choices: locationChoices,
      },
    ]);

    spinner.start({ text: "Consultando previsão meteorológica..." });
    const weather = await getWeather(
      parseFloat(selectedLocation.lat),
      parseFloat(selectedLocation.lon)
    );

    spinner.success({ text: "Previsão obtida com sucesso!", mark: "✓" });

    displayWeatherForecast(selectedLocation, weather);
  } catch (error) {
    spinner.error({ text: "Erro ao consultar previsão do tempo!", mark: "✖" });
    console.error(error);
  }
}

function displayWeatherForecast(
  location: { name: string; address: { state?: string; country: string } },
  weather: any
) {
  console.log("\n" + chalk.bold.blue("🌤️  Previsão do Tempo"));
  console.log("╔══════════════════════════════════════════════════");
  console.log(
    `║ ${chalk.yellow("Local")}: ${chalk.green(location.name)}, ${chalk.green(
      location.address.state || location.address.country
    )}`
  );
  console.log(
    `║ ${chalk.yellow("Timezone")}: ${chalk.green(weather.timezone)}`
  );
  console.log("║ ");
  console.log(`║ ${chalk.bold("Previsão para as próximas horas:")}`);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const groupedTemps: Record<string, { hour: string; temp: number }[]> = {};

  for (let i = 0; i < Math.min(24, weather.hourly.time.length); i++) {
    const time = weather.hourly.time[i];
    const temp = weather.hourly.temperature_2m[i];

    const date = time.split("T")[0];
    const hour = time.split("T")[1].slice(0, 5);

    if (!groupedTemps[date]) {
      groupedTemps[date] = [];
    }

    groupedTemps[date].push({ hour, temp });
  }

  Object.keys(groupedTemps).forEach((date) => {
    if (date === todayStr || date === tomorrowStr) {
      const formattedDate =
        date === todayStr
          ? chalk.bold.cyan("Hoje")
          : chalk.bold.magenta("Amanhã");

      console.log(`║ ${formattedDate} (${date}):`);

      const hours = groupedTemps[date];
      for (let i = 0; i < Math.min(8, hours.length); i++) {
        const { hour, temp } = hours[i];
        const tempColor =
          temp < 15 ? chalk.blue : temp > 30 ? chalk.red : chalk.yellow;
        console.log(`║   ${hour}: ${tempColor(`${temp}°C`)}`);
      }
      console.log("║ ");
    }
  });

  console.log("╚══════════════════════════════════════════════════");
}

export default {
  getWeatherCommand,
};
