# 3.6 定制菜单

VS Code的基本功能通过命令来抽血，命令可以绑定到快捷键和菜单。相比快捷键菜单是比较容易记住的入口，特别是针对不同的上下文环境可以设置不同的菜单。本届展示菜单的基本用法。

## 3.6.1 将命令绑定为菜单

要使用菜单先得定义命令，然后才能将命令的ID绑定到菜单。比如有 `extdev.showMenu` 命令：

```js
function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('extdev.showMenu', () => {
			vscode.window.showInformationMessage('extdev.showMenu')
		})
	);
}
```

然后在 `package.json` 文件de `"contributes.menus"` 定义菜单的信息：

```json
{
	"contributes": {
		"commands": [
			{ "command": "extdev.showMenu", "title": "showMenu example" }
		],
		"menus": {
			"editor/title": [
				{"command": "extdev.showMenu"}
			],
			"editor/context":[
				{"command": "extdev.showMenu"}
			],
			"view/title": [
				{"command": "extdev.showMenu"}
			]
		}
	},
}
```

这里在几个地方定义了菜单：编辑窗口的标题部分、编辑窗口的上下文菜单、视图的标题。效果如下：

![](../images/ch3.6-01.png)


## 3.6.2 菜单入口位置和条件

TODO
