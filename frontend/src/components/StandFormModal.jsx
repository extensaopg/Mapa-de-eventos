export default function StandFormModal({
    aberto,
    fecharModal,
    salvarStand,
    standEmEdicao,
    nome, setNome,          // NOVO CAMPO
    descricao, setDescricao,
    dataInicio, setDataInicio,
    dataFim, setDataFim
}) {
    if (!aberto) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h3 style={{ margin: '0 0 20px 0', color: '#1976D2' }}>
                    {standEmEdicao ? 'Editar Stand' : 'Novo Stand'}
                </h3>
                
                <form onSubmit={salvarStand} style={styles.form}>
                    {/* NOVO CAMPO: Nome do Stand */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome do Stand</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Ex: Stand da Computação"
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            style={styles.input} 
                        />
                    </div>

                    {/* CAMPO ATUALIZADO: Descrição agora é um textarea */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Descrição Detalhada</label>
                        <textarea 
                            required 
                            placeholder="O que haverá neste stand? Quais os projetos apresentados?"
                            value={descricao} 
                            onChange={e => setDescricao(e.target.value)} 
                            style={{...styles.input, minHeight: '80px', resize: 'vertical'}} 
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Data de Início</label>
                            <input type="date" required value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Data de Fim</label>
                            <input type="date" required value={dataFim} onChange={e => setDataFim(e.target.value)} style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.modalActions}>
                        <button type="button" onClick={fecharModal} style={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" style={styles.saveBtn}>Salvar Stand</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const styles = {
    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { background: '#FFF', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' },
    row: { display: 'flex', gap: '16px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#444' },
    input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none', backgroundColor: '#FAFAFA', fontFamily: 'inherit' },
    modalActions: { display: 'flex', gap: '12px', marginTop: '24px' },
    cancelBtn: { flex: 1, padding: '12px', background: '#F4F6F8', color: '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    saveBtn: { flex: 1, padding: '12px', background: '#1976D2', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
}