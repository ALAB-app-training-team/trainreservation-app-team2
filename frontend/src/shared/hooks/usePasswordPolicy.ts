import { checkPasswordRegex } from '@/shared/utils/CheckPasswordRegex';

export function usePasswordPolicy() {
    const getPasswordPolicy = (value: string) => ({
        isBetweenLength: value.length >= 8 && value.length <= 64,
        hasNumber: /[0-9]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        isValid: checkPasswordRegex(value),
    });

    return { getPasswordPolicy };
}
