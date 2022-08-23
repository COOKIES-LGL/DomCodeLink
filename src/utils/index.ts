import os from 'os';

const projectBasePath = 
__dirname.substring(0, __dirname.search('node_modules'));

const getSystem = function (): string {
    const platform = os.platform();
    switch (platform) {
      case 'darwin':
        return 'MacOSX';
        break;
      case 'linux':
        return 'Linux';
        break;
      case 'win32':
        return 'Windows';
        break;
      default:
        return '无法确定操作系统!';
    }
  }

export default {
    projectBasePath: projectBasePath,
    getSystem: getSystem
}
