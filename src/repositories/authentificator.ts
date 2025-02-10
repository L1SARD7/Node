//import base64 from "base-64"

import { db } from "../db/db"

export function AuthentificateGameAdmin (codedInfo: string) {
    let base64 = codedInfo.trim().replace('Basic', '')
    let encodedData = new Buffer(base64, 'base64')
    let [ login, password] = encodedData.toString().split(':')
    let account = db.admins.gameAdmin.find(g => g.login === login)
    if (account && password === account.password)
    return true
    else false
}   