# 3.2 配置界面

本章主题虽然是工作台等界面有关的内容，但是他们都和配置密切相关，比如第2章的例子通过工作区配置设置字体的大小。本节则是从插件视角讨论配置和界面的内容。

## 3.2.1 增加配置项

每个插件可以创建一个专属设置项，这个配置项会出现在设置界面展示。

```json

"contributes": {
	"configuration": {
		"type": "object",
		"title": "VS Code 插件开发",
		"properties": {
			"vscode-extdev-book.yourName": {
				"type": "string",
				"default": "guest",
				"description": "chai2010"
			},
			"vscode-extdev-book.bookTitle": {
				"type": "boolean",
				"default": true,
				"description": "vscode extension dev book"
			}
		}
	}
}
```

## 3.2.2 读写配置项

```js
const result = vscode.workspace.getConfiguration().get('vscode-extdev-book.bookTitle');

vscode.workspace.getConfiguration().update('vscode-extdev-book.bookTitle', '新的名字', true);

context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
    // 通过 getConfiguration 获取最新的值
    console.log('配置发生变化');
}));
```

