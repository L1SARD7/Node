import { Router, Response } from "express";
import { requestsCounts } from "../app";
import { db } from "../db/db";
import { PeopleViewModel } from "../models/PeopleViewModel";
import { RequestWithQuerry, GetPeopleWithQuerry, RequestWithParams, RequestWithBody, RequestWithParamsAndBody } from "../models/RequestTypes";
import { URIParamPeopleName } from "../models/URIParamsPeopleName";
import { HTTP_CODES } from "../utility";
import { PeopleRepository } from "../repositories/people-repository";


export const PeopleRouter = Router({})

PeopleRouter.get('/', (req: RequestWithQuerry<GetPeopleWithQuerry>,
    res: Response<PeopleViewModel[]>) => {
    //requestsCounts++
    let SortedPeople = PeopleRepository.GetPeople(req.query.name, req.query.sex, +req.query.age, req.query.isOld)
    if (SortedPeople !== false) {
        res.send(SortedPeople).status(HTTP_CODES.OK_200)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
PeopleRouter.delete('/:name', (req: RequestWithParams<URIParamPeopleName>, res) => {
    //requestsCounts++
    let Deleted = PeopleRepository.DeletePeople(req.params.name)
    if (Deleted)
        res.sendStatus(HTTP_CODES.Deleted_204)
    else
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
})
PeopleRouter.post('/', (req: RequestWithBody<PeopleViewModel>, res: Response<PeopleViewModel>) => {
    //requestsCounts++
    if (req.body.name && req.body.age && req.body.sex && (req.body.isOld !== undefined)) {
        let AddedPerson = PeopleRepository.CreateNewPerson(req.body.name, req.body.sex, req.body.age, req.body.isOld)
        res.status(HTTP_CODES.Created_201).json(AddedPerson)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
PeopleRouter.put('/:name', (req: RequestWithParamsAndBody<URIParamPeopleName, PeopleViewModel>,
    res: Response<PeopleViewModel>) => {
    //requestsCounts++
    let SelectedPerson = PeopleRepository.UpdatePerson(req.params.name, req.body.name, req.body.sex, req.body.age, req.body.isOld)
    if (SelectedPerson === false) {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    } else
    res.send(SelectedPerson).status(HTTP_CODES.OK_200)
})