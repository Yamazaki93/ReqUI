import { Injectable, Type } from '@angular/core';
import { ElectronService } from '../messaging/electron.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { CalledOnce } from '../helpers/called-once.decorator';
import { ConfigChangedEvent } from '../../../../servers/messages';
import { WorkspaceService } from '../workspace/workspace.service';
import { IServerConfig } from '../../../../servers/i-server-config';
import { ConnectionComponent } from '../websocket-servers/connection/connection.component';
import { ConfigFactory } from '../../../../config-factory';
import { WebSocketServerConfig } from '../../../../websocket-servers/websocket-server-config';
import { ComponentRef } from '@angular/core/src/render3';
import { ITabEntry } from '../workspace/tab-entry';

@Injectable({
  providedIn: 'root'
})
export class ServersService {

  public CurrentServerType: Observable<string>;
  public Servers: Observable<IServerConfig[]>;
  private currentServerType = new BehaviorSubject<string>('');
  private servers = new BehaviorSubject<IServerConfig[]>([]);
  private openedConnections: {
    tabID: string,
    configID: string
  }[] = [];
  constructor(
    private electron: ElectronService,
    private workspace: WorkspaceService
  ) {
    this.Servers = this.servers.asObservable();
    this.CurrentServerType = this.currentServerType.asObservable();
  }

  @CalledOnce
  init() {
    this.electron.Receive('Servers.ConfigChanged', (m: ConfigChangedEvent) => {
      this.servers.next(m.ConfigMementos.map(_ => ConfigFactory.CreateConfigObject(_)));
    });
    this.workspace.TabClosed.subscribe(id => {
      this.currentServerType.next('');
      this.openedConnections = this.openedConnections.filter(_ => _.tabID !== id);
    });
    this.workspace.CurrentTabChanged.subscribe(id => {
      let opened = this.openedConnections.find(_ => _.tabID === id);
      if (opened) {
        let cfg = this.servers.value.find(_ => _.ID === opened.configID);
        this.currentServerType.next(cfg.GetMemento().TypeID);
      } else {
        this.currentServerType.next('');
      }
    });
  }

  public OpenConnection(cfg: IServerConfig) {
    let opened = this.openedConnections.find(_ => _.configID === cfg.ID);
    if (opened) {
      this.workspace.SelectTab(opened.tabID);
    } else {
      this.OpenNewTabComponent(cfg);
    }
    this.currentServerType.next(cfg.GetMemento().TypeID);
  }

  public OpenNewTabComponent(cfg: IServerConfig) {
    switch (cfg.GetMemento().TypeID) {
      case 'WebSocket':
        let tab = this.workspace.OpenNewTab(ConnectionComponent);
        this.AddNewOpenedConnection(cfg, tab);
        let conn = tab.component.instance as ConnectionComponent;
        conn.config = cfg as WebSocketServerConfig;
        conn.tabID = tab.id;
        return;
      default:
        throw new Error('Tab component unknown');
    }
  }

  private AddNewOpenedConnection(cfg: IServerConfig, tab: ITabEntry) {
    this.openedConnections.push({
      configID: cfg.ID,
      tabID: tab.id
    });
  }
}
