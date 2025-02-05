import { Router } from "express";
import { db } from "../db/db";
import { HTTP_CODES } from "../utility";


export const TestsRouter = Router({})

TestsRouter.delete('/data', (req, res) => {
    db.games = []
    db.people = []
    res.sendStatus(HTTP_CODES.OK_200)
})