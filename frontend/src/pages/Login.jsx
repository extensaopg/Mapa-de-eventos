import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('')

    async function handleLogin(e) {
        e.preventDefault()

        setError('')

        try {
            const res = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, senha })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                return
            }

            // login ok → vai pro mapa
            navigate('/')

        } catch (err) {
            setError('Erro ao conectar com servidor')
        }
    }

    return (
        <div style={styles.container}>
            <h2>Login</h2>

            <form onSubmit={handleLogin} style={styles.form}>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    style={styles.input}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" style={styles.button}>
                    Entrar
                </button>

            </form>

            <div style={styles.links}>
                <p
                    style={styles.link}
                    onClick={() => navigate('/esqueci-senha')}
                >
                    Esqueci minha senha
                </p>

                <p
                    style={styles.link}
                    onClick={() => navigate('/cadastro')}
                >
                    Criar conta
                </p>
            </div>
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
    links: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        textAlign: 'center'
    },
    link: {
        color: '#1976d2',
        cursor: 'pointer'
    }
}

export default Login