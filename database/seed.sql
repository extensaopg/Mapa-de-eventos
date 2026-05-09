-- ================= USUARIOS =================
INSERT INTO Usuario (nome, email, telefone, senha)
VALUES
    ('João Silva', 'joao@email.com', '75999990001', '123456'),
    ('Maria Souza', 'maria@email.com', '75999990002', '123456'),
    ('Carlos Lima', 'carlos@email.com', '75999990003', '123456');

-- ================= EVENTOS =================
INSERT INTO Evento (
    descricao,
    data_inicio,
    data_fim,
    latitude,
    longitude
)
VALUES
    (
        'Feira de Tecnologia UEFS',
        '2026-06-10',
        '2026-06-12',
        -12.2006,
        -38.9696
    ),
    (
        'Expo Games Bahia',
        '2026-07-01',
        '2026-07-03',
        -12.2500,
        -38.9600
    );

-- ================= EVENTO ADMIN =================
INSERT INTO Evento_Administrador (
    id_usuario,
    id_evento
)
VALUES
    (1, 1),
    (2, 1),
    (3, 2);

-- ================= STANDS =================
INSERT INTO Stand (
    descricao,
    data_inicio,
    data_fim,
    latitude,
    longitude,
    cor_icone,
    id_evento
)
VALUES
    (
        'Stand de Inteligência Artificial',
        '2026-06-10',
        '2026-06-12',
        -12.2010,
        -38.9700,
        'red',
        1
    ),
    (
        'Stand de Robótica',
        '2026-06-10',
        '2026-06-12',
        -12.2020,
        -38.9680,
        'blue',
        1
    ),
    (
        'Stand Indie Games',
        '2026-07-01',
        '2026-07-03',
        -12.2510,
        -38.9610,
        'green',
        2
    );

-- ================= LOG BUSCA =================
INSERT INTO Log_Busca (
    termo
)
VALUES
    ('inteligência artificial'),
    ('robótica'),
    ('games'),
    ('ia');