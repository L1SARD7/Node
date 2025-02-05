import express from 'express'
import { title } from 'process'
import { Request } from 'express'
import { app } from './app'



let PORT = 1235

app.listen(PORT, () => {
    console.log('Server started!')
})