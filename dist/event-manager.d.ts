export declare type EventManagerHandler = (data: any) => void;
export declare class EventManager {
    private handlers;
    on(event: string, handler: (msg: any) => void): void;
    protected innerEmit(event: string, msg: any): void;
}
