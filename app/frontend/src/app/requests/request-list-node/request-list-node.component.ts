import { Component, OnInit, Input } from '@angular/core';
import { IRequestTreeEntry, RequestsService } from '../requests.service';
import { ServersService } from 'src/app/servers/servers.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';
import { ElectronService } from 'src/app/messaging/electron.service';
import { DeleteRequestByPath } from '../../../../../requests/messages';

@Component({
  selector: 'app-request-list-node',
  templateUrl: './request-list-node.component.html',
  styleUrls: ['./request-list-node.component.scss']
})
export class RequestListNodeComponent extends SubscriptionComponent implements OnInit {

  @Input() data: IRequestTreeEntry;
  private typeCompatible = false;
  private currentType = '';
  private hideIncompatible = true;
  constructor(
    private servers: ServersService,
    private req: RequestsService,
    private electron: ElectronService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.servers.CurrentServerType.subscribe(s => {
      this.currentType = s;
      this.typeCompatible = this.data.request && this.data.request.Type === s;
    }));
    this.recordSubscription(this.req.hideIncompatible.subscribe(h => {
      this.hideIncompatible = h;
    }));
  }
  private hasRequest() {
    return this.data.request;
  }
  private canSendRequest() {
    return this.typeCompatible;
  }
  private load($event) {
    if (this.data.request) {
      this.req.loadRequest.emit(this.data.request);
    }
    $event.stopPropagation();
  }
  private send($event) {
    if (this.data.request) {
      this.req.sendRequest.emit(this.data.request);
    }
    $event.stopPropagation();
  }
  private delete($event) {
    let path = this.data.fullPath;
    this.electron.Send(new DeleteRequestByPath(path));
    $event.stopPropagation();
  }
  private expandOrLoad($event) {
    if (this.data.children && this.data.children.length) {
      this.data.expanded = !this.data.expanded;
    } else if (this.data.request) {
      this.load($event);
    }
  }
}
