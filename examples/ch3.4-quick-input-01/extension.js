const vscode = require('vscode');

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	// 列表选择
	context.subscriptions.push(vscode.commands.registerCommand('extdev.showQuickPick', () => {
		vscode.window.showQuickPick(['KCL', '凹语言', 'CodeBlitz'], {
			placeHolder: 'KCL, 凹语言 or CodeBlitz',
			onDidSelectItem: item => vscode.window.showInformationMessage(`焦点切换: ${item}`)
		}).then((result) => {
			vscode.window.showInformationMessage(`选中: ${result}`);
		});
	}));
	// 输入框
	context.subscriptions.push(vscode.commands.registerCommand('extdev.showInputBox', () => {
		vscode.window.showInputBox({
			value: 'abc',
			placeHolder: 'For example: abc. But not: 123',
			validateInput: text => {
				vscode.window.showInformationMessage(`Validating: ${text}`);
				return text === '123' ? 'Not 123!' : null;
			}
		}).then((result) => {
			vscode.window.showInformationMessage(`Got: ${result}`);
		});
	}));
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
