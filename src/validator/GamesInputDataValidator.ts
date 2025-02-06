import { param, query, body, validationResult } from "express-validator";
import { HTTP_CODES } from "../utility";


export const queryTitleValidatorMiddleware = query('title').trim().isLength({min: 3, max: 15}).withMessage('Title should be from 3 to 15 letters. Enter another title or dont use Title in your search.') 
export const queryGenreValidatorMiddleware = query('genre').trim().isLength({min: 3, max: 15}).withMessage('Genre should be from 3 to 15 letters. Enter another title or dont use Title in your search.') 
export const paramsIdValidatorMiddleware = param('id').trim().isNumeric().withMessage('Title should be from 3 to 15 letters.')
export const bodyTitleValidatorMiddleware = body('title').trim().isLength({min: 3, max: 15}).withMessage('Title should be from 3 to 15 letters.')
export const bodyGenreValidatorMiddleware = body('genre').trim().isLength({min: 3, max: 15}).withMessage('Genre should be from 3 to 15 letters.')
