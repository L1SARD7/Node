import { db } from "../db/db"

export const GamesRepository = {
    GetGames (title: string | null, genre: string | null) {
        let SortedGames = db.games
            if (title) {
                SortedGames = db.games.filter(g => g.title.indexOf(title) > -1)
            }
            if (genre) {
                SortedGames = db.games.filter(g => g.genre === genre)
            }
        return SortedGames
    },

    GetGameByID (id: number) {
        let FoundGame = db.games.find(g => g.id === id)
        return FoundGame
    },

    DeleteGame (id: number) {
        let DeletedGame = db.games.find(g => g.id === id)
            if (DeletedGame) {
                db.games = db.games.filter(g => g.id !== id)
                return true
            }
            else {
                return false
            }
    },

    CreateNewGame (title: string, genre: string) {
        let CreatedGame = {
            id: +(new Date()),
            title: title,
            genre: genre
        }
        db.games.push(CreatedGame)
        return CreatedGame
    },

    UpdateGame (id: number, title: string | null, genre: string | null) {
        let UpdatedGame = db.games.find(g => g.id === id)
        if ((!UpdatedGame) || (!title && !genre)) {
                return null
            }
            if (title) {
                UpdatedGame.title = title
            } if (genre) {
                UpdatedGame.genre = genre
            }
            return UpdatedGame
    }
}