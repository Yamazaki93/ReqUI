import { Component, OnInit, ViewChild, ViewContainerRef, Input, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-tab-host',
  templateUrl: './tab-host.component.html',
  styleUrls: ['./tab-host.component.scss']
})
export class TabHostComponent implements OnInit {

  @Input() set crf(v: ComponentRef<any>) {
    this.container.detach();
    if (!v) {
      return;
    }
    this.container.insert(v.hostView);
  }
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  constructor(
  ) { }

  ngOnInit() {
  }

}
