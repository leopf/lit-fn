export type EventManagerHandler = (data: any) => void;

export class EventManager {
    private handlers: Map<string, EventManagerHandler[]> = new Map();

    public on(event: string, handler: (msg: any) => void) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event)!.push(handler);
    }
    protected innerEmit(event: string, msg: any) {
        (this.handlers.get(event) || []).forEach(h => h.call(null, msg));
    }
}