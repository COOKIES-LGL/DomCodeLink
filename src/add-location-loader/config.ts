import Utils from '../utils';
import path from 'path';

function resolve(dir: string) {
  return path.join(Utils.projectBasePath, dir);
}

export default {
  addVueCodeLinkLoader: function (config: { module: any }) {
    //vue-code-link
    if (process.env.NODE_ENV === 'development') {
      // 本地开发环境
      config.module
        .rule('vue-code-link')
        .test(/\.vue/)
        .pre()
        .include.add(resolve('src'))
        .end()
        .use('@linzhinan/vue-code-link/add-location-loader')
        .loader('@linzhinan/vue-code-link/add-location-loader')
        .end();
    }
  },
};
