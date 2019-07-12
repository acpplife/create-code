module.exports = [
  {
    key: 'id',
    title: '编号',
    showInForm: false,
    primary: true
  },
  {
    key: 'name',
    title: '姓名',
    placeholder: '请输入姓名',
    validator: [{ required: true, message: '请输入姓名' }],
  },
  {
    key: 'mobile',
    title: '手机号',
    placeholder: '请输入手机号',
    validator: [{ required: true, message: '请输入手机号' }],
  },
  {
    key: 'tag',
    title: '类型',
    showType: 'multiSelect',
    placeholder: '请选择类型',
    options: 'tag',
    validator: [{ required: true, message: '请选择类型' }],
  },
  {
    key: 'gmtCreate',
    title: '创建时间',
    showInForm: false
  },
  {
    key: 'gmtModify',
    title: '修改时间',
    showInTable: false,
    showInForm: false
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
