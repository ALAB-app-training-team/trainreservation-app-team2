CREATE TABLE T_Account
(
    id        UUID DEFAULT gen_random_uuid(),
    name      VARCHAR(255) NOT NULL,
    mail      VARCHAR(255) NOT NULL,
    password  VARCHAR(255) NOT NULL,
    pay_token VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
