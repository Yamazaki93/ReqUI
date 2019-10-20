import { Component, OnInit, Input } from '@angular/core';
import { IServerConfig } from '../../../../../servers/i-server-config';
import { ElectronService } from 'src/app/messaging/electron.service';
import { DeleteConfigCommand } from '../../../../../servers/messages';
import { ServersService } from '../servers.service';

@Component({
  selector: 'app-server-list-item',
  templateUrl: './server-list-item.component.html',
  styleUrls: ['./server-list-item.component.scss']
})
export class ServerListItemComponent implements OnInit {

  @Input() cfg: IServerConfig;

  constructor(
    private electron: ElectronService,
    private servers: ServersService
  ) { }

  ngOnInit() {
  }

  delete($event) {
    this.electron.Send(new DeleteConfigCommand(this.cfg.ID));
    $event.stopPropagation();
  }
  createNewConnection($event) {
    this.servers.OpenNewTabComponent(this.cfg);
    $event.stopPropagation();
  }
  connect() {
    this.servers.OpenConnection(this.cfg);
  }
}
