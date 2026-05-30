import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;


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
            const res = await fetch(
                `${API_URL}/usuarios/reset-senha/${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ senha })
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                return
            }

            setMsg('Senha alterada com sucesso!')

            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (err) {
            setError('Erro ao conectar com servidor')
        }
    }

    return (
        <div style={styles.container}>
            <h2>Nova senha</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="password"
                    placeholder="Nova senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    style={styles.input}
                />

                <button style={styles.button}>
                    Salvar senha
                </button>
            </form>

            {msg && <p style={{ color: 'green' }}>{msg}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: 300,
        gap: 10
    },
    input: {
        padding: 10,
        borderRadius: 6,
        border: '1px solid #ccc'
    },
    button: {
        padding: 10,
        borderRadius: 6,
        border: 'none',
        background: '#2e7d32',
        color: 'white',
        cursor: 'pointer'
    }
}

export default ResetSenha