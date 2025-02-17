import { MongoClient } from "mongodb"
import { GameViewModel } from "../models/GameViewModel"
import { PeopleViewModel } from "../models/PeopleViewModel"
import { UserViewModule } from "../models/UserViewModule"


export type DB_Type = {
    games: GameViewModel[]
    people: PeopleViewModel[]
    admins: UserViewModule
}
export let db: DB_Type = {
    games: [
        { id: 1, title: "civilization 5", genre: "Strategy" },
        { id: 2, title: "civilization 6", genre: "Strategy" },
        { id: 3, title: "Fifa", genre: "Sport" }
    ],
    people: [
        { name: "Artem", sex: "male", age: 19, isOld: true },
        { name: "Volodymyr", sex: "male", age: 19, isOld: false },
        { name: "Nastia", sex: "female", age: 18, isOld: true }
    ],
    admins: {
        gameAdmin: [ {login: 'admin', password: 'qwerty'} ],
        peopleAdmin: [ {login: 'admin1', password: 'qwerty1234'},
            {login: 'Artem', password: 'fhnmjv'}
         ]
    }
}

const MongoURI = process.env.MongoURI || "mongodb://0.0.0.0:27017"

export const client = new MongoClient(MongoURI)

export async function runDB() {
    try {
        await client.connect();
        await client.db('metacritic').command({ping: 1})
        console.log('Conecting to Mongo DataBase completed')
    }
    catch {
        await client.close()
    }
}