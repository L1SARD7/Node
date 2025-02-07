import exp from "constants";
import { param, query, body } from "express-validator";


export const querryNamePeopleValidator = query('name').trim().isLength({min: 2, max: 15}).withMessage('Length of name must be from 2 to 15 letters. Plese enter wrigh name or delete this parametr.')
export const querrySexPeopleValidator = query('sex').trim().isLength({min: 4, max: 6}).withMessage('Length of name must be from 2 to 15 letters. Plese enter wrigh name or delete this parametr.')
export const querryAgePeopleValidator = query('age').trim().isNumeric().isLength({min: 1, max: 3}).withMessage('Length of name must be from 2 to 15 letters. Plese enter wrigh name or delete this parametr.')
export const querryOldPeopleValidator = query('isOld').trim().isBoolean().withMessage('Length of name must be from 2 to 15 letters. Plese enter wright name or delete this parametr.')
export const paramsNamePeopleValidator = param('name').trim().isLength({min: 2, max: 15}).withMessage('Length of name must be from 2 to 15 letters. Plese enter wright name')

//body
export const bodyNamePeopleValidator = body('name').trim().isLength({min: 2, max: 15}).withMessage('Length of name must be from 2 to 15 letters. Plese enter wright name')
export const bodySexPeopleValidator = body('sex').trim().isLength({min: 4, max: 6}).withMessage('Invalid. Plese enter wright')
export const bodyAgePeopleValidator = body('age').trim().isNumeric().withMessage('Invalid age input. Plese enter wright age.')
export const bodyIsOldPeopleValidator = body('isOld').isBoolean().withMessage('Invalid isOld. Please enter true or false.')
