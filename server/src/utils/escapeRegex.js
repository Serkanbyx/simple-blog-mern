/**
 * Escapes special RegExp characters in a string to prevent
 * ReDoS attacks when the string is used inside MongoDB $regex.
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = escapeRegex;
