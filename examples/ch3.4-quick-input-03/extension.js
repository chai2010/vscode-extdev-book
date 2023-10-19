const vscode = require('vscode');

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extdev.moreQuickPick', () => {
		const quickPick = vscode.window.createQuickPick();
		quickPick.show();

		quickPick.title = "标题";
		quickPick.step = 1; // 从 1 开始
		quickPick.totalSteps = 2;

		// 输入的值为空时显示
		quickPick.placeholder = "输入提示";

		// 会出现一个处理或加载的动画, 其他不影响
		quickPick.busy = true;

		// 输入框按钮

		/** @type {vscode.QuickInputButton} */
		const btnRedAdd = {
			"iconPath":vscode.Uri.file(context.asAbsolutePath('icon-add-red.svg')),
			"tooltip": "红色图标"
		};

		/** @type {vscode.QuickInputButton} */
		const btnBlueAdd = {
			"iconPath": vscode.Uri.file(context.asAbsolutePath('icon-add-blue.svg')),
			"tooltip": "蓝色图标"
		};

		quickPick.buttons = [
			vscode.QuickInputButtons.Back,
			btnRedAdd, btnBlueAdd
		];

		// 下拉列表, 依然可以手工输入
		quickPick.items = [
			{'label': 'KCL', 'detail':'云原生配置语言'},
			{'label': '凹语言', 'detail':'面向 WASM 设计'},
			
			{kind: vscode.QuickPickItemKind.Separator}, // 分隔符

			{'label': 'CodeBlitz', 'detail':'纯前端 IDE 基础框架'}
		];

		// 点击确认按钮
		quickPick.onDidTriggerButton(btn => {
			if (btn === vscode.QuickInputButtons.Back) {
				vscode.window.showInformationMessage(`onDidTriggerButton: Back`);
			} else {
				vscode.window.showInformationMessage(`onDidTriggerButton: ${btn.tooltip}`);
			}
			quickPick.hide();
		})

		// 手工输入时, 回车确认
		quickPick.onDidAccept(() => {
			vscode.window.showInformationMessage(`onDidAccept: ${quickPick.value}`);
			quickPick.hide();
		});

		// 在列表选择, 回车后触发
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				vscode.window.showInformationMessage(`onDidChangeSelection: ${selection[0].label}`);
			}
			quickPick.hide();
		});

		quickPick.onDidHide(() => quickPick.dispose());
	}));
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
