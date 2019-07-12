module.exports = [
  {
    key: 'key',
    title: '编号',
    placeholder: '请输入...',
    validator: [{ required: true, message: '请输入id' }],
    showInForm: false,
    primary: true
  },
  {
    key: 'publishDate',
    title: '发布时间',
    showType: 'datePicker',
    placeholder: '请选择发布时间',
    validator: [{ required: true, message: '请选择发布时间' }],
  },
  {
    key: 'editor',
    title: '内容',
    showType: 'editor',
    placeholder: '请填写内容',
    validator: [{ required: true }],
  },
]
