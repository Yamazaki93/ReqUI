import { Injectable, EventEmitter } from '@angular/core';
import { CalledOnce } from '../helpers/called-once.decorator';
import { ElectronService } from '../messaging/electron.service';
import { RequestsLoadedEvent, IRequestDict, RequestSavedEvent } from '../../../../requests/messages';
import { IRequest } from '../../../../servers/i-server';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  public treeChanged = new EventEmitter();
  public loadRequest = new EventEmitter<IRequest>();
  public sendRequest = new EventEmitter<IRequest>();
  public hideIncompatible = new BehaviorSubject<boolean>(true);
  private requestTree: IRequestTreeEntry = {
    request: undefined,
    expanded: true,
    name: 'All Requests',
    children: [],
    fullPath: '',
  };
  constructor(
    private elec: ElectronService
  ) { }

  @CalledOnce
  public init() {
    this.elec.Receive('Requests.Loaded', (m: RequestsLoadedEvent) => {
      this.rebuildTree(m.Requests);
      this.treeChanged.emit();
    });
    this.elec.Receive('Requests.Saved', (m: RequestSavedEvent) => {
      this.addUpdateTreeEntry(m.Request);
      this.treeChanged.emit();
    });
  }

  public getTree() {
    return this.requestTree;
  }

  private rebuildTree(data: IRequestDict) {
    if (data) {
      this.requestTree = {
        request: undefined,
        name: 'All Requests',
        expanded: true,
        children: [],
        fullPath: '',
      };
      Object.keys(data).forEach(e => {
        let entry = data[e];
        this.addUpdateTreeEntry(entry);
      });
    }
  }

  private addUpdateTreeEntry(data: IRequest) {
    let entry = data;
    let keyPath = entry.Name.split('/');
    let node = this.requestTree;
    keyPath.forEach((name, i) => {
      if (i === keyPath.length - 1) {
        node.children = node.children.filter(_ => _.name !== name);
        node.children.push({
          request: entry,
          name,
          expanded: true,
          children: [],
          fullPath: data.Name,
        });
      } else {
        let inner = node.children.find(_ => _.name === name);
        if (!inner) {
          inner = {
            request: undefined,
            name,
            expanded: true,
            children: [],
            fullPath: keyPath.slice().slice(0, i + 1).join('/') + '/'
          };
          node.children.push(inner);
        }
        node = inner;
      }
    });
  }
}

export interface IRequestTreeEntry {
  request: IRequest;
  name: string;
  fullPath: string;
  expanded: boolean;
  children: IRequestTreeEntry[];
}
