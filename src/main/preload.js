import  { remote, ipcRenderer } from 'electron'
// import {FindInPage} from 'electron-find'
// let findInPage = new FindInPage(remote.getCurrentWebContents());

ipcRenderer.on('on-find', (e, args) => {
  console.log('asdf');
  // findInPage.openFindWindow()
})