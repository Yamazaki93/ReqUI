import { IMessage } from "../messaging/i-message";

// tslint:disable:max-classes-per-file

export class UpdaterCommand implements IMessage {
    public ID = 'UpdaterCommand' ;
    public Command: string;
    public constructor(command: string) {
        this.Command = command;
    }
}

export class UpdaterEvent implements IMessage {
    public ID = 'UpdaterEvent' ;
    public Event: string;
    public Arg: any;
    public constructor(evt: string, arg?: any) {
        this.Event = evt;
        this.Arg = arg;
    }
}
