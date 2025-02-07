import { Router, Response } from "express";
import { requestsCounts } from "../app";
import { db } from "../db/db";
import { PeopleViewModel } from "../models/PeopleViewModel";
import { RequestWithQuerry, GetPeopleWithQuerry, RequestWithParams, RequestWithBody, RequestWithParamsAndBody } from "../models/RequestTypes";
import { URIParamPeopleName } from "../models/URIParamsPeopleName";
import { HTTP_CODES } from "../utility";
import { PeopleRepository } from "../repositories/people-repository";
import { bodyAgePeopleValidator, bodyIsOldPeopleValidator, bodyNamePeopleValidator, bodySexPeopleValidator, paramsNamePeopleValidator, querryAgePeopleValidator, querryNamePeopleValidator, querryOldPeopleValidator, querrySexPeopleValidator } from "../validator/PeopleInputDataValidator";
import { validationResult } from "express-validator";

export const PeopleRouter = Router({})

PeopleRouter.get('/',
    querryNamePeopleValidator,
    querrySexPeopleValidator,
    querryAgePeopleValidator,
    querryOldPeopleValidator, (req: RequestWithQuerry<GetPeopleWithQuerry>,
    res: Response) => {
    const validation = validationResult(req)
    if ((req.query.name && req.query.sex && req.query.age && (req.query.isOld !== undefined)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let SortedPeople = PeopleRepository.GetPeople(req.query.name, req.query.sex, +req.query.age, req.query.isOld)
    if (SortedPeople !== false) {
        res.send(SortedPeople).status(HTTP_CODES.OK_200)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
PeopleRouter.delete('/:name', 
    paramsNamePeopleValidator,
    (req: RequestWithParams<URIParamPeopleName>, res) => {
    const validation = validationResult(req)
    if ((req.query.name && req.query.sex && req.query.age && (req.query.isOld !== undefined)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
        let Deleted = PeopleRepository.DeletePeople(req.params.name)
    if (Deleted)
        res.sendStatus(HTTP_CODES.Deleted_204)
    else
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
})
PeopleRouter.post('/',
    bodyNamePeopleValidator,
    bodySexPeopleValidator,
    bodyAgePeopleValidator,
    bodyIsOldPeopleValidator, (req: RequestWithBody<PeopleViewModel>, res: Response) => {
    const validation = validationResult(req)
    if(validation.isEmpty()){
        let AddedPerson = PeopleRepository.CreateNewPerson(req.body.name, req.body.sex, req.body.age, req.body.isOld)
        res.status(HTTP_CODES.Created_201).json(AddedPerson)
    } else {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
})
PeopleRouter.put('/:name', 
    paramsNamePeopleValidator, 
    bodyNamePeopleValidator,
    bodySexPeopleValidator,
    bodyAgePeopleValidator,
    bodyIsOldPeopleValidator,
    (req: RequestWithParamsAndBody<URIParamPeopleName, PeopleViewModel>,
    res: Response) => {
    const validation = validationResult(req)
    if ((req.query.name && req.query.sex && req.query.age && (req.query.isOld !== undefined)) && !validation.isEmpty())
        res.send({errors: validation.array()}).status(HTTP_CODES.BAD_REQUEST_400)
        let SelectedPerson = PeopleRepository.UpdatePerson(req.params.name, req.body.name, req.body.sex, req.body.age, req.body.isOld)
    if (SelectedPerson === false) {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    } else
    res.send(SelectedPerson).status(HTTP_CODES.OK_200)
})