import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerListComponent } from './server-list/server-list.component';
import { ServerListItemComponent } from './server-list-item/server-list-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServersService } from './servers.service';
import { FormsModule } from '@angular/forms';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ControlsModule } from '../controls/controls.module';
import { WebsocketServersModule } from '../websocket-servers/websocket-servers.module';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  declarations: [
    ServerListComponent,
    ServerListItemComponent,
  ],
  exports: [
    ServerListComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ControlsModule,
    WorkspaceModule,
    SettingsModule,
    WebsocketServersModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initModule,
      multi: true,
      deps: [
        ServersService,
      ]
    },
  ]
})
export class ServersModule { }

function initModule(
  ss: ServersService,
): () => Promise<any> {
  return (): Promise<any> => {
    ss.init();
    return Promise.resolve();
  };
}
