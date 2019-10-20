import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as uuid from 'uuid';
import { ElectronService } from 'src/app/messaging/electron.service';
import { AddOrUpdateConfigCommand } from '../../../../../servers/messages';
import { WebSocketServerConfigMemento } from '../../../../../websocket-servers/i-websocket-server-config';

@Component({
  selector: 'app-websocket-server-config',
  templateUrl: './websocket-server-config.component.html',
  styleUrls: ['./websocket-server-config.component.scss']
})
export class WebsocketServerConfigComponent implements OnInit {

  private serverPath = '';
  private protocol = 's';
  @Output() Closing = new EventEmitter<{}>();
  @ViewChild('newServerPathInput') newServerPathInput: ElementRef;
  constructor(
    private electron: ElectronService
  ) { }

  ngOnInit() {
  }

  private cancelAdd() {
    this.Closing.emit();
  }
  private commitAdd() {
    let id = uuid.v4();
    this.electron.Send(new AddOrUpdateConfigCommand<WebSocketServerConfigMemento>(
      id,
      {
        ID: id,
        Path: this.serverPath,
        Secured: this.protocol === 's',
        TypeID: 'WebSocket'
      }));
    this.serverPath = '';
    setTimeout(() => {
      if (this.newServerPathInput) {
        this.newServerPathInput.nativeElement.focus();
      }
    });
  }
  private onKeyPressInput($event) {
    if ($event.code === 'Enter') {
      this.commitAdd();
      return false;
    } else if ($event.code === 'Escape') {
      this.cancelAdd();
      return false;
    } else {
      return true;
    }
  }

}
