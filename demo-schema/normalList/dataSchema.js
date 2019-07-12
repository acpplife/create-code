module.exports = [
  {
    key: 'id',
    title: '编号',
    showInForm: false,
    primary: true
  },
  {
    key: 'title',
    title: '标题',
    placeholder: '请输入标题',
    validator: [{ required: true, message: '请输入标题' }],
  },
  {
    key: 'subTitle',
    title: '副标题',
    placeholder: '请输入副标题',
    validator: [{ required: true, message: '请输入副标题' }],
  },
  {
    key: 'commonUrl',
    title: '图片',
    placeholder: '请上传图片',
    showType: 'image',
    max: 1,
    validator: [{ required: true, message: '请上传一张图片' }],
  },
  {
    key: 'outerUrl',
    title: '跳转地址',
    showType: 'link',
    placeholder: '请输入跳转地址',
  },
  {
    key: 'content',
    title: '内容',
    showType: 'editor',
    placeholder: '请输入内容',
    showInTable: false
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
