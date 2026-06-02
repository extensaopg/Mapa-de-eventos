import { apiFetch } from './api'

export const standsService = {
  listar: () => apiFetch('/stands/'),

  listarPorEvento: (eventoId) => apiFetch(`/stands/?eventoId=${eventoId}`),

  buscarPorId: (id) => apiFetch(`/stands/${id}`),

  criar: (dados) =>
    apiFetch('/stands', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiFetch(`/stands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  deletar: (id) => apiFetch(`/stands/${id}`, { method: 'DELETE' }),
}
