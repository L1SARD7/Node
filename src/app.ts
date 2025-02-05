import express, { Response } from 'express';
import { GamesRouter } from './routers/game-router';
import { PeopleRouter } from './routers/people-router';
import { TestsRouter } from './routers/tests-router';
export let requestsCounts = 0
export const app = express()

let BodyJsonMiddleware = express.json()
app.use(BodyJsonMiddleware)
app.get('/', (req, res) => {
    requestsCounts++
    res.send('Oh shiiiit, here we go again')
})

app.use('/games', GamesRouter)

app.use('/people', PeopleRouter)

app.use('/__test__', TestsRouter)

app.get('/count', (req, res) => {
    requestsCounts++
    res.send('Count of requests: ' + requestsCounts).status(401)
})


