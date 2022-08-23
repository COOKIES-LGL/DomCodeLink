import child_process from 'child_process';
import Utils from '../utils';
import serverConfig from './config';


function openCodeFileInWebStorm(path: string) {
  let filePath = path.split(':')[0];
  const linePath = path.split(':')[1];
  filePath = Utils.projectBasePath + filePath;

  if (Utils.getSystem() === 'win32') {
    child_process.exec(`webstorm64.exe  --line ${linePath} ${filePath}`, {
      env: process.env,
    });
  } else {
    child_process.exec(`webstorm64  --line ${linePath} ${filePath}`, {
      env: process.env,
    });
  }
}

function openCodeFileInVscode(path: string) {
  const filePath = Utils.projectBasePath + path;
  child_process.exec(`code -r -g ${filePath}`, {
    env: process.env,
  });
}

export const openCodeFile = function (path: string) {
  if (serverConfig.getEditor() === 'vscode') {
    openCodeFileInVscode(path);
  } else if (serverConfig.getEditor() === 'webstorm') {
    openCodeFileInWebStorm(path);
  } else {
    openCodeFileInVscode(path);
  }
};
