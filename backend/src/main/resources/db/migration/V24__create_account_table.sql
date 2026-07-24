CREATE TABLE T_Account
(
    id       UUID         NOT NULL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    mail     VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (mail)
);
