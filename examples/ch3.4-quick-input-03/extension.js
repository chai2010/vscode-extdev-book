const vscode = require('vscode');
const child_process = require('child_process')

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	vscode.workspace.placeholder
	context.subscriptions.push(vscode.commands.registerCommand('extdev.multiStepInput', () => {
		const quickPick = vscode.window.createQuickPick();

		// 回车输入, ESC 取消

		// == QuickInput ==
		quickPick.title = "标题";
		quickPick.step = 1; // 从 1 开始
		quickPick.totalSteps = 2;

		// 禁止时回撤无效
		// quickPick.enabled = false;

		// 会出现一个处理或加载的动画, 其他不影响
		quickPick.busy = true;

		// == QuickPick ==

		// 输入的值, 为空时下拉列表出现
		quickPick.value = "default-value";

		// 输入的值为空时显示
		quickPick.placeholder = "输入提示";

		// 下拉列表, 依然可以手工输入
		quickPick.items = [
			{'label': 'KCL'},
			{
				'label': '凹语言',
				// 列表项也可以带图标和按钮
				'iconPath': vscode.Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
				'description':'description',
				'detail':'detail',
				'buttons': [
					{
						"iconPath":vscode.Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
						"tooltip": "tooltip1"
					},
					{
						"iconPath":vscode.Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
						"tooltip": "tooltip2"
					},
				]
			},
			{kind: vscode.QuickPickItemKind.Separator}, // 分隔符
			{'label': 'CodeBlitz'}
		];

		quickPick.buttons = [
			{
				"iconPath":vscode.Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
				"tooltip": "tooltip1"
			},
			{
				"iconPath":vscode.Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
				"tooltip": "tooltip2"
			},

			// 后退图标
			vscode.QuickInputButtons.Back
		];

		quickPick.onDidTriggerButton(btn => {
			if (btn === vscode.QuickInputButtons.Back) {
				// 后退, 怎么处理ui和消息？
			}
			vscode.window.showInformationMessage(`onDidTriggerButton: ${btn.tooltip}`);
		})

		// 多选，会出现一个<确定>按钮
		// 怎么确定？
		quickPick.canSelectMany = true;

		// 回车并不表示完成输入
		quickPick.onDidChangeValue(value => {
			if(value) {
				vscode.window.showInformationMessage(`onDidChangeValue: ${value}`);
			}
		});

		// 回车并不能触发！
		// 如何确定输入OK
		quickPick.onDidAccept(() => {
			//vscode.window.showInformationMessage(`onDidAccept: ${value}`);
			//quickPick.hide();
		});

		// 在列表选择, 回车后触发
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				vscode.window.showInformationMessage(`onDidChangeSelection: ${selection[0].label}`);
			}
		});

		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	}));
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
