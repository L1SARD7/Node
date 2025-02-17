import express from 'express'
import { title } from 'process'
import { Request } from 'express'
import { app } from './app'
import { runDB } from './db/db'



let PORT = process.env.PORT || 1235
const StartAPI = async () => {
    runDB()
    app.listen(PORT, () => {
        console.log('Server started!')
    })
}

StartAPI()