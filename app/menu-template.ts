
export const MenuTemplate = [
    // { role: 'appMenu' }
    ...(process.platform === 'darwin' ? [{
        label: "ReqUI",
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
        ],
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ],
    },
];
