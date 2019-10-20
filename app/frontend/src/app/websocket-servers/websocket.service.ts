import { Injectable } from '@angular/core';
import { ElectronService } from '../messaging/electron.service';
import { CalledOnce } from '../helpers/called-once.decorator';
import { ServerStatusChanged, ServerCloseConnectionCommand, ServerResponseReceived, ServerRequestErrorReceived } from '../../../../servers/messages';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(
    private wk: WorkspaceService,
    private electron: ElectronService
  ) { }
  @CalledOnce
  init() {

  }
}
