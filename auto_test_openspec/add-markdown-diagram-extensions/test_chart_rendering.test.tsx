import React from 'react';
import { render, screen } from '@testing-library/react';
import MarkdownPreview from '../../src/components/MarkdownPreview';
import mermaid from 'mermaid';

describe('MarkdownPreview 图表渲染测试', () => {
  test('渲染 Mermaid 流程图', async () => {
    const markdown = `\`\`\`mermaid
graph TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作]
    B -->|否| D[结束]
    C --> D
\`\`\``;

    render(<MarkdownPreview markdown={markdown} />);

    // 验证 mermaid.run() 被调用
    expect(mermaid.run).toHaveBeenCalled();
  });

  test('渲染 Mermaid 时序图', async () => {
    const markdown = `\`\`\`mermaid
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 发送请求
    系统->>系统: 处理请求
    系统-->>用户: 返回响应
\`\`\``;

    render(<MarkdownPreview markdown={markdown} />);

    // 验证 mermaid.run() 被调用
    expect(mermaid.run).toHaveBeenCalled();
  });

  test('渲染 PlantUML 类图', async () => {
    const markdown = `\`\`\`plantuml
@startuml
class Animal {
  - name: String
  - age: int
  + makeSound(): void
}

class Dog extends Animal {
  + bark(): void
}

class Cat extends Animal {
  + meow(): void
}

Animal <|-- Dog
Animal <|-- Cat
@enduml
\`\`\``;

    render(<MarkdownPreview markdown={markdown} />);

    // 验证 PlantUML 图片是否渲染
    const diagramElements = document.querySelectorAll('img');
    expect(diagramElements.length).toBeGreaterThan(0);
    
    // 验证图片 src 包含 PlantUML 服务器地址
    const plantUmlImage = diagramElements[0] as HTMLImageElement;
    expect(plantUmlImage.src).toContain('plantuml');
  });

  test('图表与其他内容混合渲染', async () => {
    const markdown = `# 标题

这是一个包含图表的文档。

\`\`\`mermaid
graph TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作]
    B -->|否| D[结束]
    C --> D
\`\`\`

## 表格

| 功能 | 描述 |
| --- | --- |
| 图表 | 支持 Mermaid 和 PlantUML |

\`\`\`typescript
console.log("Hello, World!");
\`\`\``;

    render(<MarkdownPreview markdown={markdown} />);

    // 验证页面包含标题
    const title = screen.getByText('标题');
    expect(title).toBeInTheDocument();

    // 验证 mermaid.run() 被调用
    expect(mermaid.run).toHaveBeenCalled();
  });
});
