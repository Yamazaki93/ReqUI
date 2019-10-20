import { Component, OnInit, Input } from '@angular/core';
import { WorkspaceService } from 'src/app/workspace/workspace.service';
import { TabStatus } from 'src/app/workspace/tab-status';
import { WebSocketServerConfig } from '../../../../../websocket-servers/websocket-server-config';
import { ElectronService } from 'src/app/messaging/electron.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';
import { ServerStatusChanged, ServerOpenNewConnectionCommand, ServerSendRequestCommand } from '../../../../../servers/messages';
import { WebsocketService } from '../websocket.service';
import { ServerStatus } from '../../../../../servers/server-status';
import { RequestResponseService } from 'src/app/server-comm/request-response.service';
import { SaveRequestCommand } from '../../../../../requests/messages';
import { RequestsService } from 'src/app/requests/requests.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent extends SubscriptionComponent implements OnInit {

  @Input() set config(v: WebSocketServerConfig) {
    this.configValue = v;
    this.onConfigChanged();
  }
  @Input() tabID = '';
  private respOption = { theme: 'vs-dark', language: 'json', readOnly: true };
  private requestName = '';
  private configValue: WebSocketServerConfig;
  private req = '';
  private err = '';
  private resp = '';
  private timeout;
  private busy = false;
  constructor(
    private wk: WorkspaceService,
    private rss: RequestResponseService,
    private electron: ElectronService,
    private reqSvc: RequestsService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.reqSvc.loadRequest.subscribe(loaded => {
      if (this.wk.GetCurrentTab() === this.tabID) {
        this.req = loaded.Data;
        this.requestName = loaded.Name;
      }
    }));
    this.recordSubscription(this.reqSvc.sendRequest.subscribe(req => {
      if (this.wk.GetCurrentTab() === this.tabID) {
        this.req = req.Data;
        this.requestName = req.Name;
        this.sendRequest();
      }
    }));
    this.recordSubscription(this.rss.ServerStatus(this.tabID).subscribe(s => {
      if (s === ServerStatus.Busy) {
        this.setBusy();
      } else {
        this.setNormal();
        switch (s) {
          case ServerStatus.Normal:
            this.setNormal();
            break;
          case ServerStatus.Closed:
            this.wk.SetTabStatus(this.tabID, TabStatus.Muted);
            break;
          case ServerStatus.Error:
            this.wk.SetTabStatus(this.tabID, TabStatus.Danger);
            break;
          case ServerStatus.Warning:
            this.wk.SetTabStatus(this.tabID, TabStatus.Warning);
            break;
        }
      }
    }));
    this.recordSubscription(this.rss.ServerResponse(this.tabID).subscribe(resp => {
      this.cancelReqTimeout();
      this.resp = resp.Data;
    }));
    this.recordSubscription(this.rss.ServerError(this.tabID).subscribe(err => {
      this.err = err.Message;
    }));
    setTimeout(() => {
      this.setBusy();
      this.wk.SetTabTitle(this.tabID, this.configValue.Server);
      this.electron.Send(new ServerOpenNewConnectionCommand(this.tabID, this.configValue.GetMemento()));
    }, 0);
  }
  private onConfigChanged() {
    this.wk.SetTabTitle(this.tabID, this.configValue.Server);
  }
  private setBusy() {
    this.busy = true;
    this.wk.SetTabStatus(this.tabID, TabStatus.Busy);
  }
  private setNormal() {
    this.busy = false;
    this.wk.SetTabStatus(this.tabID, TabStatus.Normal);
  }
  private sendRequest() {
    this.err = '';
    this.electron.Send(new ServerSendRequestCommand(this.tabID, this.req));
    this.startReqTimeout();
  }
  private startReqTimeout() {
    this.setBusy();
    this.timeout = setTimeout(() => {
      this.setNormal();
      this.err = 'Timeout';
    }, 10 * 1000);
  }
  private cancelReqTimeout() {
    this.setNormal();
    clearTimeout(this.timeout);
  }
  private saveRequest() {
    this.electron.Send(new SaveRequestCommand(
      {
        Name: this.requestName,
        Type: 'WebSocket',
        Data: this.req,
      }
    ));
  }
}
