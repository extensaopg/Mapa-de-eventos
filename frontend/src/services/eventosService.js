const API_URL = 'http://localhost:3000';

export async function buscarEventos() {
    const response = await fetch(`${API_URL}/eventos`);

    if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
    }

    return response.json();
}