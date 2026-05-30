import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;


function AtivarConta() {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    const [status, setStatus] = useState('Ativando sua conta...')
    const [type, setType] = useState('loading')
    const called = useRef(false)

    useEffect(() => {
        if (called.current) return
        called.current = true

        const token = params.get('token')

        async function ativar() {
            try {
                const res = await fetch(
                    `${API_URL}/usuarios/ativar/${token}`
                )

                const data = await res.json()

                if (!res.ok) {
                    setStatus(data.message || 'Erro ao ativar conta')
                    setType('error')
                    return
                }

                setStatus('Conta ativada com sucesso! 🎉')
                setType('success')

                // redireciona depois de 2.5s
                setTimeout(() => {
                    navigate('/login')
                }, 2500)

            } catch (err) {
                setStatus('Erro ao conectar com servidor')
                setType('error')
            }
        }

        ativar()
    }, [])

    return (
        <div style={styles.container}>
            <div style={styles.card(type)}>
                <h2>Ativação de Conta</h2>
                <p>{status}</p>

                {type === 'loading' && <p style={styles.small}>Aguarde...</p>}
                {type === 'success' && <p style={styles.small}>Redirecionando para login...</p>}
                {type === 'error' && <p style={styles.small}>Verifique o link do email</p>}
            </div>
        </div>
    )
}

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial',
        background: '#f5f5f5'
    },

    card: (type) => ({
        padding: 30,
        borderRadius: 12,
        textAlign: 'center',
        width: 320,
        background:
            type === 'success'
                ? '#e8f5e9'
                : type === 'error'
                    ? '#ffebee'
                    : '#fff',
        border:
            type === 'success'
                ? '1px solid #66bb6a'
                : type === 'error'
                    ? '1px solid #ef5350'
                    : '1px solid #ccc',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }),

    small: {
        fontSize: 12,
        marginTop: 10,
        opacity: 0.7
    }
}

export default AtivarConta