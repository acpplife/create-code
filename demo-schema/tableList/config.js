module.exports = {
  namespace: 'tableList',
  showExport: true, // 是否显示导出
  showCreate: true, // 是否显示创建
  showDetail: true, // 是否显示查看
  showUpdate: true, // 是否显示修改
  showDelete: true, // 是否显示删除
  showBatchDelete: true, // 是否显示批量删除: multiSelection 需为 true
  multiSelection: false, // 是否允许多选
  defaultDateFormat: 'YYYY-MM-DD', // 日期格式
  newRouterMode: true,
  upload: {  // 上传相关配置
    uploadUrl: '/manage/pic/upload',
    imageSizeLimit: 1500,  // 默认的图片大小限制, 单位KB

    fileSizeLimit: 10240,  // 默认的文件大小限制, 单位KB
  },
  pagination: {
    pageSize: 10,
    showSizeChanger: false,
    pageSizeOptions: ['10', '20', '50', '100'],
    showQuickJumper: false,
    showTotal: true,
  },
  dictionary: [
    {
      key: 'dicData',
      url: '/api/getDicData'
    },
    {
      key: 'treeData',
      url: '/api/getTreeData'
    },
  ]
}
