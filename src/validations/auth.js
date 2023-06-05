import { body } from "express-validator";

export const registerValidation = [
    body('fullName','wrong format of name').isLength({min:1}),
];

export const loginValidation = [
    body('fullName','wrong format of name').isLength({min:1}),
];