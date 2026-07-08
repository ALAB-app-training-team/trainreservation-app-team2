export type GuestLoginError = {
    reserverName: string;
    reserverMail: string;
    searchReservation: string;
};

export type GuestLoginErrorKey = keyof GuestLoginError;
