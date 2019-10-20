import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestResponseService } from './request-response.service';
import { MessagingModule } from '../messaging/messaging.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MessagingModule,
    WorkspaceModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initModule,
      multi: true,
      deps: [
        RequestResponseService,
      ]
    },
  ]
})
export class ServerCommModule { }

function initModule(
  rrs: RequestResponseService,
): () => Promise<any> {
  return (): Promise<any> => {
    rrs.init();
    return Promise.resolve();
  };
}
