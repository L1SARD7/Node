import { Router, Response, NextFunction } from "express"
import { GetGameWithQuerry, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuerry } from "../models/RequestTypes"
import { requestsCounts } from "../app"
import { CreateGameInputModel } from "../models/CreateGameInputModel"
import { GameViewModel } from "../models/GameViewModel"
import { UpdateGameInputModel } from "../models/UpdateGameInputModel"
import { URIParamsIdGame } from "../models/URIParamsIdGame"
import { HTTP_CODES } from "../utility"
import { GamesRepository } from "../repositories/games-repository"
import { bodyGenreValidatorMiddleware, bodyTitleValidatorMiddleware, paramsIdValidatorMiddleware, queryGenreValidatorMiddleware, queryTitleValidatorMiddleware } from "../validator/GamesInputDataValidator"
import { validationResult } from "express-validator"
import { AuthentificateGameAdmin } from "../repositories/authentificator"




export const GamesRouter =  Router({})

const BasicAuthentificator = (req: any, res: any, next: NextFunction) => {
    
    if (!req.headers.authorization) {
    res.set('WWW-Authenticate', 'Basic');
    return res.status(401).send('Unauthorized');
    } else { 
        let isAuthenticated = AuthentificateGameAdmin(req.headers.authorization)
        if (isAuthenticated) {
        next()} 
        else {
            res.set('WWW-Authenticate', 'Basic');
            return res.status(401).send('Wrong login or password');
        }      
    }
}

GamesRouter.get('/', 
    queryTitleValidatorMiddleware,
    queryGenreValidatorMiddleware,
    (req: RequestWithQuerry<GetGameWithQuerry>,
    res: Response) => {

    const validation = validationResult(req)
    if (((req.query.title) && (req.query.genre)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let SortedGames = GamesRepository.GetGames(req.query.title, req.query.genre)
    res.send(SortedGames).status(HTTP_CODES.OK_200)
})
GamesRouter.get('/:id',
    paramsIdValidatorMiddleware,
    (req: RequestWithParams<URIParamsIdGame>,
    res: Response) => {
    const validation = validationResult(req)
    if (!validation.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
        let FoundGame = GamesRepository.GetGameByID(+req.params.id)
    if (FoundGame) {
        res.send(FoundGame).status(HTTP_CODES.OK_200)
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
GamesRouter.delete('/:id',
    BasicAuthentificator, 
    paramsIdValidatorMiddleware,
    (req: RequestWithParams<URIParamsIdGame>, res) => {
    const validation = validationResult(req)
    if (!validation.isEmpty()) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let isDeleted = GamesRepository.DeleteGame(+req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_CODES.Deleted_204)
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
GamesRouter.post('/',
    BasicAuthentificator,
    bodyTitleValidatorMiddleware,
    bodyGenreValidatorMiddleware,
    (req: RequestWithBody<CreateGameInputModel>, res: Response) => {
    const validation = validationResult(req)
    if (((req.query.title) && (req.query.genre)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
        if ((req.body.title) && (req.body.genre)) {
        let CreatedGame = GamesRepository.CreateNewGame(req.body.title, req.body.genre)
        res.status(HTTP_CODES.Created_201).json(CreatedGame)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
GamesRouter.put('/:id',
    BasicAuthentificator, 
    paramsIdValidatorMiddleware,
    bodyTitleValidatorMiddleware,
    bodyGenreValidatorMiddleware,
    (req: RequestWithParamsAndBody<URIParamsIdGame, UpdateGameInputModel>,
    res: Response) => {
    const validation = validationResult(req)
    if (((req.query.title) && (req.query.genre)) && (!validation.isEmpty())) {
        res.status(HTTP_CODES.BAD_REQUEST_400).send({errors: validation.array()})
    }
    let UpdatedGame = GamesRepository.UpdateGame(+req.params.id, req.body.title, req.body.genre)
    if (UpdatedGame) {
        res.send(UpdatedGame).status(HTTP_CODES.OK_200)
    } else
    res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
})