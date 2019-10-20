import { Injectable } from '@angular/core';
import { CalledOnce } from '../helpers/called-once.decorator';
import { ElectronService } from '../messaging/electron.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { ServerStatusChanged, ServerCloseConnectionCommand, ServerResponseReceived, ServerRequestErrorReceived } from '../../../../servers/messages';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestResponseService {

  private serverStatus = new ReplaySubject<ServerStatusChanged>();
  private serverResponse = new Subject<ServerResponseReceived>();
  private serverError = new Subject<ServerRequestErrorReceived>();
  constructor(
    private electron: ElectronService,
    private wk: WorkspaceService
  ) { }

  @CalledOnce
  init() {
    this.electron.Receive('Servers.StatusChanged', (m: ServerStatusChanged) => {
      this.serverStatus.next(m);
    });
    this.wk.TabClosed.subscribe(id => {
      this.electron.Send(new ServerCloseConnectionCommand(id));
    });
    this.electron.Receive('Servers.ResponseReceived', (m: ServerResponseReceived) => {
      this.serverResponse.next(m);
    });
    this.electron.Receive('Servers.RequestErrorReceived', (m: ServerRequestErrorReceived) => {
      this.serverError.next(m);
    });
  }

  public ServerStatus(connID: string) {
    return this.serverStatus.pipe(filter(_ => _.ServerID === connID)).pipe(map(_ => _.Status));
  }
  public ServerResponse(connID: string) {
    return this.serverResponse.pipe(filter(_ => _.ServerID === connID)).pipe(map(_ => _.Data));
  }
  public ServerError(connID: string) {
    return this.serverError.pipe(filter(_ => _.ServerID === connID)).pipe(map(_ => _.Error));
  }

}
