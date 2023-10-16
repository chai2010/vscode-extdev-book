# 3.4 常用输入框

输入信息是软件和人交换的必要手段，通过界面可以极大改进用户的输入体验。本节讨论常用输入框的使用。

## 3.4.1 列表输入框

最简单的是列表输入框，在2.3.5节我们已经见过Task的配置输入参数采用的列表输入的方式。列表可以通过`vscode.window.showQuickPick()`函数实现，其签名如下：

```ts
interface QuickPickOptions {
    title?: string;
    placeHolder?: string;
    onDidSelectItem?(item: QuickPickItem | string): any;
    // 其他省略
}

function showQuickPick(
    items: readonly string[],
    options?: QuickPickOptions
): Thenable<string>;
```

第一个参数是列表选项，第二个参数是`QuickPickOptions`类型表示输入框的各种配置。配置中比较常用的有`title`标题、`placeHolder`输入提示和`onDidSelectItem`切换选择时的回调函数等。

下面是一个例子：

```js
function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extdev.showQuickPick', () => {
            vscode.window.showQuickPick(
                ['KCL', '凹语言', 'CodeBlitz'],
                {
                    placeHolder: 'KCL, 凹语言 or CodeBlitz',
                    onDidSelectItem: item =>
                        vscode.window.showInformationMessage(
                            `焦点切换: ${item}`
                        )
                }
            ).then((result) => {
                vscode.window.showInformationMessage(`选中: ${result}`);
            });
        })
    );
}
```

显示效果如下：

![](../images/ch3.4-01.png)

## 3.4.2 通用输入框

列表适合有固定选择的输入项。如果是更普通的输入，可以用`vscode.window.showInputBox()`函数，其函数签名如下：

```ts 
interface InputBoxOptions {
    title?: string;
    value?: string;
    placeHolder?: string;
    password?: boolean;
    validateInput?(value: string): string;
    // 其他省略
}

function showInputBox(options?: InputBoxOptions): Thenable<string>;
```

因为没有后续列表项，参数主要是`InputBoxOptions`配置信息，其标题、默认值和提示信息等基础内容和`QuickPickOptions`相似。但是输入框不仅仅可以设置密码输入模式，还可以通过`validateInput`函数验证输入的合法性。

下面是一个例子：

```js
function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extdev.showInputBox', () => {
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
        })
    );
}
```

显示效果如下：


![](../images/ch3.4-02.png)

遇到无效的输入：

![](../images/ch3.4-03.png)

## 3.4.3 认识 `QuickInput` 对象

`showQuickPick`和`showInputBox`都属于包装的用户更友好的API，但是缺乏一定的灵活性。他们底层都是通过`createQuickPick`个`createInputBox`两个函数实现，返回的是`QuickPick`和`InputBox`对象，这两个对象的基类都是`QuickInput`对象。`QuickInput`对象的定义如下：

```ts
interface QuickInput {
    title: string | undefined;      // An optional title.
    step: number | undefined;       // An optional current step count.
    totalSteps: number | undefined; // An optional total step count.

    // If the UI should allow for user input. Defaults to true.
    enabled: boolean;
    // If the UI should show a progress indicator. Defaults to false.
    busy: boolean;
    // If the UI should stay open even when loosing UI focus. Defaults to false.
    ignoreFocusOut: boolean;

    show(): void;
    hide(): void;
    onDidHide: Event<void>;
    dispose(): void;
}
```

属性部分主要有`title`标题信息和`step`、`totalSteps`表示的第几步骤等信息。方法部分主要是显示和隐藏控制、隐藏时的回调函数和释放资源。

下面是派生出来的`QuickPick`和`InputBox`对象：

```ts
interface QuickPick<T extends QuickPickItem> extends QuickInput {
    // Current value of the filter text.
    value: string;

    // Optional placeholder shown in the filter textbox when no filter has been entered.
    placeholder: string | undefined;

    // Items to pick from. This can be read and updated by the extension.
    items: readonly T[];

    // An event signaling when the selected items have changed.
    readonly onDidChangeSelection: Event<readonly T[]>;

    // 更多信息暂省略
}

interface InputBox extends QuickInput {
    // Current input value.
    value: string;

    // Optional placeholder shown when no value has been input.
    placeholder: string | undefined;

    // If the input value should be hidden. Defaults to false.
    password: boolean;

    // An event signaling when the value has changed.
    readonly onDidChangeValue: Event<string>;
    // An event signaling when the user indicated acceptance of the input value.
    readonly onDidAccept: Event<void>;

    // 更多信息暂省略
}
```

`QuickInput`无法直接创建，只能创建派生的`QuickPick`和`InputBox`对象：

```ts 
function createQuickPick<T extends QuickPickItem>(): QuickPick<T>;
function createInputBox(): InputBox;
```

下面是通过`createQuickPick`函数实现类似`showQuickPick`例子的效果：

```js
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
            }
            quickPick.hide();
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    }));
}
```

对于`showInputBox`例子的输入和合法性校验，可以通过`createInputBox`和`onDidChangeValue`函数和回调配合实现：

```js
function activate(context) {
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
            inputBox.dispose();
        });

        inputBox.onDidHide(() => inputBox.dispose());
        inputBox.show();
    }));
}
```

此外输入框还可以在界面定制更多的按钮和图标，这里暂不详细展开。

## 3.4.4 小结

本节讨论的`QuickInput`输入框是定制性比较强的输入UI组件，可以容易实现多步骤输入等深度定制的特性，用户可以根据自己需要同时借鉴社区场景的代码方式再自行探索。
