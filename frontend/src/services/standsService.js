const API_URL = 'http://localhost:3000';

export async function buscarStands() {

    const stands = [{
        "descricao": "Stand fixo de teste",
        "data_inicio": "2026-06-10T00:00:00.000Z",
        "data_fim": "2026-06-12T00:00:00.000Z",
        "latitude": -12.245752517300824,
        "longitude": -38.89723321002961,
        "cor_icone": "green",
        "id_evento": "6a18adbc584f2b16ee535d49"
    },
{
        "descricao": "Stand fixo de teste 2",
        "data_inicio": "2026-06-10T00:00:00.000Z",
        "data_fim": "2026-06-12T00:00:00.000Z",
        "latitude": -12.245752517300824,
        "longitude": -38.89705321002961,
        "cor_icone": "green",
        "id_evento": "6a18adbc584f2b16ee535d49"
    }]
    return stands
    
    /*
    const response = await fetch(`${API_URL}/stands`);

    if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
    }

    return response.json();*/
}