import { IMessage } from "./i-message";

export interface IMessenger {
    Send<T extends IMessage>(message: T);
    Receive<T extends IMessage>(messageID: string, handler: (message: T) => void);
    Request<T extends IMessage, J extends IMessage>(message: T): J;
    HandleRequest<T extends IMessage, J extends IMessage>(messageID: string, handler: (message: T) => J);
}
