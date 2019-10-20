import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketServerConfigComponent } from './websocket-server-config/websocket-server-config.component';
import { MessagingModule } from '../messaging/messaging.module';
import { FormsModule } from '@angular/forms';
import { ConnectionComponent } from './connection/connection.component';
import { ControlsModule } from '../controls/controls.module';
import { WebsocketService } from './websocket.service';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { EditorModule } from '../editor/editor.module';
import { ServerCommModule } from '../server-comm/server-comm.module';
import { RequestsModule } from '../requests/requests.module';

@NgModule({
  declarations: [
    WebsocketServerConfigComponent,
    ConnectionComponent
  ],
  exports: [
    WebsocketServerConfigComponent,
    ConnectionComponent
  ],
  entryComponents: [
    ConnectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EditorModule,
    ControlsModule,
    ServerCommModule,
    MessagingModule,
    RequestsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initModule,
      multi: true,
      deps: [
        WebsocketService,
      ]
    },
  ]
})
export class WebsocketServersModule { }

function initModule(
  ws: WebsocketService,
): () => Promise<any> {
  return (): Promise<any> => {
    ws.init();
    return Promise.resolve();
  };
}
