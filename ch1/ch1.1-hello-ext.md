# 1.1 你好, 插件

本节配置开发环境，用工具创建一个最简单的插件程序。

## 1.1.1 安装工具

先确保本地安装了 VS Code 较新的版本，同时安装 Node.js、Git工具。然后通过以下命令安装 Yeoman 和 VS Code Extension 生成工具：

```
npm install -g yo generator-code
```

安装成功后使用 `yo` 命令生成一个 TypeScript 的插件工程：

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

? What type of extension do you want to create? (Use arrow keys)
❯ New Extension (TypeScript) 
  New Extension (JavaScript) 
  New Color Theme 
  New Language Support 
  New Code Snippets 
  New Keymap 
  New Extension Pack 
  New Language Pack (Localization) 
  New Web Extension (TypeScript) 
  New Notebook Renderer (TypeScript)
```
