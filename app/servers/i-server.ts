import { Observable } from 'rxjs';
import { IServerConfig } from './i-server-config';
import { ServerStatus } from './server-status';
import { ILogger } from '../logging/i-logger';
import { IServerError } from './i-server-error';

export interface IServer<TReq extends IRequest, TResp> {
    SetConfig(config: IServerConfig);
    GetConfig(): IServerConfig;
    Send(data: TReq);
    Receive(): Observable<TResp>;
    OnError(): Observable<IServerError>;
    CurrentStatus(): Observable<ServerStatus>;
    Open();
    Close();
}

export type IServerConstructor = new(config: IServerConfig, log: ILogger) => IServer<any, any>;

export interface IRequest {
    Name: string;
    Type: string;
    Data: any;
}
