import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = `${import.meta.env.VITE_API_URL}`


function EsqueciSenha() {
    const [email, setEmail] = useState('')
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        setMsg('')
        setError('')

        try {
            const res = await fetch(`${API_URL}/usuarios/esqueci-senha`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                return
            }

            setMsg('Email enviado! Verifique sua caixa de entrada.')

        } catch (err) {
            setError('Erro ao conectar com servidor')
        }
    }

    return (
        <div style={styles.container}>
            <h2>Recuperar senha</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <button style={styles.button}>
                    Enviar
                </button>
            </form>

            {msg && <p style={{ color: 'green' }}>{msg}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p style={styles.link} onClick={() => navigate('/login')}>
                Voltar para login
            </p>
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
        background: '#1976d2',
        color: 'white',
        cursor: 'pointer'
    },
    link: {
        marginTop: 15,
        color: '#1976d2',
        cursor: 'pointer'
    }
}

export default EsqueciSenha