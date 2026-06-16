import { useState } from 'react';
const styles = {
container: {
    position: 'absolute',
    top: '10px',
    left: '50px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontFamily: 'sans-serif'
},
wrapper: {
    display: 'flex',
    gap: '5px'
},
button: {
    width: '34px',
    height: '34px',
    background: 'white',
    border: 'none',
    borderRadius: '4px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
},
input: {
    width: '200px',
    height: '34px',
    padding: '0 10px',
    border: 'none',
    borderRadius: '4px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    outline: 'none'
},
resultsContainer: {
    background: 'white',
    borderRadius: '4px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    marginTop: '5px',
    width: '239px',
    maxHeight: '200px',
    overflowY: 'auto'
},
item: {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    color: '#333'
},
emptyItem: {
    padding: '8px 12px',
    fontSize: '14px',
    color: '#999',
    backgroundColor: 'white'
}
};

export default function SearchEventMap({ eventos, onSelectEvento, buscaAberta, setBuscaAberta }) {
    const [termoBusca, setTermoBusca] = useState('');

    const eventosFiltrados = eventos.filter(evento => 
        evento.descricao?.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <div style={styles.container} 
             onMouseDown={(e) => e.stopPropagation()}
             onDoubleClick={(e) => e.stopPropagation()}>
            
            <div style={styles.wrapper}>
                <button onClick={() => setBuscaAberta(!buscaAberta)} style={styles.button}>
                    🔍
                </button>
                {buscaAberta && (
                    <input
                        type="text"
                        placeholder="Buscar evento..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        style={styles.input}
                    />
                )}
            </div>

            {buscaAberta && termoBusca && (
                <div style={styles.resultsContainer}>
                    {eventosFiltrados.length > 0 ? (
                        eventosFiltrados.map((evento) => (
                            <div
                                key={evento.id || evento._id}
                                onClick={() => {
                                    onSelectEvento(evento);
                                    setTermoBusca('');
                                    setBuscaAberta(false);
                                }}
                                style={styles.item}
                            >
                                {evento.descricao}
                            </div>
                        ))
                    ) : (
                        <div style={styles.emptyItem}>Nenhum evento encontrado</div>
                    )}
                </div>
            )}
        </div>
    );
}