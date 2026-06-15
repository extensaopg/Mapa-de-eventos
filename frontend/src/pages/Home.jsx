import { useNavigate } from 'react-router-dom'
import '../styles/home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      {/* Lado Esquerdo */}
      <div className="home-left">
        <h1 className="home-h1"> Este é o seu primeiro acesso? </h1>
        <button 
          className="home-btn btn-primary" 
          onClick={() => navigate('/faq')}
        >
          Tutorial
        </button>

      </div>

      {/* Lado Direito */}
      <div className="home-right">
        <h2 className="home-h2"> Já estive aqui antes. </h2>
        <button 
          className="home-btn btn-secondary" 
          onClick={() => navigate('/mapa')}
        >
          Ver eventos
        </button>
                <button 
          className="home-btn btn-outline" 
          onClick={() => navigate('/cadastro')}
          >
          Criar Conta
        </button>
        <button 
          className="home-btn btn-outline" 
          onClick={() => navigate('/login')}
        >
          Logar
        </button>
      </div>
    </div>
  )
}

export default Home