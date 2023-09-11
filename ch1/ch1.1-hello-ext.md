# 1.1 你好, 插件

本节配置开发环境，用工具创建一个最简单的插件程序。先确保本地安装了 VS Code 较新的版本，同时安装 Node.js、Git工具。然后通过以下命令安装 Yeoman 和 VS Code Extension 生成工具：

```
npm install -g yo generator-code
```

安装成功后使用 `yo` 命令生成一个 JavaScript 的插件工程（打开了类型检查选项）：

```
$ yo code

     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to the Visual  │
    |--(o)--|    │   Studio Code Extension  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What type of extension do you want to create? New Extension (JavaScript)
? What's the name of your extension? helloworld
? What's the identifier of your extension? helloworld
? What's the description of your extension? 
? Enable JavaScript type checking in 'jsconfig.json'? Yes
? Initialize a git repository? No
? Which package manager to use? npm
```

生成的工程用 VS Code 单独窗口打开，其中 `extension.js` 是插件的主代码文件：

![](../images/ch1.1-01.png)

点击 F5 进入调试运行，运行时会打开一个新的 VS Code 窗口作为新插件的执行环境。在插件环境的 VS Code 中打开命令行面板，输入 “helloworld” 执行插件命令，将弹出一个信息框显示“Hello World from helloworld!”。效果如下图：

![](../images/ch1.1-02.png)

插件可以正常运行了。
