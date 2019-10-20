import { Component, OnInit, Input } from '@angular/core';
import { ITabEntry } from '../tab-entry';
import { WorkspaceService } from '../workspace.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';

@Component({
  selector: 'app-tab-control',
  templateUrl: './tab-control.component.html',
  styleUrls: ['./tab-control.component.scss']
})
export class TabControlComponent extends SubscriptionComponent implements OnInit {

  @Input() tabs: ITabEntry[];
  private currentID = '';
  constructor(
    private wk: WorkspaceService
  ) {
    super();
  }
  ngOnInit() {
    this.recordSubscription(this.wk.CurrentTabChanged.subscribe(c => {
      this.currentID = c;
    }));
  }

  private isCurrent(t: ITabEntry): boolean {
    return t.id && this.currentID === t.id;
  }
}
