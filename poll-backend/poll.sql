CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  real_id VARCHAR UNIQUE NOT NULL,
  address VARCHAR NOT NULL
);

CREATE TABLE poll_events (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  creator VARCHAR(255) NOT NULL,
  options TEXT[] NOT NULL,
  ticket INTEGER NOT NULL,
  remained_ticket INTEGER NOT NULL,
  image_url VARCHAR(255),
  hash VARCHAR(255)
);

CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  hash VARCHAR(255) NOT NULL,
  r VARCHAR(255) NOT NULL,
  s VARCHAR(255) NOT NULL,
  v INTEGER NOT NULL,
  isIssued BOOLEAN NOT NULL,
  FOREIGN KEY (event_id) REFERENCES poll_events(id) ON DELETE CASCADE
);

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_address VARCHAR(255) NOT NULL,
  token_id INTEGER,
  status VARCHAR(50) NOT NULL CHECK (status IN ('approved', 'rejected', 'inProgress')),
  FOREIGN KEY (event_id) REFERENCES poll_events(id) ON DELETE CASCADE,
  FOREIGN KEY (token_id) REFERENCES tokens(id) ON DELETE SET NULL
);


drop table tokens, applications, poll_events;
drop table users;



insert into users(name, real_id, address) VALUES('Dmon', '12452234','0x49C0c5973487a5b64e284bA2B4750404Af081862');
insert into users(name, real_id, address) VALUES('Kk', '4232234','0x89917Afc5b509a326656c82D73Ae779134F3945b');