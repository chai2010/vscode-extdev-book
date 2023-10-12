# 1.2 理解插件代码

本节简要分析生成的插件工程的结构，便于以后手工方式也可以轻松构建出插件工程。

## 1.2.1 插件的目录结构

插件目录的重要文件布局如下：

```
├── .vscode
│   └── launch.json     // 执行和调试配置
├── README.md           // 说明文件
├── extension.js        // 插件代码主文件
└── package.json        // 包信息
```

其中只有 `extension.js` 和 `package.json` 是插件工程必须要的文件，其他省略的文件都不是必须的。

## 1.2.2 `package.json` 工程文件

VS Code 插件本质上是一个 Node.js 工程，精简后的`package.json`内容如下：

```json
{
	"name": "helloworld",
	"description": "",
	"version": "0.0.1",
	"engines": { "vscode": "^1.82.0" },
	"main": "./extension.js",
	"contributes": {
		"commands": [
			{ "command": "helloworld.helloWorld", "title": "Hello World" }
		]
	},
	"devDependencies": {
		"@types/vscode": "^1.82.0"
	}
}
```

除了 Node.js 工程中常见的 `name`、`version`、`main` 等属性外，`engines`定义了VS Code的最小版本，`contributes` 指定了插件的扩展能力。第一个插件功能比较简单，在开发环境的依赖只有 `@types/vscode`，用于 VS Code 相关 API 的类型提示。

## 1.2.3 插件的入口文件 

我们现在看下插件的主体模块，对应 `extension.js` 文件代码：

```js
const vscode = require('vscode');

function activate(context /** @param {vscode.ExtensionContext} */ ) { ... }
function deactivate() {}

module.exports = {activate, deactivate}
```

插件模块有2个特殊的函数：`activate` 是在插件被第一次激活时被调用，`deactivate` 是插件被卸载或者禁用时调用。因此 `activate` 函数类似很多编程语言的 `main` 函数，是插件的入口函数。`activate` 入口函数有一个 `vscode.ExtensionContext` 类型的 `context` 参数，表示VS Code 实例的上下文环境。

## 1.2.4 启动配置

插件工程初始化完成后，我们通过 F5 进入调试执行模式。启动方式在 `.vscode/launch.json` 文件定义：
```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Run Extension",
			"type": "extensionHost",
			"request": "launch",
			"args": ["--extensionDevelopmentPath=${workspaceFolder}"]
		}
	]
}
```

其中指明了以 `extensionHost` 插件宿主模式启动。传给插件进程的指定了 `--extensionDevelopmentPath` 命令行参数，表示设置当前目录为插件代码的开发目录。

## 1.2.5 调试日志

在开发阶段调试时可以通过 `console.log` 可以在在调试信息，在宿主的VS Code窗口可以看到输出日志：

```js
/** @param {vscode.ExtensionContext} context */
function activate(context) {
  console.log('Congratulations, your extension "helloworld" is now active!');
  ...
}
```

控制台日志显示如下：

![](../images/ch1.2-01.png)

## 1.2.6 插件的逻辑分析

插件激活时模块的`activate`被调用进行初始化：，

```js
function activate(context) {
  ...
  let disposable = vscode.commands.registerCommand('helloworld.helloWorld', function () {
    vscode.window.showInformationMessage('Hello World from helloworld!');
  });
  context.subscriptions.push(disposable);
}
```

首先用 `vscode.commands.registerCommand` 注册一个插件命令，然后通过 `context.subscriptions.push(disposable)` 注册到 VS Code 实例上下文中。注册的命令对应的是一个闭包函数，是通过调用`vscode.window.showInformationMessage("...")`函数以消息框的形式显示一个文本信息。

插件的命令名称类似静态信息，需要在`package.json`提前注册，这样新命令对应的插件在激活的时候才真正执行`activate`函数初始化。`package.json` 文件内容如下：

```json
{
  "name": "helloworld",
  "main": "./extension.js",
  "engines": {
    "vscode": "^1.82.0"
  },
  "contributes": {
    "commands": [{
      "command": "helloworld.helloWorld",
      "title": "Hello World"
    }]
  },
  ...
}
```

其中`name`是插件的名字。`main`指定了主程序入口，`engines.vscode`制定了VS Code的最低版本，如果要对外发布还需要设置`publisher`表示发布者的ID，`<publisher>.<name>`会组成插件全局唯一ID。插件的能力在`contributes`属性中静态描述，其中`command`对应注册的命令ID和标题。

当插件命令被执行时，在闭包函数通过 `vscode.window.showInformationMessage('...')` 函数调用显示一个弹窗信息。如图所示：

![](../images/ch1.2-02.png)

插件的工作顺序大致为：调用 `activate` 函数激活插件，`vscode.commands.registerCommand` 将函数包装为命令，`context.subscriptions.push` 注册命令，用户执行插件命令时调用被命令包装的函数。

