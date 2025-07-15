import { customAlphabet } from "nanoid";


const simpleAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const simpleUpperCaseAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const complexAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&~#{[|^@]},;:!?./§*$µ£%(-_)=+";

export const generatePublicCheckoutId = () => customAlphabet(simpleAlphabet, 12)();
export const generateSecretCheckoutId = () => customAlphabet(complexAlphabet, 25)();
export const generateUnverifiedUserId = () => customAlphabet(complexAlphabet, 10)();
export const generateComplexVerificationCode = () => customAlphabet(complexAlphabet, 15)();
export const generateSimpleVerificationCode = () => customAlphabet(simpleUpperCaseAlphabet, 8)();
export const generateCoupon = (codeLength: number) => customAlphabet(simpleUpperCaseAlphabet, codeLength)();
export const generateRedeemCode = () => `${customAlphabet(simpleUpperCaseAlphabet, 5)()}-${customAlphabet(simpleUpperCaseAlphabet, 5)()}-${customAlphabet(simpleUpperCaseAlphabet, 5)()}-${customAlphabet(simpleUpperCaseAlphabet, 5)()}-${customAlphabet(simpleUpperCaseAlphabet, 5)()}`;
export const generateInvoiceRef = () => customAlphabet("0123456789", 8)();
