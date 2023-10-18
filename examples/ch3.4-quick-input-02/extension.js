const vscode = require('vscode');

/**
 * @param {string[]} items
 * @returns vscode.Thenable<string|undefined>
 */
function myShowQuickPick(items) {
	const quickPick = vscode.window.createQuickPick();
	quickPick.items = items.map(label => ({label}));
	quickPick.show();

	return Promise.race([		
		new Promise(c => quickPick.onDidChangeSelection((selection) => {
			if (selection[0]) {
				c(selection[0].label);
			} else {
				c(undefined);
			}
			quickPick.hide();
		})),
		new Promise(c => quickPick.onDidAccept(() => {
			c(quickPick.value);
			quickPick.hide();
		})),
		new Promise(c => quickPick.onDidHide(() => {
			c(undefined);
		}))
	]);
}

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('extdev.createQuickPick', () => {
		myShowQuickPick(['KCL', '凹语言', 'CodeBlitz']).then(result => {
			vscode.window.showInformationMessage(`result: ${result}`);
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
