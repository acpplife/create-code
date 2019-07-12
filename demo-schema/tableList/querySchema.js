module.exports = [
  {
    key: 'name',
    title: '默认字段',
    placeholder: '请输入默认字段',
    showInSimpleMode: false
    // defaultValue: '我是默认值'
  },
  {
    key: 'nameWithAddon',
    title: '包含标签',
    placeholder: '请输入值',
    addonBefore: "user",
    addonAfter: '.me',
  },
  {
    key: 'number',
    title: '数字',
    placeholder: '请输入数字',
    showType: 'inputNumber',
    // defaultValue: 23
  },
  {
    key: 'select',
    title: '下拉框',
    options: 'dicData',
    placeholder: '请选择...',
    showType: 'select',
    // defaultValue: ["0"]
  },
  {
    key: 'multiSelect',
    title: '多选下拉框',
    options: [{ key: "0", value: '关闭' }, { key: "1", value: '运行中' }],
    placeholder: '请选择...',
    showType: 'multiSelect',
    // defaultValue: ["0", "1"]
  },
  {
    key: 'radio',
    title: '单选框',
    options: [{ key: "0", value: '关闭' }, { key: "1", value: '运行中' }],
    showType: 'radio',
    // defaultValue: "0"
  },
  {
    key: 'checkbox',
    title: '复选框',
    options: [{ key: "0", value: '关闭' }, { key: "1", value: '运行中' }],
    showType: 'checkbox',
    // defaultValue: ["0", "1"]
  },
  {
    key: 'datePicker',
    title: '日期选择',
    placeholder: '请选择日期',
    showType: 'datePicker',
    format: 'YYYY-MM-DD',
    // defaultValue: "2019-04-20"
  },
  {
    key: 'rangePicker',
    title: '日期范围选择',
    placeholderBegin: '开始日期',
    placeholderEnd: '结束日期',
    // defaultValueBegin: "2019-02-20",
    // defaultValueEnd: "2019-04-28",
    format: 'YYYY-MM-DD',
    showType: 'rangePicker'
  },
  {
    key: 'cascader',
    title: '级联选择',
    placeholder: '请选择城市',
    options: 'treeData',
    showType: 'cascader',
    // defaultValue: ['zhejiang', 'hangzhou', 'xihu']
  },
];
