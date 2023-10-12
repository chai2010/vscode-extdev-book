const vscode = require('vscode');
const child_process = require('child_process')

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extdev.showMsgbox', () => {
		vscode.window.setStatusBarMessage('cmd: extdev.showMsgbox', 3000);

		vscode.window.showInformationMessage('showInformationMessage');
		vscode.window.showWarningMessage('showWarningMessage');
		vscode.window.showErrorMessage('showErrorMessage').then(result => {
			console.log(`showErrorMessage: result=${result}`);
		});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extdev.showMsgboxOpt', () => {
		vscode.window.setStatusBarMessage('cmd: extdev.showMsgboxOpt');

		vscode.window.showInformationMessage(
			'请选择要打开的网页', {'modal':true, 'detail': "更多信息"},
			{"title":"Retry"}, {"title":"Open Log"}
		).then(result => {
			console.log(`result: ${result.title}`);
		});
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extdev.openPage', () => {
		vscode.window.setStatusBarMessage('cmd: extdev.openPage');

		vscode.window.showInformationMessage(
			"KCL", "凹语言", "CodeBlitz"
		).then(result => {
			if(result === 'KCL') {
				child_process.exec(`open 'https://kcl-lang.io'`);
			} else if (result == '凹语言') {
				child_process.exec(`open 'https://wa-lang.org'`);
			}else  {
				child_process.exec(`open 'https://codeblitz.cloud.alipay.com/zh'`);
			}
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
