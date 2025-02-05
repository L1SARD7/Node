import { GameViewModel } from "../models/GameViewModel"
import { PeopleViewModel } from "../models/PeopleViewModel"


export type DB_Type = {
    games: GameViewModel[]
    people: PeopleViewModel[]
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
    ]
}