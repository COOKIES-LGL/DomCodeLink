export default {
  editor: 'vscode',
  setEditor: function (editor: string) {
    this.editor = editor;
  },
  getEditor: function () {
    return this.editor;
  }
};
