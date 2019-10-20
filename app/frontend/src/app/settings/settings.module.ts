import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { FormsModule } from '@angular/forms';
import { WorkspaceModule } from '../workspace/workspace.module';

@NgModule({
  declarations: [SettingsPageComponent],
  exports: [SettingsPageComponent],
  entryComponents: [SettingsPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    WorkspaceModule
  ]
})
export class SettingsModule { }
