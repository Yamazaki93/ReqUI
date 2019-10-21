import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ControlsModule } from './controls/controls.module';
import { MessagingModule } from './messaging/messaging.module';
import { CommonModule } from '@angular/common';
import { ServersModule } from './servers/servers.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { RequestsModule } from './requests/requests.module';
import { UpdaterModule } from './updater/updater.module';
import { SettingsModule } from './settings/settings.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    MonacoEditorModule,
    UpdaterModule,
    MessagingModule,
    ControlsModule,
    ServersModule,
    WorkspaceModule,
    RequestsModule,
    SettingsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
