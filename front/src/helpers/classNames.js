/**
 * A simple utility to conditionally join class names together.
 * @param {...(string|boolean|null|undefined)} args - Class names or conditions.
 * @returns {string} A string of space-separated class names.
 */
export const cx = (...args) => args.filter(Boolean).join(' ');
