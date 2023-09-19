# 2.3 Task进阶

前一节一节展示了Task的基本用法和流程，本节我们尝试通过VS Code自身的能力简化Task启动，同时希望给Task增加更多的灵活性。

## 2.3.1 Task配置规范

task.js文件对应的数据结构由`TaskConfiguration`定义：

```ts
interface TaskConfiguration {
  version: '2.0.0';
  tasks?: TaskDescription[];
}
```

首先是Task文件对应的规范版本号，然后是`tasks`定义的任务列表（此外还有`windows`、`osx`、`linux`分别对应不同系统的任务）。每个Task由`TaskDescription`定义：

```ts
interface TaskDescription {
  label: string; // The task's name
  type: 'shell' | 'process';
  command: string;
  args?: string[];
  options?: CommandOptions;
  group?: 'build' | 'test' | { kind: 'build' | 'test'; isDefault: boolean };
  dependsOn?: string[];
}
```

前三个`label`、`type`、`command`是必须提供的，分别定义任务的名称、任务类型和对应的命令。可选的`args`定义命令行的参数，可选的`options`定义命令的上下文环境，可选的`group`定义分组（目前有`build`和`test`），`dependsOn`则定义Task之间的依赖关系。

命令后的上下文由`CommandOptions`定义：

```ts
export interface CommandOptions {
  cwd?: string;
  env?: { [key: string]: string };
}
```

主要是当前工作目录和环境变量。

<!--

## 2.3.2 更复杂一点的Task

all/build/pack/clean

## 2.3.1 绑定快捷键

https://github.com/microsoft/vscode/issues/108051

## 2.3.2 输入参数

输出参数类别

后台task运行，怎么停止？

## 2.3.3 依赖关系

```
    {
      "label": "Build",
      "dependsOn": ["Client Build", "Server Build"]
    }

```

多个是顺序吗，全部执行的时候

找一个案例

1. 获取二进制，生成文档，打包


快捷键和分组



默认的几类命令。

-->

<!--
https://code.visualstudio.com/docs/editor/tasks

https://code.visualstudio.com/docs/editor/tasks-appendix
-->
