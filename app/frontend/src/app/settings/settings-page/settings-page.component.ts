import { Component, OnInit } from '@angular/core';
import { UpdaterStatus, UpdaterService } from 'src/app/updater/updater.service';
import { SubscriptionComponent } from 'src/app/helpers/subscription-component';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent extends SubscriptionComponent implements OnInit {

  private status = UpdaterStatus.NoUpdateAvailable;
  private UpdaterStatus = UpdaterStatus;
  private downloadProgress = 0;
  private newVersion = '';
  constructor(
    private updater: UpdaterService
  ) {
    super();
  }


  ngOnInit() {
    this.recordSubscription(this.updater.updaterStatus.subscribe(ua => {
      this.status = ua;
    }));
    this.recordSubscription(this.updater.updateVersion.subscribe(version => {
      this.newVersion = version;
    }));
    this.recordSubscription(this.updater.updateDownloadProgress.subscribe(pgs => {
      this.downloadProgress = pgs;
    }));
  }
  checkUpdate() {
    this.updater.checkUpdate();
  }
  install() {
    this.updater.installUpdate();
  }

}
