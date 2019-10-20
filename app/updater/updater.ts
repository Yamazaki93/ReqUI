import { BrowserWindow, app } from "electron";
import { autoUpdater } from "electron-updater";
import * as electronLog from "electron-log";
import { IMessenger } from "../messaging/i-messenger";
import { UpdaterCommand, UpdaterEvent } from "./messages";

autoUpdater.autoDownload = false;
autoUpdater.logger = electronLog;

// beta channel for testing
autoUpdater.channel = 'beta';

export class UpdaterService {
    private messenger: IMessenger;

    constructor(messenger: IMessenger) {
        this.messenger = messenger;
        this.messenger.Receive('UpdaterCommand', (arg: UpdaterCommand) => {
            if (arg.Command === 'commence-install-update') {
                setImmediate(() => {
                    app.removeAllListeners("window-all-closed");
                    let browserWindows = BrowserWindow.getAllWindows();
                    browserWindows.forEach((browserWindow) => {
                        browserWindow.close();
                    });
                    autoUpdater.quitAndInstall();
                });
            } else if (arg.Command === 'commence-download') {
                autoUpdater.downloadUpdate();
            } else if (arg.Command === 'check-for-update') {
                this.checkUpdate();
            }
        });
        autoUpdater.on('update-available', (info) => {
            this.messenger.Send(new UpdaterEvent('checking', false));
            this.messenger.Send(new UpdaterEvent('update-available', { version: info.version }));
        });
        autoUpdater.on('update-not-available', () => {
            this.messenger.Send(new UpdaterEvent('checking', false));
            this.messenger.Send(new UpdaterEvent('update-not-available'));
        });
        autoUpdater.on('download-progress', (progress) => {
            this.messenger.Send(new UpdaterEvent('downloading-update', { percentage: progress.percent }));
        });
        autoUpdater.on('update-downloaded', () => {
            this.messenger.Send(new UpdaterEvent('download-complete'));
        });
        autoUpdater.on('checking-for-update', () => {
            this.messenger.Send(new UpdaterEvent('checking', true));
        });
        setInterval(() => {
            this.checkUpdate();
        }, 15 * 60 * 1000);
        setTimeout(() => {
            this.checkUpdate();
        }, 10 * 1000);
    }
    public checkUpdate() {
        autoUpdater.checkForUpdates();
    }
}
