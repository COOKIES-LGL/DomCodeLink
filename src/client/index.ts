import axios from 'axios';

function uuid(len, radix) {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

function sendRequestToOpenFileInEditor(filePath: string) {
  const protocol = window.location.protocol
    ? window.location.protocol
    : 'http:';
  const hostname = window.location.hostname
    ? window.location.hostname
    : 'localhost';
  const port = window.location.port ? window.location.port : '80';
  axios
    .get(`${protocol}//${hostname}:${port}/code`, {
      params: {
        filePath: filePath,
      },
    })
    .catch((error: Error) => {
      console.log(error);
    });
}

function getFilePath(element: any): string | null {
  if (!element || !element.getAttribute) return null;
  if (element.getAttribute('code-location')) {
    return element.getAttribute('code-location');
  }
  return getFilePath((element as Node).parentNode);
}

function openFileInEditor(e: any) {
  const filePath = getFilePath(e.target);
  sendRequestToOpenFileInEditor(filePath);
}

function clickBall(e) {
  const element = document.createElement('div');
  const elementId = 'clickBall' + uuid(8, 16);
  element.id = elementId;
  element.style.left = e.clientX - 20 + 'px';
  element.style.top = e.clientY - 20 + 'px';
  element.setAttribute('class', 'clickBall hidSlow');
  document.body.appendChild(element);
  setTimeout(() => {
    document.getElementById(elementId).remove();
  }, 1000);
}

function init() {
  if (process.env.NODE_ENV === 'development') {
    document.onmousedown = function (e) {
      if (e.shiftKey && e.button === 0) {
        e.preventDefault();
        clickBall(e);
        openFileInEditor(e);
      }
    };
  }
}

export default {
  init,
};
