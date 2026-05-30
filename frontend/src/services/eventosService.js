const API_URL = `${import.meta.env.VITE_API_URL}`

export async function buscarEventos() {
    const response = await fetch(`${API_URL}/eventos`);

    if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
    }

    const eventos = response.json()
    return eventos;
}