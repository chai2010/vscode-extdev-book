const vscode = require('vscode');
const child_process = require('child_process')

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extdev.createQuickPick', () => {
		const quickPick = vscode.window.createQuickPick();

		quickPick.items = [
			{'label': 'KCL'},
			{'label': '凹语言'},
			{'label': 'CodeBlitz'}
		];

		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				vscode.window.showInformationMessage(`selection: ${selection[0].label}`);
				quickPick.hide();
			}
		});

		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extdev.createInputBox', () => {
		const inputBox = vscode.window.createInputBox();

		inputBox.value = "abc";
		inputBox.placeholder = 'For example: abc. But not: 123';

		inputBox.onDidChangeValue(text => {
			if(text === '123') {
				inputBox.validationMessage = "Not 123";
			} else {
				inputBox.validationMessage = "";
			}
		});
		inputBox.onDidAccept(() => {
			vscode.window.showInformationMessage(`input: ${inputBox.value}`);
			inputBox.hide();
		});

		inputBox.onDidHide(() => inputBox.dispose());
		inputBox.show();
	}));
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
