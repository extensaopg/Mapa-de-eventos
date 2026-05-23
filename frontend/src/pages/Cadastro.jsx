import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Cadastro() {
    const navigate = useNavigate()

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function handleCadastro(e) {
        e.preventDefault()

        setError('')
        setSuccess('')

        try {
            const res = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    email,
                    telefone,
                    senha
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                return
            }

            setSuccess('Cadastro realizado! Verifique seu email para ativar a conta.')

            // opcional: redirecionar pro login depois de 2s
            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (err) {
            setError('Erro ao conectar com servidor')
        }
    }

    return (
        <div style={styles.container}>
            <h2>Cadastro</h2>

            <form onSubmit={handleCadastro} style={styles.form}>

                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
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
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <button type="submit" style={styles.button}>
                    Criar conta
                </button>

            </form>

            <p style={styles.link} onClick={() => navigate('/login')}>
                Já tenho conta
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
        background: '#2e7d32',
        color: 'white',
        cursor: 'pointer'
    },
    link: {
        marginTop: 15,
        color: '#1976d2',
        cursor: 'pointer'
    }
}

export default Cadastro