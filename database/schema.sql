-- ================= USUARIO =================
CREATE TABLE Usuario (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         nome VARCHAR(100),
                         email VARCHAR(100) UNIQUE,
                         telefone VARCHAR(20),
                         senha VARCHAR(255)
);

-- ================= EVENTO =================
CREATE TABLE Evento (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        descricao VARCHAR(255),
                        data_inicio DATE,
                        data_fim DATE,
                        latitude FLOAT,
                        longitude FLOAT
);

-- ================= EVENTO ADMIN =================
CREATE TABLE Evento_Administrador (
                                      id_usuario INT,
                                      id_evento INT,
                                      PRIMARY KEY (id_usuario, id_evento),
                                      FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
                                      FOREIGN KEY (id_evento) REFERENCES Evento(id)
);

-- ================= STAND =================
CREATE TABLE Stand (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       descricao VARCHAR(255),
                       data_inicio DATE,
                       data_fim DATE,
                       latitude FLOAT,
                       longitude FLOAT,
                       cor_icone VARCHAR(20),
                       id_evento INT,
                       FOREIGN KEY (id_evento) REFERENCES Evento(id)
);

-- ================= LOG BUSCA =================
CREATE TABLE Log_Busca (
                           id INT PRIMARY KEY AUTO_INCREMENT,
                           termo VARCHAR(100),
                           data DATETIME DEFAULT CURRENT_TIMESTAMP
);