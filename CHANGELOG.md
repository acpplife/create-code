#### 0.2.0

* 新增属性`onlyTableListMode`仅生成列表功能.
* 新增属性`showAutoIncrementIndex`支持将`primary`为`true`的主键字段设置为递增渲染.
* 优化多选时列表展示，默认不显示`"选中0项"`，选中元素后展示.
* 优化`dataSchema`中`disabled`的属性配置，若值为`true`则在编辑模式下将渲染为文本展示.
* 优化生成代码中都包含重复的`utils.js`的功能，将其移入到`components/ITableComponents`中共用.
* 修复配置`base route`之后跳转`404`的bug.
* 修复不显示新增按钮时，按钮被遮挡的bug.

#### 0.1.4

* 支持generatePath配置，可以指定代码生成的目录

#### 0.1.3

* 修复eslint获取路径问题
* 新增项目目录src文件夹存在判断

#### 0.1.2

* 修复代码生成路径错误的问题

#### 0.1.1

* 修复eslint putout文件执行路径问题

#### 0.1.0

* init project




