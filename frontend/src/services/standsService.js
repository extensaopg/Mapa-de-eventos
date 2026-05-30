const API_URL = `${import.meta.env.VITE_API_URL}`

export async function buscarStands() {
    const response = await fetch(`${API_URL}/stands/`);

    if (!response.ok) {
        throw new Error('Erro ao buscar stands');
    }

    const stands = await response.json()
    console.log(stands)
    return stands;
}