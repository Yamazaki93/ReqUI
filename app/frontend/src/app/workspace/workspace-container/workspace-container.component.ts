import { Component, OnInit, ComponentRef } from '@angular/core';
import { ComponentFactory } from '@angular/core/src/render3';
import { WorkspaceService } from '../workspace.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';
import { ITabEntry } from '../tab-entry';

@Component({
  selector: 'app-workspace-container',
  templateUrl: './workspace-container.component.html',
  styleUrls: ['./workspace-container.component.scss']
})
export class WorkspaceContainerComponent extends SubscriptionComponent implements OnInit {

  private tabs: ITabEntry[] = [];
  private currentTabID = '';
  constructor(
    private wp: WorkspaceService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.wp.TabAdded.subscribe(t => {
      this.tabs.push(t);
    }));
    this.recordSubscription(this.wp.TabClosed.subscribe(id => {
      this.tabs = this.tabs.filter(_ => _.id !== id);
    }));
    this.recordSubscription(this.wp.CurrentTabChanged.subscribe(ct => {
      this.currentTabID = ct;
    }));
  }

  private get currentComponent(): ComponentRef<any> {
    let entry = this.tabs.find(_ => _.id === this.currentTabID);
    return entry ? entry.component : null;
  }
}
