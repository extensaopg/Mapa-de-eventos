import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'
import '../styles/auth.css'

function ResetSenha() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [senha, setSenha] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    setError('')

    try {
      const res = await usuariosService.resetSenha(token, senha)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      setMsg('Senha alterada com sucesso!')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Erro ao conectar com servidor')
    }
  }

  return (
    <div className="auth-container">
      <h2>Nova senha</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="auth-input"
        />

        <button className="auth-button auth-button--success">Salvar senha</button>
      </form>

      {msg && <p className="auth-msg--success">{msg}</p>}
      {error && <p className="auth-msg--error">{error}</p>}
    </div>
  )
}

export default ResetSenha
