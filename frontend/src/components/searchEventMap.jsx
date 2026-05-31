import { useState } from 'react';

export default function SearchEventMap({ eventos, onSelectEvento, buscaAberta,
                                           setBuscaAberta }) {

    const [termoBusca, setTermoBusca] = useState('');
    const [itemFocadoId, setItemFocadoId] = useState(null);

    const eventosFiltrados = eventos.filter(evento => 
        evento.descricao?.toLowerCase().includes(termoBusca.toLowerCase())
    );

    return (
        <div 
            style={{
                position: 'absolute',
                top: '10px',
                left: '50px', 
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                fontFamily: 'sans-serif'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
        >
            <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                    onClick={() => setBuscaAberta(!buscaAberta)}
                    title="Buscar Eventos"
                    style={{
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
                    }}
                >
                    🔍
                </button>

                {buscaAberta && (
                    <input
                        type="text"
                        placeholder="Buscar evento..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        style={{
                            width: '200px',
                            height: '34px',
                            padding: '0 10px',
                            border: 'none',
                            borderRadius: '4px',
                            boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
                            outline: 'none'
                        }}
                    />
                )}
            </div>

            {buscaAberta && termoBusca && (
                <div style={{
                    background: 'white',
                    borderRadius: '4px',
                    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
                    marginTop: '5px',
                    width: '239px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {eventosFiltrados.length > 0 ? (
                        eventosFiltrados.map((evento) => {
                            const idEvento = evento.id || evento._id;
                            const estaFocado = itemFocadoId === idEvento;

                            return (
                                <div
                                    key={idEvento}
                                    onClick={() => {
                                        onSelectEvento(evento);
                                        setTermoBusca('');
                                        setBuscaAberta(false);
                                    }}
                                    onMouseEnter={() => setItemFocadoId(idEvento)}
                                    onMouseLeave={() => setItemFocadoId(null)}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee',
                                        fontSize: '14px',
                                        color: '#333',
                                        background: estaFocado ? '#f5f5f5' : 'white',
                                        textAlign: 'left',
                                        transition: 'background 0.15s ease'
                                    }}
                                >
                                    {evento.descricao}
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ padding: '8px 12px', fontSize: '14px', color: '#999', backgroundColor: 'white' }}>
                            Nenhum evento encontrado
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}