import { IMessage } from "../messaging/i-message";
import { IRequest } from "../servers/i-server";
import { IMessenger } from '../messaging/i-messenger';

// tslint:disable:max-classes-per-file
export class LoadRequestsCommand implements IMessage {
    public ID = 'Requests.Load';
}
export class RequestsLoadedEvent implements IMessage {
    public ID = "Requests.Loaded";
    public Requests: IRequestDict;
    public constructor(
        requests: IRequestDict,
    ) {
        this.Requests = requests;
    }
}

export class SaveRequestCommand implements IMessage {
    public ID = 'Requests.Save';
    public Request: IRequest;
    public constructor(
        request: IRequest,
    ) {
        this.Request = request;
    }
}

export class RequestSavedEvent implements IMessage {
    public ID = 'Requests.Saved';
    public Request: IRequest;
    public constructor(
        request: IRequest,
    ) {
        this.Request = request;
    }
}

export interface IRequestDict {
    [key: string]: IRequest;
}

export class DeleteRequestByPath implements IMessage {
    public ID = 'Requests.DeleteByPath';
    public Path: string;
    public constructor(
        path: string,
    ) {
        this.Path = path;
    }
}
