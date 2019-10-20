import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, keyframes, style, query } from '@angular/animations';
import { ServersService } from '../servers.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';
import { ElectronService } from 'src/app/messaging/electron.service';
import { AddOrUpdateConfigCommand } from '../../../../../servers/messages';
import * as uuid from 'uuid';
import { IServerConfig } from '../../../../../servers/i-server-config';
import { WebSocketServerConfigMemento } from '../../../../../websocket-servers/i-websocket-server-config';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss'],
  animations: [
    trigger('appearAnimation', [
      transition('void => *', [
        query(':self',
          animate('0.3s ease-in-out', keyframes([
            style({ opacity: 0, transform: 'translateY(-40px)' }),
            style({ opacity: 1, transform: 'translateY(0)' }),
          ])), { optional: true }),
      ]),
    ])
  ]
})
export class ServerListComponent extends SubscriptionComponent implements OnInit {

  private adding = false;
  private cfgs: IServerConfig[] = [];

  constructor(
    private servers: ServersService,
    private electron: ElectronService
  ) {
    super();
    this.recordSubscription(servers.Servers.subscribe(s => {
      this.cfgs = s;
      console.log(this.cfgs);
    }));
  }

  ngOnInit() {
  }

  private cancelAdd() {
    this.adding = false;
  }
}
