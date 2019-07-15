# create-code

### 基于umi、antd自动生成CRUD代码的工具. 

基本介绍及实现思路见[Babel 在提升前端效率的实践](https://juejin.im/post/5ce2aaea6fb9a07eac05a608)

## 特性

* 通过json文件配置在本地项目生成基础增删改查代码.
* 已应用于生产线，通用的增删改查功能相比普通开发至少提效8倍以上.
* 数据新增、编辑支持模态框及新页面（包含分组）两种展现，更多配置参考[基础配置api](https://www.yuque.com/ssisl/gabiv1/fweu9a).
* 表单基础支持业务场景常用的15种控件，详细查看[dataSchema配置api](https://www.yuque.com/ssisl/gabiv1/tv69bu).
* 仅包含初始化代码生成，所以更便于根据自己的业务场景扩展维护.
* 组件编写使用React Hooks语法.

### 安装

```bash
$ npm install create-code -g
```

### 在项目中使用

```bash
# 在项目根目录下创建schema文件夹，创建测试`normalList`文件夹。在文件夹下添加配置文件`config.js`、`dataScheme.js`、`querySchema.js`。也可以从本项目`demo-schema`中拷贝测试数据。
$ create-code add
# 选择 `react-antd-table` 类型
# 输入要生成的代码的配置文件路径，例如： `normalList`、 `../bus`
# 配置generatePath路径，默认/**/src/pages，可自定义路径，值为绝对路径
# 开始生成代码
```

### 演示

![](assets/demo.gif)

### 配置API

* [基础配置](https://www.yuque.com/ssisl/gabiv1/fweu9a)
* [筛选项配置](https://www.yuque.com/ssisl/gabiv1/wi2rga)
* [表单项配置](https://www.yuque.com/ssisl/gabiv1/tv69bu)

### 项目依赖

> 因本工具会在当前项目中生成代码，需要项目提供基础依赖。

- `react` 
- `antd` 
- `classnames` 
- `querystring` 
- `lodash` 
- `dva` 
- `umi`

**lodash、classnames可视本地项目需要添加**

> 其它依赖会根据配置项需要添加。

- `braft-editor`] 富文本内置了 预览、图片上传、颜色选择插件，详细参考[https://braft.margox.cn/demos/antd-form](https://braft.margox.cn/demos/antd-form)
- `braft-extensions` 富文本颜色选择使用sketch-color
- `antd-img-crop` 图片裁剪
- `moment` 日期格式化转化

### 常见问题：
1. 格式化代码未完全修复，需要手动修复！
eslint格式化失败，一般是因为所需依赖未找到。
2. 文件目录: (**/src)不存在，请确认文件路径是否正确.
请确认配置文件是否在根目录下的文件夹下。如：`schema/test`


### CHANGELOG

#### 0.1.0

* init project

#### 0.1.1

* 修复eslint putout文件执行路径问题

#### 0.1.2

* 修复代码生成路径错误的问题

#### 0.1.3

* 修复eslint获取路径问题
* 新增项目目录src文件夹存在判断

#### 0.1.4

* 支持generatePath配置，可以指定代码生成的目录

