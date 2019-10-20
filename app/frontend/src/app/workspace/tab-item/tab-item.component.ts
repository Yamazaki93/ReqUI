import { Component, OnInit, Input } from '@angular/core';
import { WorkspaceService } from '../workspace.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';
import { TabStatus } from '../tab-status';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.scss']
})
export class TabItemComponent extends SubscriptionComponent implements OnInit {

  @Input() id: string;
  @Input() current = false;
  @Input() title = '';
  private status = TabStatus.None;
  private TabStatus = TabStatus;
  constructor(
    private workspace: WorkspaceService
  ) {
    super();
  }

  ngOnInit() {
    this.recordSubscription(this.workspace.SubscribeTabStatusChanged(this.id).subscribe(status => {
      this.status = status;
    }));
    this.recordSubscription(this.workspace.SubscribeTabTitleChanged(this.id).subscribe(title => {
      this.title = title;
    }));
  }
  select() {
    this.workspace.SelectTab(this.id);
  }
  close() {
    this.workspace.CloseTab(this.id);
  }
}
