const status = ['关闭', '运行中', '已上线', '异常'];

module.exports = [
  {
    key: 'key',
    title: '编号',
    placeholder: '请输入...',
    validator: [{ required: true, message: '请输入id' }],
    // defaultValue: 1,
    showInForm: false,
    primary: true
  },
  {
    key: 'name',
    title: '输入框',
    placeholder: '请输入...',
    validator: [{ required: true, message: '请输入' }],
    // defaultValue: '标题',
    group: '基础信息'
  },
  {
    key: 'textarea',
    title: '多行输入框',
    placeholder: '请输入...',
    validator: [{ required: true, message: '请输入' }],
    // defaultValue: '多行输入框',
    showType: 'textarea'
  },
  {
    key: 'image',
    title: '图片',
    showType: 'image',
    max: 5,
    // defaultValue: 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    placeholder: '请上传图片',
    validator: [{ required: true }],
    group: '其它信息'
  },
  {
    key: 'editorArea',
    title: '富文本',
    showType: 'editor',
    placeholder: '请填写内容',
    validator: [{ required: true }],
    group: '其它信息'
  },
  {
    key: 'editorArea2',
    title: '富文本2',
    showType: 'editor',
    placeholder: '请填写富文本2内容',
    group: '其它信息'
  },
  {
    key: 'file',
    title: '文件',
    showType: 'file',
    accept: '.pdf',
    sizeLimit: 20480,
    sorter: true,
    // defaultValue: 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
    placeholder: '请上传pdf格式文件, 大小不要超过20M',
    validator: [{ required: true, message: '至少选择一个文件' }],
    group: '其它信息'
  },
  {
    key: 'inputNumber',
    title: '数字',
    showType: 'inputNumber',
    placeholder: '请输入数字',
    // defaultValue: 23,
    min: 10,
    validator: [{ required: true, message: '请输入数字' }]
  },
  {
    key: 'select',
    title: '下拉框',
    options: 'dicData',
    placeholder: '请选择...',
    showType: 'select',
    filters: status.map((item, i) => ({ value: i, text: item })),
    validator: [{ required: true }],
    // defaultValue: ["0"]
  },
  {
    key: 'multiSelect',
    title: '多选下拉框',
    options: [{ key: "0", value: '关闭' }, { key: "1", value: '运行中' }],
    placeholder: '请选择...',
    showType: 'multiSelect',
    validator: [{ required: true }],
    // defaultValue: ["0", "1"],
    showInTable: false
  },
  {
    key: 'radio',
    title: '单选框',
    options: [{ key: "0", value: '关闭' }, { key: "1", value: '运行中' }],
    showType: 'radio',
    // defaultValue: "0",
    showInTable: false,
    validator: [{ required: true }],
    group: '其它信息'
  },
  {
    key: 'checkbox',
    title: '复选框',
    options: [{ key: "0", value: '关闭' }, { key: "1", value: '运行中' }],
    showType: 'checkbox',
    // defaultValue: ["0", "1"],
    validator: [{ required: true }],
    group: '其它信息'
  },
  {
    key: 'datePicker',
    title: '日期选择',
    placeholder: '请选择日期',
    showType: 'datePicker',
    format: 'YYYY-MM-DD',
    validator: [{ required: true }],
    // defaultValue: "2019-04-20",
    group: '基础信息'
  },
  {
    key: 'rangePicker',
    title: '日期范围选择',
    placeholderBegin: '开始日期',
    placeholderEnd: '结束日期',
    // defaultValueBegin: "2019-02-20",
    // defaultValueEnd: "2019-04-28",
    format: 'YYYY-MM-DD',
    showType: 'rangePicker',
    showInTable: false,
    validator: [{ required: true }],
    group: '基础信息'
  },
  {
    key: 'cascader',
    title: '级联选择',
    placeholder: '请选择城市',
    options: 'treeData',
    showType: 'cascader',
    validator: [{ required: true }],
    // defaultValue: ['zhejiang', 'hangzhou', 'xihu']
  },
  {
    key: '__actions',
    title: '操作',
    width: 130,
    actions: [
      {
        name: '查看',
        type: 'detail'
      },
      {
        name: '编辑',
        type: 'update',
      },
      { type: 'newLine' },
      {
        name: '删除',
        type: 'delete',
      },
    ]
  }
]
