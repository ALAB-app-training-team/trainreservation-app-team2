CREATE TABLE T_Account
(
    id       UUID         NOT NULL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    mail     VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (mail)
);

INSERT INTO T_Account(id, name, mail, password)
VALUES ('c1d61acd-2e46-4d55-b026-ee1d4dbcb5ce', '一般太郎', 'test-common@test.com', '$2a$10$mhjFweW.YlrIUcc4LhhQE.gWbJLIm5qyLCmHnVgSUKoWnGiS8tJN2');
