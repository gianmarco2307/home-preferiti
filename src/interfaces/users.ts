import { Card } from "./card"

export interface Users {
    [key: string]: {
        favorites: string[]
    }
}