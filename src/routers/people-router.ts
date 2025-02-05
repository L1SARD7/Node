import { Router, Response } from "express";
import { requestsCounts } from "../app";
import { db } from "../db/db";
import { PeopleViewModel } from "../models/PeopleViewModel";
import { RequestWithQuerry, GetPeopleWithQuerry, RequestWithParams, RequestWithBody, RequestWithParamsAndBody } from "../models/RequestTypes";
import { URIParamPeopleName } from "../models/URIParamsPeopleName";
import { HTTP_CODES } from "../utility";


export const PeopleRouter = Router({})

PeopleRouter.get('/', (req: RequestWithQuerry<GetPeopleWithQuerry>,
    res: Response<PeopleViewModel[]>) => {
    //requestsCounts++
    let SortedPeople = db.people
    let CorrectInputOld = true
    if (req.query.name) {
        let SortedSettings = req.query.name.toString()
        SortedPeople = db.people.filter(p => p.name.indexOf(SortedSettings) > -1)
    }
    if (req.query.sex)
        SortedPeople = db.people.filter(p => p.sex === req.query.sex)
    if (req.query.isOld) {
        switch (req.query.isOld) {
            case "true": SortedPeople = db.people.filter(p => p.isOld === true)
                break
            case "false": SortedPeople = db.people.filter(p => p.isOld === false)
                break
            default: CorrectInputOld = false
                break
        }
    }
    if (CorrectInputOld) {
        res.send(SortedPeople).status(HTTP_CODES.OK_200)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
PeopleRouter.delete('/:name', (req: RequestWithParams<URIParamPeopleName>, res) => {
    //requestsCounts++
    let Founded_people = db.people.find(p => p.name === req.params.name)
    if (Founded_people) {
        db.people = db.people.filter(p => p.name !== req.params.name)
        res.sendStatus(HTTP_CODES.Deleted_204)
    }
    else
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
})
PeopleRouter.post('/', (req: RequestWithBody<PeopleViewModel>, res: Response<PeopleViewModel>) => {
    //requestsCounts++
    if (req.body.name && req.body.age && req.body.sex && (req.body.isOld !== undefined)) {
        let AddedPerson = {
            name: req.body.name,
            sex: req.body.sex,
            age: req.body.age,
            isOld: req.body.isOld
        }
        db.people.push(AddedPerson)
        res.status(HTTP_CODES.Created_201).json(AddedPerson)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
PeopleRouter.put('/:name', (req: RequestWithParamsAndBody<URIParamPeopleName, PeopleViewModel>,
    res: Response<PeopleViewModel>) => {
    //requestsCounts++
    let SelectedPerson = db.people.find(p => p.name === req.params.name)
    if ((!SelectedPerson) || (!req.body.name && !req.body.age && !req.body.sex && (req.body.isOld === undefined))) {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
        return
    }
    if (req.body.name) {
        SelectedPerson.name = req.body.name
    } if (req.body.age) {
        SelectedPerson.age = req.body.age
    }
    if (req.body.sex) {
        SelectedPerson.sex = req.body.sex
    }
    if (req.body.isOld !== undefined) {
        SelectedPerson.isOld = req.body.isOld
    }
    res.send(SelectedPerson).status(HTTP_CODES.OK_200)
})