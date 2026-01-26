export {
    declare module 'Event' {
        export interface Event {
            id: string
            header?: string
            title: string
            subtitle?: string
            date: Date | string
            parsedDate: Date 
            price?: string
            venue: string
            doorsTime: string
            showTime: string    
            age?: string
            genre?: string
            image?: string
            support?: string
            headliners?:string
            url?: url
            day?:string
            month?:string
            description?:string
        }
    }
}
