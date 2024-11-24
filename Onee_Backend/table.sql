create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(50),
    status varchar(50),
    role varchar(20),
    UNIQUE (email)

);
insert into user(name,contactNumber,email,password,status,role) values('Admin','12345678','admin@gmail.com','admin','true','admin');
create table famille(
    id int Not null AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
);
create table material(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    familleId integer NOT NULL,
    N-serie varchar(255),
    Code-onee varchar(50),
    Mark varchar(50),
    activite varchar(50),
     primary key(id)
);
create table ticket (
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL,
    Nom_et_prenom(250) NOT NULL,
    matricule varchar(250) NOT NULL,
    entite varchar(50) NOT NULL,
    Adresse_du_site(50) NOT NULL,
    materialDetails JSON DEFAULT NULL,
    createBy varchar(255) NOT NULL,
    primary key(id)
);