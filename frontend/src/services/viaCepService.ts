interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const searchCepByAddress = async (
  state: string,
  city: string,
  street: string
): Promise<string | null> => {
  if (!state || !city || !street || city.length < 3 || street.length < 3) {
    return null;
  }

  try {
    const encodedState = encodeURIComponent(state);
    const encodedCity = encodeURIComponent(city);
    const encodedStreet = encodeURIComponent(street);
    
    const url = `https://viacep.com.br/ws/${encodedState}/${encodedCity}/${encodedStreet}/json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data: ViaCepResponse[] = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].cep) {
      return data[0].cep;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching CEP from ViaCEP:", error);
    return null;
  }
};

