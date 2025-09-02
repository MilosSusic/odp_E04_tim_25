-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS DEFAULT_DB;

-- Korišćenje default baze podataka
USE DEFAULT_DB;

-- Tabela korisnici
CREATE TABLE korisnici (
   id INT NOT NULL AUTO_INCREMENT,
   ime_prezime VARCHAR(255) NOT NULL,
   username VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
   role VARCHAR(20) DEFAULT NULL,
   PRIMARY KEY (id),
   UNIQUE KEY username (username)
);

-- Tabela komentari
CREATE TABLE komentari (
  id INT NOT NULL AUTO_INCREMENT,
  comment VARCHAR(120) NOT NULL,
  price INT NOT NULL,
  PRIMARY KEY (id)
);

-- Tabela kvarovi
CREATE TABLE kvarovi (
  id          INT NOT NULL AUTO_INCREMENT,
  userId      INT NOT NULL,
  commentId   INT NULL DEFAULT NULL,
  name        VARCHAR(120) NOT NULL,
  description VARCHAR(200) NOT NULL,
  imageUrl    VARCHAR(200),
  status      VARCHAR(20) NOT NULL DEFAULT 'Kreiran',
  createdAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES korisnici(id),
);

-- Ubacivanje korisnika
INSERT INTO korisnici (id, ime_prezime, username, password, role) VALUES
  (1, 'Milos Susic',   'milossusic22@gmail.com', '123456', 'majstor'),
  (2, 'Bozana Todorovic','bozanabojan@gmail.com','654321', 'stanar');

-- Provera podataka
SELECT * FROM korisnici;
 
