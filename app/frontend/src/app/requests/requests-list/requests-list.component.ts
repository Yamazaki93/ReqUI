import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'src/app/messaging/electron.service';
import { RequestsService, IRequestTreeEntry } from '../requests.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss']
})
export class RequestsListComponent extends SubscriptionComponent implements OnInit {

  private requestTree: IRequestTreeEntry = {
    request: undefined,
    name: '',
    expanded: true,
    children: [],
    fullPath: ''
  };
  private hideIncompatible = true;
  constructor(
    private req: RequestsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.req.hideIncompatible.subscribe(s => {
      this.hideIncompatible = s;
    }));
    this.recordSubscription(this.req.treeChanged.subscribe(() => {
      this.requestTree = this.req.getTree();
      this.cdr.markForCheck();
    }));
    this.requestTree = this.req.getTree();
  }
  toggleHideIncompatible() {
    this.req.hideIncompatible.next(!this.req.hideIncompatible.value);
  }
}


