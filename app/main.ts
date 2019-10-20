import { app, BrowserWindow, ipcMain, shell, Menu } from "electron";
import * as path from "path";
import * as url from "url";
import os = require('os');
import * as fs from 'fs';
import * as opn from 'opn';
import { MenuTemplate } from "./menu-template";
import { Logger } from "./logging/logger";
import { LocalFilePersistenceService } from "./persistence/local-file-persistence-service";
import { Messenger } from "./messaging/messenger";
import { ILogger } from "./logging/i-logger";
import { LoadApplicationCommand } from "./load-application-command";
import { LoadServerRepositoryCommand } from "./servers/messages";
import { ServerConfigRepository } from "./servers/server-config-repository";
import { IPersistenceService } from "./persistence/i-persistence";
import { ServerConfigRepositoryMessagingAdapter } from "./servers/server-config-repo-messaging-adapter";
import { IServerManager } from "./servers/i-server-manager";
import { ServerConnectionManager } from "./servers/server-connection";
import { WebSocketServer } from "./websocket-servers/websocket-server";
import { ServerManagerMessagingAdapter } from "./servers/server-manager-messaging-adapter";
import { RequestRepository } from "./requests/request-repository";
import { RequestRepositoryMessagingAdapter } from "./requests/request-repository-messaging-adapter";
import { IMessenger } from "./messaging/i-messenger";
import { LoadRequestsCommand } from "./requests/messages";
let homeDir = os.homedir();
let appDir = homeDir + "/ReqUI/";
let mainWindow: BrowserWindow;
let messenger: Messenger;
let persistence: IPersistenceService;
let serverManager: IServerManager;

const DEBUG = process.mainModule.filename.indexOf('app.asar') === -1;
// Development only setter
if (DEBUG) {
    app.setAppUserModelId(process.execPath);
} else {
    app.setAppUserModelId('com.rhodiumcode.socket-ui');
}

function createSubWindow(relativeUrl: string, subPath: string = "") {
    let urlPath = "";
    if (DEBUG) {
        urlPath = url.format({
            pathname: path.join(__dirname, `../app/frontend/dist/${relativeUrl}`),
            protocol: "file:",
            slashes: true,
            hash: subPath,
        });
    } else {
        urlPath = url.format({
            pathname: path.join(__dirname, `./frontend/dist/${relativeUrl}`),
            protocol: "file:",
            slashes: true,
            hash: subPath,
        });
    }
    return createBrowserWindow(urlPath);
}

function createBrowserWindow(urlPath: string) {
    let win: BrowserWindow;
    if (DEBUG) {
        win = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        win.loadURL(urlPath);
    } else {
        // Production
        // @ts-ignore
        let menu = Menu.buildFromTemplate(MenuTemplate);
        win = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        win.loadURL(urlPath);
        win.setMenu(menu);
    }
    // intercept outgoing navigation and reopen on new window
    win.webContents.on('will-navigate', (event, targetUrl) => {
        opn(targetUrl);
        event.preventDefault();
    });

    return win;
}

function createMainWindow() {
    mainWindow = createSubWindow('index.html');
    mainWindow.on('closed', () => {
        messenger.removeWindow(mainWindow);
    });
    mainWindow.maximize();
    messenger.addWindow(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createAppDirIfNotExist();
    initializeComponents();
    registerApplicationMessages();
    createMainWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow();
    }
});


function createAppDirIfNotExist() {
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir);
    }
}

function initializeComponents() {
    let logger = initializeLogger();
    initializeMessaging(logger);
    initializePersistence();
    initializeServers(messenger, logger, persistence);
    initializeRequests(messenger, logger, persistence);
}

function initializeMessaging(log: ILogger) {
    messenger = new Messenger(log, DEBUG);
}

function initializeLogger() {
    let logger = new Logger(appDir);
    logger.SetLoggerMode(DEBUG);
    return logger;
}

function initializePersistence() {
    persistence = new LocalFilePersistenceService(appDir);
}

function initializeServers(message: IMessenger, log: ILogger, persist: IPersistenceService) {
    let repo = new ServerConfigRepository(persist);
    // tslint:disable-next-line:no-unused-expression
    new ServerConfigRepositoryMessagingAdapter(repo, message);
    let scm = new ServerConnectionManager(log, message);
    serverManager = scm;
    // tslint:disable-next-line:no-unused-expression
    new ServerManagerMessagingAdapter(scm, message);
    serverManager.RegisterType('WebSocket', WebSocketServer);
}

function initializeRequests(message: IMessenger, log: ILogger, persist: IPersistenceService) {
    let repo = new RequestRepository(persist);
    let adap = new RequestRepositoryMessagingAdapter(repo, message);
}

function registerApplicationMessages() {
    messenger.Receive('Application.Load', (message: LoadApplicationCommand) => {
        messenger.Send(new LoadServerRepositoryCommand());
        messenger.Send(new LoadRequestsCommand());
    });
}
