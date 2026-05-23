import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function AtivarConta() {
    const [params] = useSearchParams()
    const [status, setStatus] = useState('Carregando...')
    const called = useRef(false)

    useEffect(() => {
        if (called.current) return
        called.current = true

        const token = params.get('token')

        async function ativar() {
            try {
                const res = await fetch(
                    `http://localhost:3000/usuarios/ativar/${token}`
                )

                const data = await res.json()

                setStatus(data.message)
            } catch (err) {
                setStatus('Erro ao ativar conta')
            }
        }

        ativar()
    }, [])

    return <h2>{status}</h2>
}

export default AtivarConta