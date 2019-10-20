import { Injectable, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CalledOnce } from '../helpers/called-once.decorator';
import { ElectronService } from '../messaging/electron.service';
import { UpdaterEvent, UpdaterCommand } from '../../../../updater/messages';

@Injectable()
export class UpdaterService {

  updateVersion: Observable<string> = new Observable<string>();
  updaterStatus: Observable<UpdaterStatus> = new Observable<UpdaterStatus>();
  updateDownloadProgress: EventEmitter<number> = new EventEmitter<number>();

  private statusSubject: BehaviorSubject<UpdaterStatus> = new BehaviorSubject<UpdaterStatus>(UpdaterStatus.NoUpdateAvailable);
  private versionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(
    private electron: ElectronService,
  ) {
    this.updaterStatus = this.statusSubject.asObservable();
    this.updateVersion = this.versionSubject.asObservable();
  }
  @CalledOnce
  init() {
    this.electron.Receive('UpdaterEvent', (evt: UpdaterEvent) => {
      if (evt.Event === 'update-available' &&
        (this.statusSubject.getValue() === UpdaterStatus.NoUpdateAvailable || this.statusSubject.getValue() === UpdaterStatus.CheckingUpdate)) {
        this.versionSubject.next(evt.Arg.version);
        this.statusSubject.next(UpdaterStatus.UpdateAvailable);
      } else if (evt.Event === 'update-not-available') {
        this.statusSubject.next(UpdaterStatus.NoUpdateAvailable);
      } else if (evt.Event === 'downloading-update') {
        if (this.statusSubject.getValue() !== UpdaterStatus.DownloadingUpdate) {
          this.statusSubject.next(UpdaterStatus.DownloadingUpdate);
        }
        this.updateDownloadProgress.emit(Math.floor(evt.Arg.percentage));
      } else if (evt.Event === 'download-complete') {
        this.statusSubject.next(UpdaterStatus.InstallingUpdate);
        let that = this;
        setTimeout(() => {
          that.electron.Send(new UpdaterCommand('commence-install-update'));
        }, 7 * 1000);
      } else if (evt.Event === 'checking') {
        if (evt.Arg.inProgress) {
          this.statusSubject.next(UpdaterStatus.CheckingUpdate);
        }
      }
    });
  }
  checkUpdate() {
    this.electron.Send(new UpdaterCommand('check-for-update'));
  }
  installUpdate() {
    this.statusSubject.next(UpdaterStatus.DownloadingUpdate);
    this.electron.Send(new UpdaterCommand('commence-download'));
  }

}


export enum UpdaterStatus {
  NoUpdateAvailable,
  CheckingUpdate,
  UpdateAvailable,
  DownloadingUpdate,
  InstallingUpdate,
}
