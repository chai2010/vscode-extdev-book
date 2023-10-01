# 2.5 补充说明

工作区是当前VS Code工作的最基础的上下文信息，这些上下文信息也是插件感知外部信息的基础。Task是相对独立的特性，基于工作区做最简单的配置就可以实现自定义的扩展功能。本章从工作区和Task入手，尝试以不写代码的方式感知并扩展VS Code的能力，然后逐步过渡到如何通过编程实现等价的能力。如果说第1章是以走马观花的方式体验一个插件的创建、执行和发布的流程，那么本章则是以纯插件开发者的视角切入开发一个最简单的插件。相比于第一章的Command，Task对普通用户和开发者都很友好。