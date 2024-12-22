import { Model, HasId } from "../models/Model"

export abstract class View<T extends Model<K>, K extends HasId> {
    regions: { [key: string]: Element } = {}

    constructor(public parent: Element, public model: T) {
        this.bindModel()
    }

    bindModel(): void {
        this.model.on('change', () => {
            this.render()
        })
    }

    abstract template(): string

    regionsMap(): { [key: string]: string } { return {} }

    eventsMap(): { [key: string]: () => void } { return {} }

    bindEvents(fragment: DocumentFragment): void {
        const eventsMap = this.eventsMap()
        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(':')
            fragment.querySelectorAll(selector).forEach((elem) => {
                elem.addEventListener(eventName, eventsMap[eventKey])
            })
        }
    }
    
    mapRegions(fragment: DocumentFragment) : void {
        const regionsMap = this.regionsMap()
        for (const key in regionsMap) {
            const selector = regionsMap[key]
            const elem = fragment.querySelector(selector)
            if (!!elem === true) {
                this.regions[key] = elem
            }
        }
    }

    onRender(): void { }

    render(): void {
        this.parent.innerHTML = ''
        const templateElement = document.createElement('template')
        templateElement.innerHTML = this.template()
        this.bindEvents(templateElement.content)
        this.mapRegions(templateElement.content)

        this.onRender()

        this.parent.append(templateElement.content)
    }
}