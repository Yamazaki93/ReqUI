import { Injectable, ChangeDetectorRef, NgZone } from '@angular/core';
import { IMessenger } from '../../../../messaging/i-messenger';
import { BehaviorSubject } from 'rxjs';
import { IMessage } from '../../../../messaging/i-message';
declare var electron: any;


@Injectable()
export class ElectronService implements IMessenger {

  WindowID = new BehaviorSubject<string>('');
  private initialized = false;
  private ipcRenderer = null;
  private registrations: {
    [key: string]: Array<(m: any) => any>
  } = {};
  constructor(
    private zone: NgZone
  ) {
    if (electron) {
      this.ipcRenderer = electron.ipcRenderer;
      this.initialized = true;
      this.ipcRenderer.removeAllListeners('SocketUI');
      this.ipcRenderer.on('SocketUI', (ev, arg) => {
        const unpackedMessage = arg.id;
        const unpackedPayload = arg.payload;
        if (this.registrations[unpackedMessage]) {
          this.registrations[unpackedMessage].forEach(h => {
            h(unpackedPayload);
          });
        }
      });
    } else {
      console.warn('Electron not available');
    }
  }

  Send<T extends IMessage>(message: T) {
    this.ipcRenderer.send('SocketUI', {
      id: message.ID,
      payload: message,
    });
    if (this.registrations[message.ID]) {
      this.registrations[message.ID].forEach(h => {
        h(message);
      });
    }
  }
  Receive<T extends IMessage>(messageID: string, handler: (message: T) => void) {
    if (this.available) {
      this.registerHandler(messageID, (payload) => {
        this.zone.run(() => {
          handler(payload);
        });
      });
    }
  }
  Request<T extends IMessage, J extends IMessage>(message: T): J {
    if (this.registrations[message.ID]) {
      return this.registrations[message.ID][0](message);
    }
    return this.ipcRenderer.sendSync('SocketUI', {
      id: message.ID,
      payload: message,
    });
  }
  HandleRequest<T extends IMessage, J extends IMessage>(messageID: string, handler: (message: T) => J) {
    if (this.registrations[messageID]) {
      throw new Error(`Handler for ${messageID} already registered`);
    }
    this.registrations[messageID] = [handler];
  }

  browseFolder(): string {
    const paths = electron.remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (paths && paths.length) {
      return paths[0];
    } else {
      return '';
    }
  }

  get available(): boolean {
    return this.initialized;
  }
  private registerHandler(event: string, handler: (m: any) => any) {
    if (!this.registrations[event]) {
      this.registrations[event] = [];
    }
    this.registrations[event].push(handler);
  }
}
