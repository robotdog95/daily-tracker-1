
const { app, BrowserWindow } = require('electron');
const { ipcMain } = require("electron");
const path = require('node:path');
const { electron } = require('node:process');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#74b1be",
      height: 30,
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    minHeight: 700,
    minWidth: 400,
    icon: path.join(__dirname, "/assets/icons/calendarpng.ico"),
  });

  console.log(path.join(__dirname, "/assets/icons/calendarpng.ico"));

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
//------------------------

/* setupInitialDatabase();
//recieve user-made data
ipcMain.handle("recieve-data", async (event, symptom) => {

  const entry = {
    _id: "symptom_" + symptom.label,
    label: symptom.label,
    maxvalue: symptom.maxvalue,
    defaultvalue: symptom.defaultvalue,
    icon: symptom.icon
  }

  console.log("recieved: ", entry)
  writeToDatabase(entry, db);
});

ipcMain.handle('db:getAll', async () => {
  return db.allDocs({ include_docs: true });
});

ipcMain.handle('db:put', async (_event, doc) => {
  return db.put(doc);
});

ipcMain.handle('db:remove', async (_event, id, rev) => {
  return db.remove(id, rev);
});

ipcMain.handle('db:allDocs', async (_event, query) => {
  const result = db.allDocs({
  include_docs: true,
  attachments: true,
  startkey: query,
 // endkey: 'quux'
})
console.log("result of search with query: ", query, ": ", result);
return result;
})

ipcMain.handle('db:findByPrefix', async (_event, prefix) => {
  const res = await db.allDocs({
    startkey: prefix,
    endkey: prefix + '\uffff',
    include_docs: true
  });

  //return res.rows.map(r => r.id); //returns only the id, for our purposes not ok
  const returnedResult = res.rows.map(r => r.doc);
  return returnedResult;
});
 */
//---------------------database stuff
/* function setupInitialDatabase() {

  db.info().then(function (info) {
    console.log("trying to retrieve database info: ", info);
  });
}

function retrieveFromDatabase(docId) {

  if (docId) {
    console.log("trying to retrieve doc: ", docId);
    db.get(docId).then(function (doc) {
      console.log("success retrieving ", docId, ": ",doc);
      return doc;
    });
  }
  else {
    console.log("cannot retrieve ",docId)
    return;
  }
}

setupInitialDatabase();
//destroyDatabase();
function writeToDatabase(data, database) {
  database.put(data, function callback(err, result) {
    if (!err) {
      console.log("successfuly wrote to database: ", data._id);
    }
  });
}
 */