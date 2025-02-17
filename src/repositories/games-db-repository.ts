import { title } from "process"
import { client, db } from "../db/db"
import { GameViewModel } from "../models/GameViewModel"

export const GamesRepository = {
    async GetGames (title: string | null, genre: string | null) {
        let filter: any = {}    
        if (title) {
            filter.title = title
        }
        if (genre) {
            filter.genre = genre
        }
        let SortedGames = await client.db("metacritic").collection("games").find(filter).toArray()
        return SortedGames
    },

    async GetGameByID (id: number) {
        let FoundGame = await client.db("metacritic").collection("games").find({id: id}).toArray()
        return FoundGame
    },

    async DeleteGame (id: number) {
        let result = await client.db("metacritic").collection("games").deleteOne({id: id})
        return result.deletedCount === 1    
    },

    async CreateNewGame (title: string, genre: string) : Promise<GameViewModel> {
        let CreatedGame = {
            id: +(new Date()),
            title: title,
            genre: genre
        }
        await client.db("metacritic").collection("games").insertOne(CreatedGame)
        return CreatedGame
    },

    async UpdateGame (id: number, title: string | null, genre: string | null) {
        
        let new_data: any = {}
        if (title) {
            new_data.title = title
        } if (genre) {
            new_data.genre = genre
        }
        let result = await client.db("metacritic").collection("games").updateOne({id: id}, {$set : new_data})
        if (result.modifiedCount === 1) {
            return await client.db("metacritic").collection("games").findOne({id: id})
        }
        return null
    }
}