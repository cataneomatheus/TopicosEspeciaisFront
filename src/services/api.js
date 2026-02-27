const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getPlayers() {
  const res = await fetch(`${API_URL}/api/players`);
  if (!res.ok) throw new Error('Erro ao buscar jogadores');
  return res.json();
}

export async function getPlayerById(id) {
  const res = await fetch(`${API_URL}/api/players/${id}`);
  if (!res.ok) throw new Error('Jogador não encontrado');
  return res.json();
}

export async function createPlayer(player) {
  const res = await fetch(`${API_URL}/api/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
  if (!res.ok) throw new Error('Erro ao criar jogador');
  return res.json();
}

export async function updatePlayer(id, player) {
  const res = await fetch(`${API_URL}/api/players/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(player),
  });
  if (!res.ok) throw new Error('Erro ao atualizar jogador');
  return res.json();
}

export async function deletePlayer(id) {
  const res = await fetch(`${API_URL}/api/players/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao remover jogador');
}
