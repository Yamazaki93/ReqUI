import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabControlComponent } from './tab-control/tab-control.component';
import { WorkspaceContainerComponent } from './workspace-container/workspace-container.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { WorkspaceService } from './workspace.service';
import { TabHostComponent } from './tab-host/tab-host.component';
import { ControlsModule } from '../controls/controls.module';

@NgModule({
  declarations: [
    TabControlComponent,
    WorkspaceContainerComponent,
    TabItemComponent,
    TabHostComponent
  ],
  imports: [
    CommonModule,
    ControlsModule
  ],
  providers: [
    WorkspaceService
  ],
  exports: [
    WorkspaceContainerComponent
  ]
})
export class WorkspaceModule { }
