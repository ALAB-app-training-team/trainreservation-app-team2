ALTER TABLE T_account
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER';

INSERT INTO T_Account(id, name, mail, password, role)
VALUES ('d2cdf717-a35c-48d9-828e-0ce86e01d477',
        '管理者',
        'test-admin@test.com',
        '$2a$10$mhjFweW.YlrIUcc4LhhQE.gWbJLIm5qyLCmHnVgSUKoWnGiS8tJN2',
        'ROLE_ADMIN');
