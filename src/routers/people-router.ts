import { Router, Response, NextFunction } from "express";
import { PeopleViewModel } from "../models/PeopleViewModel";
import { RequestWithQuerry, GetPeopleWithQuerry, RequestWithParams, RequestWithBody, RequestWithParamsAndBody } from "../models/RequestTypes";
import { URIParamPeopleName } from "../models/URIParamsPeopleName";
import { HTTP_CODES } from "../utility";
import { PeopleRepository } from "../repositories/people-repository";
import { bodyAgePeopleValidator, bodyIsOldPeopleValidator, bodyNamePeopleValidator, bodySexPeopleValidator, paramsNamePeopleValidator, querryAgePeopleValidator, querryNamePeopleValidator, querryOldPeopleValidator, querrySexPeopleValidator } from "../validator/PeopleInputDataValidator";
import { validationResult } from "express-validator";
import { AuthentificatePeopleAdmin } from "../repositories/authentificator";

export const PeopleRouter = Router({})

const BasicAuthentificator = (req: any, res: any, next: NextFunction) => {
    
    if (!req.headers.authorization) {
    res.set('WWW-Authenticate', 'Basic');
    return res.status(401).send('Unauthorized');
    } else { 
        let isAuthenticated = AuthentificatePeopleAdmin(req.headers.authorization)
        if (isAuthenticated) {
        next()} 
        else {
            res.set('WWW-Authenticate', 'Basic');
            return res.status(401).send('Wrong login or password');
        }      
    }
}

PeopleRouter.get('/',
    querryNamePeopleValidator,
    querrySexPeopleValidator,
    querryAgePeopleValidator,
    querryOldPeopleValidator, async (req: RequestWithQuerry<GetPeopleWithQuerry>,
    res: Response) => {
    const validation = validationResult(req)
    if ((req.query.name && req.query.sex && req.query.age && (req.query.isOld !== undefined)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let SortedPeople = await PeopleRepository.GetPeople(req.query.name, req.query.sex, +req.query.age, req.query.isOld)
    if (SortedPeople !== false) {
        res.send(SortedPeople).status(HTTP_CODES.OK_200)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
PeopleRouter.delete('/:name',
    BasicAuthentificator, 
    paramsNamePeopleValidator,
    async (req: RequestWithParams<URIParamPeopleName>, res) => {
    const validation = validationResult(req)
    if ((req.query.name && req.query.sex && req.query.age && (req.query.isOld !== undefined)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
        let Deleted = await PeopleRepository.DeletePeople(req.params.name)
    if (Deleted)
        res.sendStatus(HTTP_CODES.Deleted_204)
    else
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
})
PeopleRouter.post('/',
    BasicAuthentificator,
    bodyNamePeopleValidator,
    bodySexPeopleValidator,
    bodyAgePeopleValidator,
    bodyIsOldPeopleValidator, 
    async (req: RequestWithBody<PeopleViewModel>, res: Response) => {
    const validation = validationResult(req)
    if(validation.isEmpty()){
        let AddedPerson = await PeopleRepository.CreateNewPerson(req.body.name, req.body.sex, req.body.age, req.body.isOld)
        res.status(HTTP_CODES.Created_201).json(AddedPerson)
    } else {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
})
PeopleRouter.put('/:name',
    BasicAuthentificator, 
    paramsNamePeopleValidator, 
    bodyNamePeopleValidator,
    bodySexPeopleValidator,
    bodyAgePeopleValidator,
    bodyIsOldPeopleValidator,
    async (req: RequestWithParamsAndBody<URIParamPeopleName, PeopleViewModel>,
    res: Response) => {
    const validation = validationResult(req)
    if ((req.query.name && req.query.sex && req.query.age && (req.query.isOld !== undefined)) && !validation.isEmpty())
        res.send({errors: validation.array()}).status(HTTP_CODES.BAD_REQUEST_400)
        let SelectedPerson = await PeopleRepository.UpdatePerson(req.params.name, req.body.name, req.body.sex, req.body.age, req.body.isOld)
    if (SelectedPerson === false) {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    } else
    res.send(SelectedPerson).status(HTTP_CODES.OK_200)
})