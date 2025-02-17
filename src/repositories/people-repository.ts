import { db } from "../db/db"


export const PeopleRepository = {
    async GetPeople(name: string, sex: string, age: number, isOld: string) {
        let CorrectInputOld = true
        let SortedPeople = db.people
            if (name) {
                SortedPeople = db.people.filter(p => p.name.indexOf(name) > -1)
            }
            if (sex)
                SortedPeople = SortedPeople.filter(p => p.sex === sex)
            if (age)
                SortedPeople = SortedPeople.filter(p => p.age === age)
            if (isOld) {
                switch (isOld) {
                    case "true": SortedPeople = SortedPeople.filter(p => p.isOld === true)
                        break
                    case "false": SortedPeople = SortedPeople.filter(p => p.isOld === false)
                        break
                    default: CorrectInputOld = false
                        break
                }
            }
        if (CorrectInputOld) {
            return(SortedPeople)
        } else {
            return false
        }
    },

    async DeletePeople (name: string) {
        let Founded_people = db.people.find(p => p.name === name)
            if (Founded_people) {
                db.people = db.people.filter(p => p.name !== name)
                return true
            }
            else
                return false
    },

    async CreateNewPerson (name: string, sex: string, age: number, isOld: boolean) {
                let AddedPerson = {
                    name: name,
                    sex: sex,
                    age: age,
                    isOld: isOld
                }
                db.people.push(AddedPerson)
                return AddedPerson
    },

    async UpdatePerson (OldName: string, NewName: string, sex: string, age: number, isOld: boolean) {
    let SelectedPerson = db.people.find(p => p.name === OldName)
        if ((!SelectedPerson) || (!NewName && !age && !sex && (isOld === undefined))) {
            return false
        }
        if (NewName) {
            SelectedPerson.name = NewName
        } if (age) {
            SelectedPerson.age = age
        }
        if (sex) {
            SelectedPerson.sex = sex
        }
        if (isOld !== undefined) {
            SelectedPerson.isOld = isOld
        }
        return SelectedPerson    
    }
}