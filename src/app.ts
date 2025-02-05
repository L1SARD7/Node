import express, { Response } from 'express';
import { CreateGameInputModel } from './models/CreateGameInputModel';
import { GameViewModel } from './models/GameViewModel';
import { PeopleViewModel } from './models/PeopleViewModel';
import { RequestWithQuerry, GetGameWithQuerry, RequestWithParams, RequestWithBody, RequestWithParamsAndBody, GetPeopleWithQuerry } from './models/RequestTypes';
import { UpdateGameInputModel } from './models/UpdateGameInputModel';
import { URIParamsIdGame } from './models/URIParamsIdGame';
import { URIParamPeopleName } from './models/URIParamsPeopleName';
import { HTTP_CODES } from './utility';

export let requestsCounts = 0
export const app = express()

type DB_Type = {
    games: GameViewModel[]
    people: PeopleViewModel[]
}
let db: DB_Type = {
    games: [
        { id: 1, title: "civilization 5", genre: "Strategy" },
        { id: 2, title: "civilization 6", genre: "Strategy" },
        { id: 3, title: "Fifa", genre: "Sport" }
    ],
    people: [
        { name: "Artem", sex: "male", age: 19, isOld: true },
        { name: "Volodymyr", sex: "male", age: 19, isOld: false },
        { name: "Nastia", sex: "female", age: 18, isOld: true }
    ]
}
let BodyJsonMiddleware = express.json()
app.use(BodyJsonMiddleware)
app.get('/', (req, res) => {
    requestsCounts++
    res.send('Oh shiiiit, here we go again')
})
app.get('/games', (req: RequestWithQuerry<GetGameWithQuerry>,
    res: Response<GameViewModel[]>) => {
    requestsCounts++
    let SortedGames = db.games
    if (req.query.title) {
        let SortedSettings = req.query.title.toString()
        SortedGames = db.games.filter(g => g.title.indexOf(SortedSettings) > -1)
    }
    if (req.query.genre)
        SortedGames = db.games.filter(g => g.genre === req.query.genre)
    res.send(SortedGames).status(HTTP_CODES.OK_200)
})
app.get('/games/:id', (req: RequestWithParams<URIParamsIdGame>,
    res: Response<GameViewModel>) => {
    requestsCounts++
    let FoundGame = db.games.find(g => g.id === +req.params.id)
    if (FoundGame) {
        res.send(FoundGame).status(HTTP_CODES.OK_200)
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
app.delete('/games/:id', (req: RequestWithParams<URIParamsIdGame>, res) => {
    requestsCounts++
    let DeletedGame = db.games.find(g => g.id === +req.params.id)
    if (DeletedGame) {
        db.games = db.games.filter(g => g.id !== +req.params.id)
        res.sendStatus(HTTP_CODES.Deleted_204)
    }
    else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
app.post('/games', (req: RequestWithBody<CreateGameInputModel>, res: Response<GameViewModel>) => {
    requestsCounts++
    if ((req.body.title) && (req.body.genre)) {
        let CreatedGame = {
            id: +(new Date()),
            title: req.body.title,
            genre: req.body.genre
        }
        db.games.push(CreatedGame)
        res.status(HTTP_CODES.Created_201).json(CreatedGame)
    } else {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
    }
})
app.put('/games/:id', (req: RequestWithParamsAndBody<URIParamsIdGame, UpdateGameInputModel>,
    res: Response<GameViewModel>) => {
    requestsCounts++
    let SelectedGame = db.games.find(g => g.id === Number(req.params.id))
    if ((!SelectedGame) || (!req.body.title && !req.body.genre)) {
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
        return
    }
    if (req.body.title) {
        SelectedGame.title = req.body.title
    } if (req.body.genre) {
        SelectedGame.genre = req.body.genre
    }
    res.send(SelectedGame).status(HTTP_CODES.OK_200)
})
app.get('/people', (req: RequestWithQuerry<GetPeopleWithQuerry>,
    res: Response<PeopleViewModel[]>) => {
    requestsCounts++
    let CorrectInputOld = true
    let SortedPeople = db.people
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
app.delete('/people/:name', (req: RequestWithParams<URIParamPeopleName>, res) => {
    requestsCounts++
    let Founded_people = db.people.find(p => p.name === req.params.name)
    if (Founded_people) {
        db.people = db.people.filter(p => p.name !== req.params.name)
        res.sendStatus(HTTP_CODES.Deleted_204)
    }
    else
        res.sendStatus(HTTP_CODES.BAD_REQUEST_400)
})
app.post('/people', (req: RequestWithBody<PeopleViewModel>, res: Response<PeopleViewModel>) => {
    requestsCounts++
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
app.put('/people/:name', (req: RequestWithParamsAndBody<URIParamPeopleName, PeopleViewModel>,
    res: Response<PeopleViewModel>) => {
    requestsCounts++
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
app.get('/count', (req, res) => {
    requestsCounts++
    res.send('Count of requests: ' + requestsCounts).status(401)
})
app.delete('/__test__/data', (req, res) => {
    db.games = []
    db.people = []
    res.sendStatus(HTTP_CODES.OK_200)
})
