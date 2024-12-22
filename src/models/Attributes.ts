interface keyeble {
    [key: string]: any
}

export class Attributes<T extends keyeble> {
    constructor(private data: T) { }

    get = <K extends keyof T>(key: K): T[K] => {
        return this.data[key]
    }

    set(update: T): void {
        Object.assign(this.data, update)
    }

    GetAll(): T {
        return this.data
    }
}