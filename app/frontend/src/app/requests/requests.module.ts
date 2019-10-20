import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { FormsModule } from '@angular/forms';
import { MessagingModule } from '../messaging/messaging.module';
import { RequestListNodeComponent } from './request-list-node/request-list-node.component';
import { ServersModule } from '../servers/servers.module';
import { NodeFilterPipe } from './request-list-node/filter-node.pipe';
import { RequestsService } from './requests.service';

@NgModule({
  declarations: [
    RequestsListComponent,
    RequestListNodeComponent,
    NodeFilterPipe,
  ],
  exports: [
    RequestsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MessagingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initModule,
      multi: true,
      deps: [
        RequestsService,
      ]
    },
  ]
})
export class RequestsModule { }
function initModule(
  ws: RequestsService,
): () => Promise<any> {
  return (): Promise<any> => {
    ws.init();
    return Promise.resolve();
  };
}
