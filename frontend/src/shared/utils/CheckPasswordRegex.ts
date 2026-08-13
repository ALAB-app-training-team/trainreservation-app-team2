export const checkPasswordRegex = (value: string) => {
    return /^[-A-Za-z0-9'!"#$%&(),./:;?@[\]^_^`{}~+<=>*]*$/.test(value);
};
