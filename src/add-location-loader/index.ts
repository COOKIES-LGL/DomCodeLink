// 引入fs模块
import Utils from '../utils';

export default function (source) {
  const { resourcePath } = this;
  return sourceCodeChange(source, resourcePath);
}

function sourceCodeChange(source, resourcePath) {
  resourcePath = resourcePath.substring(Utils.projectBasePath.length); // vue代码相对路径
  return codeLineTrack(source, resourcePath);
}

function codeLineTrack(str, resourcePath) {
  const lineList = str.split('\n');
  const newList = [];
  //template标识，用于判断代码是否在template内，限制只处理tempalte下的代码
  const templateIndex = {
    index: 0,
  };
  lineList.forEach((item, index) => {
    newList.push(addLineAttr(item, index + 1, resourcePath, templateIndex)); // 添加位置属性，index+1为具体的代码行号
  });
  return newList.join('\n');
}

function addLineAttr(lineStr, line, resourcePath, templateIndex) {
  const reg = /(<[\w-]+)|(<\/template)/g;
  let leftTagList = lineStr.match(reg);
  if (leftTagList) {
    leftTagList = Array.from(new Set(leftTagList));
    leftTagList.forEach((item) => {
      if (item && item.indexOf('<template') !== -1) {
        templateIndex.index += 1;
      }
      if (item && item.indexOf('</template') !== -1) {
        templateIndex.index -= 1;
      }

      if (templateIndex.index > 0 && item && item.indexOf('template') == -1) {
        //对没有属性的标签如<div>,整个进行替换
        if (new RegExp(`${item}>`, 'g').test(lineStr)) {
          const regx = new RegExp(`${item}>`, 'g');
          const location = `${item} code-location="${resourcePath}:${line}">`;
          lineStr = lineStr.replace(regx, location);
        }
        //对有属性的标签如<div class="test">,只替换开头的标签"<div "(包含空格，用于避免如下问题:
        //<a-b><a></a></a-b> -> <a codexx-b><a codexx></a></a-b>:当长标签字符包含短标签字符时，短标签的替换影响长标签)
        else {
          const regx = new RegExp(`${item}\\s+`, 'g');
          const location = `${item} code-location="${resourcePath}:${line}" `;
          lineStr = lineStr.replace(regx, location);
        }
      }
    });
  }
  return lineStr;
}
