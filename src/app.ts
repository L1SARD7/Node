import express, { NextFunction, Response, Request } from 'express';
import { GamesRouter } from './routers/game-router';
import { PeopleRouter } from './routers/people-router';
import { TestsRouter } from './routers/tests-router';
export let requestsCounts = 0
export const app = express()

let BodyJsonMiddleware = express.json()
app.use(BodyJsonMiddleware)

const CountOfRequestsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    requestsCounts++;    
    next();
}

app.use(CountOfRequestsMiddleware)

app.get('/', (req, res) => {
    requestsCounts++
    res.send('Oh shiiiit, here we go again')
})

app.use('/games', GamesRouter)

app.use('/people', PeopleRouter)

app.use('/__test__', TestsRouter)

app.get('/count', (req, res) => {
    res.send('Count of requests: ' + requestsCounts).status(401)
})


