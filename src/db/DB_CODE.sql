#use electionsDB; #COMENTAR EN PROD

# - - - - -  - - - - USER - - - - -  - - - - 
CREATE TABLE User (
    user_id VARCHAR(255) PRIMARY KEY DEFAULT '0',
    name VARCHAR(255),
    first_lastname VARCHAR(255),
    second_lastname VARCHAR(255),
    user_type INT DEFAULT 0,
    password VARCHAR(255),
    email VARCHAR(255)
);


ALTER TABLE User ADD verified_account BOOL DEFAULT FALSE;
ALTER TABLE User ADD enable BOOL DEFAULT TRUE;
ALTER TABLE User
ADD electorPermission BOOLEAN DEFAULT FALSE,
ADD candidatePermission BOOLEAN DEFAULT FALSE,
ADD ballotPermission BOOLEAN DEFAULT FALSE,
ADD excercisePermission BOOLEAN DEFAULT FALSE,
ADD politicalPartyPermission BOOLEAN DEFAULT FALSE,
ADD usersPermission BOOLEAN DEFAULT FALSE,
ADD verificateElectorPermission BOOLEAN DEFAULT FALSE;


select * from user;
#Registrar usuario administrador
#correo: admin
#contraseña: mNyMXFRYEVgw
INSERT INTO User (user_id, name, first_lastname, second_lastname, user_type, password, email, verified_account, electorPermission,
candidatePermission, ballotPermission, excercisePermission, politicalPartyPermission, usersPermission, verificateElectorPermission) 
values ("FJDDOKJV", "admin", "admin", "admin", 1,  "$2b$10$siLEhkLcjbXqNlDpqMni1eY8YEZYFo03rLbCwOtyYbpFBdxwnSR0a", "admin",
1,1,1,1,1,1,1,1);

select * from User;
describe user;


# - - - - -  - - - - CANDIDATE - - - - -  - - - - 
CREATE TABLE candidate (
  candidate_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  first_lastname VARCHAR(255) NOT NULL,
  second_lastname VARCHAR(255) NOT NULL,
  pseudonym VARCHAR(255) NOT NULL,
  party_id INT NOT NULL
);
ALTER TABLE candidate ADD enable BOOL DEFAULT true;
ALTER TABLE candidate ADD status BOOL DEFAULT false;
ALTER TABLE candidate ADD totalVotes INT DEFAULT 0;


describe candidate;
select * from candidate;

# - - - - -  - - - - State - - - - -  - - - - 
CREATE TABLE state (
  state_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  acronym VARCHAR(255)
);
INSERT INTO state (name, acronym) VALUES ("Aguascalientes", "AGS");
INSERT INTO state (name, acronym) VALUES ("Baja California", "BC");
INSERT INTO state (name, acronym) VALUES ("Baja California Sur", "BCS");
INSERT INTO state (name, acronym) VALUES ("Campeche", "CAM");
INSERT INTO state (name, acronym) VALUES ("Chiapas", "CHIS");
INSERT INTO state (name, acronym) VALUES ("Chihuahua", "CHIH");
INSERT INTO state (name, acronym) VALUES ("Ciudad de México", "CDMX");
INSERT INTO state (name, acronym) VALUES ("Coahuila", "COAH");
INSERT INTO state (name, acronym) VALUES ("Colima", "COL");
INSERT INTO state (name, acronym) VALUES ("Durango", "DGO");
INSERT INTO state (name, acronym) VALUES ("Guanajuato", "GTO");
INSERT INTO state (name, acronym) VALUES ("Guerrero", "GRO");
INSERT INTO state (name, acronym) VALUES ("Hidalgo", "HGO");
INSERT INTO state (name, acronym) VALUES ("Jalisco", "JAL");
INSERT INTO state (name, acronym) VALUES ("México", "MEX");
INSERT INTO state (name, acronym) VALUES ("Michoacán", "MICH");
INSERT INTO state (name, acronym) VALUES ("Morelos", "MOR");
INSERT INTO state (name, acronym) VALUES ("Nayarit", "NAY");
INSERT INTO state (name, acronym) VALUES ("Nuevo León", "NL");
INSERT INTO state (name, acronym) VALUES ("Oaxaca", "OAX");
INSERT INTO state (name, acronym) VALUES ("Puebla", "PUE");
INSERT INTO state (name, acronym) VALUES ("Querétaro", "QRO");
INSERT INTO state (name, acronym) VALUES ("Quintana Roo", "QR");
INSERT INTO state (name, acronym) VALUES ("San Luis Potosí", "SLP");
INSERT INTO state (name, acronym) VALUES ("Sinaloa", "SIN");
INSERT INTO state (name, acronym) VALUES ("Sonora", "SON");
INSERT INTO state (name, acronym) VALUES ("Tabasco", "TAB");
INSERT INTO state (name, acronym) VALUES ("Tamaulipas", "TAMS");
INSERT INTO state (name, acronym) VALUES ("Tlaxcala", "TLAX");
INSERT INTO state (name, acronym) VALUES ("Veracruz", "VER");
INSERT INTO state (name, acronym) VALUES ("Yucatán", "YUC");
INSERT INTO state (name, acronym) VALUES ("Zacatecas", "ZAC");
select * from state;

# - - - - -  - - - - Political_party - - - - -  - - - - 
CREATE TABLE political_party (
  party_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  acronym VARCHAR(255),
  foundation DATE,
  img_logo VARCHAR(255),
  color_hdx VARCHAR(255),
  status BOOLEAN DEFAULT 1
);
select * from political_party;


# - - - - -  - - - - elector - - - - -  - - - - 
CREATE TABLE elector (
  elector_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  first_lastname VARCHAR(255),
  second_lastname VARCHAR(255),
  date_of_birth DATE,
  street VARCHAR(255),
  outer_number VARCHAR(10),
  interior_number VARCHAR(10),
  zip_code VARCHAR(10),
  state_id INT,
  picture VARCHAR(255),
  gender VARCHAR(10),
  email VARCHAR(255),
  enable BOOLEAN default 1
);
ALTER TABLE elector MODIFY COLUMN gender CHAR(1);
ALTER TABLE elector MODIFY COLUMN elector_id CHAR(20);

select * from elector;


# - - - - -  - - - - Ballot - - - - -  - - - - 
CREATE TABLE Ballot (
  ballot_id VARCHAR(255) PRIMARY KEY,
  charge_id INT NOT NULL,
  state_id INT NOT NULL,
  candidates_ids TEXT NOT NULL,
  election_date DATE NOT NULL
);
ALTER TABLE Ballot ADD status BOOL DEFAULT true;
ALTER TABLE Ballot 
ADD winnerCandidate_id INT DEFAULT 0;
ALTER TABLE Ballot
ADD CONSTRAINT FK_Ballot_Candidate
FOREIGN KEY (winnerCandidate_id) 
REFERENCES candidate(candidate_id);
ALTER TABLE Ballot ADD totalVotes INT DEFAULT 0;
ALTER TABLE Ballot ADD anuledVotes INT DEFAULT 0;
select * from ballot;

CREATE TABLE ballot_candidate (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ballot_id VARCHAR(255),
  candidate_id INT,
  FOREIGN KEY (ballot_id) REFERENCES Ballot(ballot_id),
  FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id)
);
select * from ballot_candidate;

# - - - - -  - - - - Charges - - - - -  - - - - 
CREATE TABLE charge (
  charge_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
INSERT INTO charge (name) VALUES ('Presidencia');
INSERT INTO charge (name) VALUES ('Gubernatura');
INSERT INTO charge (name) VALUES ('Alcaldía');
INSERT INTO charge (name) VALUES ('Diputación Federal');
INSERT INTO charge (name) VALUES ('Diputación Local');
INSERT INTO charge (name) VALUES ('Senaduría');

select * from charge;

# - - - - -  - - - - Election Type - - - - -  - - - - 
CREATE TABLE election_type(
	 election_type_id INT AUTO_INCREMENT PRIMARY KEY ,
     name varchar(30)
);
INSERT INTO election_type (name) VALUES ("ordinaria");
INSERT INTO election_type (name) VALUES ("extraordinaria");

# - - - - -  - - - - EXERCISE - - - - -  - - - - 
CREATE TABLE election_Exercise (
  exercise_id VARCHAR(255) PRIMARY KEY,
  election_type_id INT NOT NULL,
  state_id INT NOT NULL,
  date DATE NOT NULL,
  status bool default 0,
  enable bool default 1,
  ballots_ids TEXT,
  FOREIGN KEY (election_type_id) REFERENCES election_type(election_type_id),
  FOREIGN KEY (state_id) REFERENCES state(state_id)
);
select * from election_exercise;
ALTER TABLE election_Exercise ADD COLUMN expected_votes INT default 0;
SELECT * FROM elector where state_id = 1;

CREATE TABLE election_Exercise_ballot (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ballot_id VARCHAR(255),
  exercise_id VARCHAR(255),
  FOREIGN KEY (ballot_id) REFERENCES Ballot(ballot_id),
  FOREIGN KEY (exercise_id) REFERENCES election_Exercise(exercise_id)
);
select * from election_Exercise_ballot;

# - - - - -  - - - - USER TYPE - - - - -  - - - - 
CREATE TABLE user_type (
  user_type_id INT PRIMARY KEY auto_increment,
  name varchar(255)
);
insert into user_type (name) values ("Administrador Sr.");
insert into user_type (name) values ("Administrador Jr.");
select * from user_type;

# - - - - -  - - - - exercise_elector_vote - - - - -  - - - - 
CREATE TABLE exercise_elector_vote (
  exercise_elector_vote_id INT AUTO_INCREMENT PRIMARY KEY,
  elector_id Char(20) NOT NULL,
  exercise_id VARCHAR(255) NOT NULL,
  FOREIGN KEY (elector_id) REFERENCES elector(elector_id),
  FOREIGN KEY (exercise_id) REFERENCES election_Exercise(exercise_id)
);

describe exercise_elector_vote;
select * from exercise_elector_vote;


#  - - -  - - - CONSTRAINTS  - - - - 
ALTER TABLE candidate
ADD CONSTRAINT fk_candidate_party
FOREIGN KEY (party_id) REFERENCES political_party(party_id);

ALTER TABLE BALLOT
ADD CONSTRAINT fk_ballotcharge_charge_id
FOREIGN KEY (charge_id) REFERENCES charge(charge_id);

ALTER TABLE elector
ADD CONSTRAINT fk_electorstate_state_id
FOREIGN KEY (state_id) REFERENCES state(state_id);

ALTER TABLE user
ADD CONSTRAINT fk_userType_user_type
FOREIGN KEY (user_type) REFERENCES user_type(user_type_id);



















#EOF