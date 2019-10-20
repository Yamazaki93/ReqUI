import { Injectable, Type, ComponentRef, ComponentFactory, Injector, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import * as uuid from 'uuid';
import { ITabEntry } from './tab-entry';
import { TabStatus } from './tab-status';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  public TabAdded: EventEmitter<ITabEntry> = new EventEmitter<ITabEntry>();
  public CurrentTabChanged: Observable<string>;
  public TabClosed: EventEmitter<string> = new EventEmitter<string>();
  private tabs: {
    [key: string]: ComponentRef<any>;
  } = {};
  public tabStatusChanged: ReplaySubject<{ id: string, status: TabStatus }> = new ReplaySubject<{ id: string, status: TabStatus }>();
  private tabTitleChanged: ReplaySubject<{ id: string, title: string }> = new ReplaySubject<{ id: string, title: string }>();
  private currentTab = new BehaviorSubject<string>('');
  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this.CurrentTabChanged = this.currentTab.asObservable();
  }
  public SubscribeTabStatusChanged(id: string): Observable<TabStatus> {
    return this.tabStatusChanged.pipe(filter(_ => _.id === id)).pipe(map(_ => _.status));
  }

  public SubscribeTabTitleChanged(id: string): Observable<string> {
    return this.tabTitleChanged.pipe(filter(_ => _.id === id)).pipe(map(_ => _.title));
  }

  public GetCurrentTab() {
    return this.currentTab.value;
  }

  public OpenNewTab<T>(component: Type<T>): ITabEntry {
    let factory = this.cfr.resolveComponentFactory(component);
    let cmp = factory.create(this.injector);
    let id = uuid.v4();
    let entry = {
      component: cmp,
      id
    };
    this.TabAdded.emit(entry);
    this.tabs[id] = cmp;
    this.currentTab.next(id);
    return entry;
  }
  public CloseTab(id: string) {
    if (this.tabs[id]) {
      this.TabClosed.emit(id);
      this.tabs[id].destroy();
      delete this.tabs[id];
    }
  }
  public SetTabStatus(id: string, status: TabStatus) {
    if (this.tabs[id]) {
      this.tabStatusChanged.next({id, status});
    }
  }
  public SetTabTitle(id: string, title: string) {
    if (this.tabs[id]) {
      this.tabTitleChanged.next({id, title});
    }
  }
  public SelectTab(id: string) {
    if (this.tabs[id]) {
      this.currentTab.next(id);
    }
  }
}
