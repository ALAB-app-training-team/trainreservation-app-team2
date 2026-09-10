CREATE TABLE T_Account
(
    id       UUID         NOT NULL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    mail     VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (mail)
);

INSERT INTO T_Account (id, name, mail, password)
VALUES ('11111111-1111-1111-1111-111111111111', 'テスト太郎', 'test-account-a@test.com', 'password'),
       ('22222222-2222-2222-2222-222222222222', 'テスト花子', 'test-account-b@test.com', 'password');
