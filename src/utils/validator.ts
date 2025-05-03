function validateCEP(input: string): boolean | string {
  const cleanedCEP = input.replace(/\D/g, "");

  if (cleanedCEP.length !== 8) {
    return "O CEP deve ter exatamente 8 dígitos.";
  }

  const isNumeric = /^\d+$/.test(cleanedCEP);
  if (!isNumeric) {
    return "O CEP deve conter apenas números.";
  }

  return true;
}

function validateMinimumCharacters(input: string): boolean | string {
  if (input.trim().length < 3) {
    return "Por favor, digite pelo menos 3 caracteres";
  }
  return true;
}

export default {
  cep: validateCEP,
  minimumCharacters: validateMinimumCharacters,
};
