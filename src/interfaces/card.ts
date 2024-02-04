import { Message } from "./Message";

export interface Card {
    title: string,
    img: string,
    author: string,
    date: string,
    description: string,
    comments: Message[]
}