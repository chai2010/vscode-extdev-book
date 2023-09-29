# 2.3 配置信息

<!--
https://code.visualstudio.com/api/references/contribution-points#contributes.configuration

读取配置
const result = vscode.workspace.getConfiguration().get('...');

修改配置
vscode.workspace.getConfiguration().update('...', 'value', true);

// 配置发生变化
context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
    // 读取配置，判断和上次是否相等
}));

工程路径
vscode.workspace.workspaceFolders

-->