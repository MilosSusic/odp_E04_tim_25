-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS DEFAULT_DB;

-- Koriscenje default baze podataka
USE DEFAULT_DB;


CREATE TABLE users (
   id int NOT NULL AUTO_INCREMENT,
   ime_prezime varchar(255) NOT NULL,
   username varchar(100) NOT NULL,
   password varchar(255) NOT NULL,
   role varchar(20) DEFAULT NULL,
   PRIMARY KEY (id),
   UNIQUE KEY username (username)
 );
 
CREATE TABLE comments (
  id INT NOT NULL AUTO_INCREMENT,
  comment VARCHAR(120) NOT NULL,
  price INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE faults (
  id          INT NOT NULL AUTO_INCREMENT,
  userId      INT NOT NULL,
  commentId   INT NULL DEFAULT NULL,
  name        VARCHAR(120) NOT NULL,
  description VARCHAR(200) NOT NULL,
  imageUrl    VARCHAR(200),
  status      VARCHAR(20) NOT NULL DEFAULT 'Kreiran',
  createdAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

INSERT INTO users (id, ime_prezime, username, password, role) VALUES
  (1, 'Milos Susic',   'milossusic22@gmail.com', '123456', 'majstor'),
  (2, 'Bozana Todorovic','bozanabojan@gmail.com','654321', 'stanar');
 
