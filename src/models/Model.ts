import { AxiosPromise, AxiosResponse } from 'axios'

interface ModelAttributes<T> {
    get<K extends keyof T>(key: K): T[K]
    set(value: T): void
    GetAll(): T
}

interface Sync<T> {
    fetch(id: number): AxiosPromise
    save(data: T): AxiosPromise
}

interface Events {
    on(eventName: string, callback: () => void): void
    trigger(eventName: string): void
}

export interface HasId {
    id?: number;
}


export class Model<T extends HasId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>
    ) {}

    on = this.events.on
    trigger = this.events.trigger
    get = this.attributes.get;

   
    set(update: T): void {
        this.attributes.set(update)
        this.events.trigger('change')
    }

    fetch(): void {
        const id = this.attributes.get('id')
        if (typeof id !== 'number') {
            throw new Error("cannot fetch without id")
        }

        this.sync.fetch(id).then((response: AxiosResponse): void => {
            this.set(response.data)
        })
    }

    save(): void {
        this.sync.save(this.attributes.GetAll())
        .then((responce: AxiosResponse): void => {
            this.trigger('save')
        })
        .catch(() => {
            this.trigger('error')
        })
    }

}