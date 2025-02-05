import { Router, Response } from "express"
import { GetGameWithQuerry, RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuerry } from "../models/RequestTypes"
import { requestsCounts } from "../app"
import { CreateGameInputModel } from "../models/CreateGameInputModel"
import { GameViewModel } from "../models/GameViewModel"
import { UpdateGameInputModel } from "../models/UpdateGameInputModel"
import { URIParamsIdGame } from "../models/URIParamsIdGame"
import { HTTP_CODES } from "../utility"
import { GamesRepository } from "../repositories/games-repository"



export const GamesRouter =  Router({})

GamesRouter.get('/', (req: RequestWithQuerry<GetGameWithQuerry>,
    res: Response<GameViewModel[]>) => {
    //requestsCounts++
    let SortedGames = GamesRepository.GetGames(req.query.title, req.query.genre)
    res.send(SortedGames).status(HTTP_CODES.OK_200)
})
GamesRouter.get('/:id', (req: RequestWithParams<URIParamsIdGame>,
    res: Response<GameViewModel>) => {
    //requestsCounts++
    let FoundGame = GamesRepository.GetGameByID(+req.params.id)
    if (FoundGame) {
        res.send(FoundGame).status(HTTP_CODES.OK_200)
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
GamesRouter.delete('/:id', (req: RequestWithParams<URIParamsIdGame>, res) => {
    //requestsCounts++
    let isDeleted = GamesRepository.DeleteGame(+req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_CODES.Deleted_204)
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
GamesRouter.post('/', (req: RequestWithBody<CreateGameInputModel>, res: Response<GameViewModel>) => {
    //requestsCounts++
    if ((req.body.title) && (req.body.genre)) {
        let CreatedGame = GamesRepository.CreateNewGame(req.body.title, req.body.genre)
        res.status(HTTP_CODES.Created_201).json(CreatedGame)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
GamesRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsIdGame, UpdateGameInputModel>,
    res: Response<GameViewModel>) => {
    //requestsCounts++
    let UpdatedGame = GamesRepository.UpdateGame(+req.params.id, req.body.title, req.body.genre)
    if (UpdatedGame) {
        res.send(UpdatedGame).status(HTTP_CODES.OK_200)
    } else
    res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
})