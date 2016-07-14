## 目录说明
* config.json
  此文件为接口配置文件默认有4个字段（此处请自行修改对应环境接口路径）：dev、test、repro、pro，代表开发环境、测试环境、准生产环境、生产环境
* gulpfile.babel.js
  此文件为gulp自动换化打包文件及静态服务，打包含4种命令: gulp --dev、gulp --test、gulp --repro、 gulp --pro，代表打包开发环境、打包测试环境、打包准生产环境、打包生产环境
* package.json
  此文件为gulp、ES6转ES5、包括开发所依赖的模块配置文件
* webpack.config.babel.js
  此文件为webpack开发打包配置文件
* src目录
  此目录为开发目录，也是线上开发目录，编译完成后的文件应该和线上文件一致，上线时也已此目录为打包源目录


### 开发流程说明
* 每次开发都得从主干（master）上新建分支开发
* 新建分支规则是：一个问题一个分支，一个功能一个分支，多个相关联的问题一个分支
* 分支只有在通过准生产环境的测试才能提交到主干（master）并申请合并


### 上线邮件模板
git 地址 ：git@10.100.146.60:fuqianla-static-h5sdk.git
分支：matser
目录：dest/
影响：某某上线
服务器地址：101.200.161.156


### 注意事项
  + gulpfile.babel.js文件轻易不要动，如果有bug或者要修改，请前告知我（康文辉）然后审核后是否修改调整
  + 该目录（指分支目录，其包含：config.json、gulpfile.babel.js、package.json、webpack.config.babel.js、src）中所有文件在上线时，一定要提交到开发主干（master）上并申请合并，在合并之后再从主干（master）上新建上线分支打包上线。如上线后删除该分支，之后新建分支进行下个开发任务。