import { IMessage } from "./messaging/i-message";

export class LoadApplicationCommand implements IMessage {
    public ID = 'Application.Load';
}
