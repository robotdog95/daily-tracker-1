
const { app, BrowserWindow } = require('electron');
const { ipcMain } = require("electron");
const path = require('node:path');
const { electron } = require('node:process');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-memory'));
const db = new PouchDB('database');

loadDatabase();
//removeShit('trackerPooped?');

function loadDatabase() {

  db.info().then(function (info) {
    console.log("trying to retrieve database info: ", info);
  });
}


if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    minHeight: 500,
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


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//------------------------

ipcMain.handle("db-write", async (_event, data, type) => {
  console.log("main recieved data: ", data, type);

  switch (type) {
    case "new-tracker":
      console.log("recieved a new empty tracker.")
      //check if already exists and ask to overwrite if so
      var id = "tracker" + data.elId;
      writeToDatabase(data, id);

      break;

    case "new-category":
      console.log("recieved a new category: ", data);

      var id = "cat" + data.name;
      writeToDatabase(data, id);
      break;

    default:
      console.log("no type provided for ", data, ". Cancelling...")

  }

});



ipcMain.handle('db:getAll', async () => {
  return db.allDocs({ include_docs: true });
});

ipcMain.handle('db:put', async (_event, doc) => {
  console.log("recieved update to entry ", doc._id, ": ", doc)
  return db.put(doc);

});




ipcMain.handle('db:removeShit', async (_event, docId) => {
  return removeShit(docId);
})

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

  const returnedResult = res.rows.map(r => r.doc);
  console.log("search result:", returnedResult)
  return returnedResult;
});



function retrieveFromDatabase(docId) {

  if (docId) {
    console.log("trying to retrieve doc: ", docId);
    db.get(docId).then(function (doc) {
      console.log("success retrieving ", docId, ": ", doc);
      return doc;
    });
  }
  else {
    console.log("cannot retrieve ", docId)
    return;
  }
}

async function removeShit(docId) {
  try {
    console.log("looking for entry: ", docId)
    const doc = await db.get(docId);
    const response = await db.remove(doc);
    console.log(response)
  } catch (err) {
    const alldocs = await db.allDocs();
    console.log(err, alldocs);
    
  }
}

async function writeToDatabase(data, id) {
  const dataToPut = data;
  const validId = id.replaceAll(" ", "");
  dataToPut._id = validId;
  console.log("writing to db... ", dataToPut, "validId: ", validId);
  try {
    const doc = await db.get(validId);
    console.log(doc);
  }
  catch (ok) {
    db.put(dataToPut, function callback(err, result) {
      if (!err) {
        console.log("successfuly wrote to database: ", data._id);
      }
      else {
        console.log(err);
      }
    });
  }

}
