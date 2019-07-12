import React, { PureComponent } from 'react'
import BraftEditor from 'braft-editor'
import ColorPicker from 'braft-extensions/dist/color-picker'

import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/color-picker.css'

// TODO 添加自己的上传文件的地址
const fileUploadUrl = ''

BraftEditor.use(ColorPicker({
  theme: 'light' // 支持dark和light两种主题，默认为dark
}))

/**
 * 富文本编辑器
 * 此处不能用function来定义，尝试使用forwardRef仍会造成死循环
 */
export default class Editor extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState(null),
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const editorState = nextProps.value;
      this.setState({
        editorState,
      });
    }
  }

    triggerChange = (editorState) => {
      const { onChange } = this.props;
      if (onChange) {
        onChange(editorState);
      }
    }

    handleEditorChange = (editorState) => {
      this.setState({
        editorState,
      });
      this.triggerChange(
        editorState,
      );
    };

    // 图片上传
    uploadFn = (param) => {

      const serverURL = fileUploadUrl
      const xhr = new XMLHttpRequest
      const fd = new FormData()

      const successFn = (response) => {
        const { target } = response;
        if (target.response) {
          const res = JSON.parse(target.response)
          if (res) {
            if (res.errorCode === 0) {
              // 调用param.progress告知编辑器上传成功后的文件地址
              param.success({
                url: res.data
              })
            }
          }
        }
      }

      const progressFn = (event) => {
        // 调用param.progress告知编辑器当前的上传进度
        param.progress(event.loaded / event.total * 100)
      }

      const errorFn = () => {
        // 调用param.progress告知编辑器上传发生了问题
        param.error({
          msg: 'unable to upload.'
        })
      }

      xhr.upload.addEventListener("progress", progressFn, false)
      xhr.addEventListener("load", successFn, false)
      xhr.addEventListener("error", errorFn, false)
      xhr.addEventListener("abort", errorFn, false)

      fd.append('file', param.file)
      xhr.open('POST', serverURL, true)
      xhr.send(fd)

    }

    // 预览
    preview = () => {

      if (window.previewWindow) {
        window.previewWindow.close()
      }

      window.previewWindow = window.open()
      window.previewWindow.document.write(this.buildPreviewHtml())
      window.previewWindow.document.close()
    }

    // 构建预览html
    buildPreviewHtml () {
      return `
        <!Doctype html>
        <html>
          <head>
            <title>预览</title>
            <style>
              html,body{
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: auto;
                background-color: #f1f2f3;
              }
              .container{
                box-sizing: border-box;
                width: 375px;
                max-width: 100%;
                height: 667px;
                margin: 0 auto;
                padding: 30px 20px;
                overflow-x: hidden;
                overflow-y: auto;
                background-color: #fff;
                border-right: solid 1px #eee;
                border-left: solid 1px #eee;
              }
              .container img,
              .container audio,
              .container video{
                max-width: 100%;
                height: auto;
              }
              .container p{
                white-space: pre-wrap;
                min-height: 1em;
              }
              .container pre{
                padding: 15px;
                background-color: #f1f1f1;
                border-radius: 5px;
              }
              .container blockquote{
                margin: 0;
                padding: 15px;
                background-color: #f1f1f1;
                border-left: 3px solid #d1d1d1;
              }
            </style>
          </head>
          <body>
            <div class="container">${this.state.editorState.toHTML()}</div>
          </body>
        </html>
      `
    }

    render(){
      const { editorState } = this.state;
      const { placeholder='请输入描述', } = this.props;
      const extendControls = [
        {
          key: 'custom-button',
          type: 'button',
          text: '预览',
          onClick: this.preview
        }
      ]
      const imageControls = [
        'float-left', // 设置图片左浮动
        'float-right', // 设置图片右浮动
        'align-left', // 设置图片居左
        'align-center', // 设置图片居中
        'align-right', // 设置图片居右
        'link', // 设置图片超链接
        // 'size', // 设置图片尺寸 禁用图片大小调整
        'remove' // 删除图片
      ]
    
      return (
        <BraftEditor
          media={{
            uploadFn: this.uploadFn,
            // 只允许插入外部图片，不允许音频、视频等
            externals: {
              image: true,
              video: false,
              audio: false,
              embed: false
            }
          }}
          placeholder={placeholder}
          value={editorState}
          // 图片针对移动端展示均为宽度100%，若需求不同可修改此处
          imageResizable={false}
          onChange={this.handleEditorChange}
          extendControls={extendControls}
          imageControls={imageControls}
        />
      );
    }

}