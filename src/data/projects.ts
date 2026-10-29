import type { Locale } from '../i18n';
export interface ProjectCopy {
  category: string;
  tagline: string;
  description: string;
  overview: string;
  status: string;
  capabilities: { title: string; text: string }[];
  workflow: string[];
  useCases: string[];
}
export interface ProjectHighlight {
  value: string;
  label: Record<Locale, string>;
  detail: Record<Locale, string>;
  sourceUrl: `https://${string}`;
}
export interface Project {
  id: string;
  displayName: string;
  accent: string;
  tags: string[];
  repositoryUrl?: string;
  documentationUrl?: string;
  releaseUrl?: string;
  version?: string;
  distributionUrl?: string;
  highlights?: ProjectHighlight[];
  license: Record<Locale, string>;
  content: Record<Locale, ProjectCopy>;
}
export const verifiedOn = '2026-10-30';
export const projects: Project[] = [
  {
    id: 'hyperraft',
    highlights: [
      {
        value: '21',
        label: {
          en: 'Java compilation target',
          'zh-CN': 'Java 编译目标',
        },
        detail: {
          en: 'The public 0.1.0 parent POM targets Java 21. Check your application environment before integration.',
          'zh-CN':
            '公开的 0.1.0 parent POM 使用 Java 21 编译目标。接入前请检查应用运行环境。',
        },
        sourceUrl:
          'https://repo.maven.apache.org/maven2/com/smartscity/hyperraft-parent/0.1.0/hyperraft-parent-0.1.0.pom',
      },
      {
        value: '0.1.0',
        label: {
          en: 'Published Maven version',
          'zh-CN': '已公开的 Maven 版本',
        },
        detail: {
          en: 'Client metadata is available on Maven Central under com.smartscity:hyperraft-client.',
          'zh-CN':
            'Maven Central 已公开 com.smartscity:hyperraft-client 的构件元数据。',
        },
        sourceUrl:
          'https://central.sonatype.com/artifact/com.smartscity/hyperraft-client',
      },
      {
        value: '2.0',
        label: {
          en: 'Apache license declaration',
          'zh-CN': 'Apache 许可版本',
        },
        detail: {
          en: 'The published parent POM declares Apache License, Version 2.0. This is package metadata, not a performance certification.',
          'zh-CN':
            '公开 parent POM 声明 Apache License, Version 2.0。这里说明构件元数据，不代表性能认证。',
        },
        sourceUrl:
          'https://repo.maven.apache.org/maven2/com/smartscity/hyperraft-parent/0.1.0/hyperraft-parent-0.1.0.pom',
      },
    ],
    displayName: 'HyperRaft',
    accent: 'var(--blue)',
    tags: ['Consensus', 'Replication', 'Java 21'],
    version: 'v0.1.0',
    distributionUrl:
      'https://central.sonatype.com/artifact/com.smartscity/hyperraft-client',
    license: {
      en: 'Apache-2.0 declared in published POM',
      'zh-CN': '公开 POM 声明 Apache-2.0',
    },
    content: {
      en: {
        category: 'DISTRIBUTED INFRASTRUCTURE',
        tagline: 'A shared truth. A stronger foundation.',
        description:
          'Exploring the foundations of distributed consensus and replication.',
        overview:
          'Distributed systems need a way to agree on an ordered history. HyperRaft is a Smartscity project focused on consensus and replication infrastructure. Version 0.1.0 client metadata is published on Maven Central with a Java 21 compilation target. Public package metadata establishes availability, not throughput or latency guarantees; the model below illustrates the consensus idea.',
        status: 'Maven Central · 0.1.0 metadata verified',
        capabilities: [
          {
            title: 'A common history',
            text: 'The project’s stated focus is distributed consensus and replication. Public technical documentation will establish its exact guarantees.',
          },
          {
            title: 'Understand the agreement',
            text: 'Our interactive teaching model shows proposal, replication, majority acknowledgment, and commit progression.',
          },
          {
            title: 'Evidence before claims',
            text: 'Performance figures, supported transports, and storage guarantees will be published only with verifiable documentation.',
          },
        ],
        workflow: ['Propose', 'Replicate', 'Majority acknowledgment', 'Commit'],
        useCases: ['Understanding consensus', 'Exploring replicated logs'],
      },
      'zh-CN': {
        category: '分布式基础设施',
        tagline: '达成共同认知，构筑可靠基础。',
        description: '探索分布式共识与复制的基础能力。',
        overview:
          '分布式系统需要对有序的历史记录达成一致。HyperRaft 是 Smartscity 聚焦共识与复制基础设施的项目。Maven Central 已公开 0.1.0 客户端构件元数据，编译目标为 Java 21。公开包信息说明构件可查，不等同于吞吐或延迟保证；下方模型用于解释共识原理。',
        status: 'Maven Central · 0.1.0 元数据已核实',
        capabilities: [
          {
            title: '共同的历史',
            text: '项目定位为分布式共识与复制。具体运行保证需以相应版本的技术文档为准。',
          },
          {
            title: '理解如何达成一致',
            text: '交互教学模型展示提议、复制、多数确认与提交推进。',
          },
          {
            title: '让证据先于结论',
            text: '性能数据、传输支持和存储保证，将在具备可验证资料后介绍。',
          },
        ],
        workflow: ['提议', '复制', '多数确认', '提交'],
        useCases: ['理解共识原理', '探索复制日志'],
      },
    },
  },
  {
    id: 'polarbear',
    highlights: [
      {
        value: '3',
        label: {
          en: 'Editing layouts',
          'zh-CN': '编辑布局',
        },
        detail: {
          en: 'Editor, preview, or split view. Choose the workspace that fits the moment.',
          'zh-CN': '编辑、预览、分栏三种布局，按当前写作需要切换。',
        },
        sourceUrl:
          'https://github.com/smartscity/polarbear/blob/main/README.md',
      },
      {
        value: '2',
        label: {
          en: 'Diagram languages',
          'zh-CN': '图表语言',
        },
        detail: {
          en: 'Mermaid and PlantUML keep system diagrams alongside your Markdown.',
          'zh-CN':
            '通过 Mermaid 和 PlantUML，让系统图表与 Markdown 文档放在一起。',
        },
        sourceUrl:
          'https://github.com/smartscity/polarbear/blob/main/README.md',
      },
      {
        value: '2',
        label: {
          en: 'Desktop release targets',
          'zh-CN': '桌面发布平台',
        },
        detail: {
          en: 'Public releases provide a macOS universal DMG and a Windows x64 installer.',
          'zh-CN': '公开发行提供 macOS 通用 DMG 与 Windows x64 安装包。',
        },
        sourceUrl:
          'https://github.com/smartscity/polarbear/releases/tag/v0.10.12',
      },
    ],
    displayName: 'Polarbear',
    accent: 'var(--warm)',
    tags: ['Markdown', 'macOS · Windows'],
    repositoryUrl: 'https://github.com/smartscity/polarbear',
    documentationUrl:
      'https://github.com/smartscity/polarbear/blob/main/docs/README.md',
    releaseUrl: 'https://github.com/smartscity/polarbear/releases',
    version: 'v0.10.12',
    license: { en: 'MIT OR Apache-2.0', 'zh-CN': 'MIT 或 Apache-2.0' },
    content: {
      en: {
        category: 'A PLACE FOR YOUR WORDS',
        tagline: 'Less between you and your next idea.',
        description:
          'A local-first Markdown workspace for writing, diagrams, and Git-based knowledge.',
        overview:
          'Your words deserve a home that keeps you close to the work. Polarbear brings Markdown editing, live preview, and diagrams into a desktop workspace, with GitHub and GitLab document workflows. Your local files remain at the center.',
        status: 'Public release · macOS & Windows',
        capabilities: [
          {
            title: 'Write in Markdown',
            text: 'Choose from 3 layouts: editor-only, preview-only, or split view. Keep local Markdown and its live rendering side by side.',
          },
          {
            title: 'Think in diagrams',
            text: 'Use Mermaid and PlantUML to express relationships and flows alongside your writing.',
          },
          {
            title: 'Connect your knowledge',
            text: 'Work with GitHub and GitLab documents. Polarbear Vocab is a separate app with a documented macOS integration.',
          },
        ],
        workflow: [
          'Open a workspace',
          'Write & preview',
          'Add diagrams',
          'Work with Git',
        ],
        useCases: [
          'Technical writing',
          'Project documentation',
          'Personal knowledge',
        ],
      },
      'zh-CN': {
        category: '让文字有处安放',
        tagline: '让你与下一个想法，更近一点。',
        description:
          '本地优先的 Markdown 工作空间，让写作、图表与 Git 知识管理自然连接。',
        overview:
          '文字值得一个让你专注工作的空间。Polarbear 将 Markdown 编辑、实时预览和图表带入桌面工作空间，并支持 GitHub 与 GitLab 文档工作流。你的本地文件，始终处于中心。',
        status: '已公开发布 · macOS 与 Windows',
        capabilities: [
          {
            title: '用 Markdown 写作',
            text: '编辑、预览、分栏 3 种布局，让本地 Markdown 源码与实时渲染自然衔接。',
          },
          {
            title: '用图表表达思考',
            text: '通过 Mermaid 和 PlantUML，在文字旁表达关系与流程。',
          },
          {
            title: '连接你的知识',
            text: '使用 GitHub 与 GitLab 文档。Polarbear Vocab 是独立应用，提供有文档说明的 macOS 集成。',
          },
        ],
        workflow: ['打开工作空间', '写作与预览', '添加图表', '使用 Git 工作流'],
        useCases: ['技术写作', '项目文档', '个人知识管理'],
      },
    },
  },
  {
    id: 'qualitysphere',
    displayName: 'QualitySphere',
    accent: 'var(--violet)',
    tags: ['Quality', 'Integration testing'],
    license: { en: 'Not publicly verified', 'zh-CN': '尚未公开核实' },
    content: {
      en: {
        category: 'ENGINEERING CONFIDENCE',
        tagline: 'Make quality part of the conversation.',
        description:
          'A project focused on engineering quality and integration testing.',
        overview:
          'Quality work connects what was tested with what actually happened. QualitySphere is a Smartscity project focused on engineering quality and integration testing. Public product documentation is pending; the demonstration below is an illustrative workflow, not a statement of shipped features.',
        status: 'Project introduction · Public details pending',
        capabilities: [
          {
            title: 'Start with the question',
            text: 'A useful quality workflow begins with an explicit scenario and a clear expected outcome.',
          },
          {
            title: 'Follow the evidence',
            text: 'The sample workflow connects definition, scheduling, execution, results, and review as an educational illustration.',
          },
          {
            title: 'Keep conclusions grounded',
            text: 'Project capabilities and integration support will be described as public implementation evidence becomes available.',
          },
        ],
        workflow: ['Define', 'Schedule', 'Execute', 'Record results', 'Review'],
        useCases: ['Quality discussions', 'Integration-test planning'],
      },
      'zh-CN': {
        category: '让质量有据可依',
        tagline: '让质量，成为工程对话的一部分。',
        description: '聚焦工程质量与集成测试的项目。',
        overview:
          '质量工作需要连接“测试了什么”与“实际发生了什么”。QualitySphere 是 Smartscity 聚焦工程质量和集成测试的项目。公开产品文档仍待补充；下方演示是工作流程示意，不是已交付功能声明。',
        status: '项目介绍 · 公开资料待补充',
        capabilities: [
          {
            title: '从问题出发',
            text: '有价值的质量流程，始于明确的场景与清晰的预期结果。',
          },
          {
            title: '沿着证据前进',
            text: '示例将定义、调度、执行、结果与复盘连接起来，用于解释工程工作流程。',
          },
          {
            title: '让结论有据可依',
            text: '具体项目能力和集成支持，将在公开实现证据可用后介绍。',
          },
        ],
        workflow: ['定义', '调度', '执行', '记录结果', '复盘'],
        useCases: ['质量讨论', '集成测试规划'],
      },
    },
  },
  {
    id: 'polarbear-vocab',
    highlights: [
      {
        value: '4',
        label: {
          en: 'Choices per question',
          'zh-CN': '每题选项',
        },
        detail: {
          en: 'Four-option vocabulary exercises, with sessions of 10, 20, or 50 words.',
          'zh-CN': '四选一词汇练习，每轮可选 10、20 或 50 个词。',
        },
        sourceUrl:
          'https://github.com/smartscity/polarbear-vocab/blob/main/docs/user-guide.md',
      },
      {
        value: '30',
        label: {
          en: 'Days of statistics',
          'zh-CN': '天学习统计',
        },
        detail: {
          en: 'Review a 30-day view of practice activity alongside your mistakes and history.',
          'zh-CN': '结合错题与历史记录，回看 30 天学习统计。',
        },
        sourceUrl:
          'https://github.com/smartscity/polarbear-vocab/blob/main/README.md',
      },
      {
        value: '4',
        label: {
          en: 'Playback speeds',
          'zh-CN': '播放速度档位',
        },
        detail: {
          en: 'Listen at 0.5×, 1×, 1.5×, or 2×. CSV import supports Add, Update, and Replace modes.',
          'zh-CN':
            '以 0.5×、1×、1.5× 或 2× 聆听。CSV 导入支持新增、更新、替换三种模式。',
        },
        sourceUrl:
          'https://github.com/smartscity/polarbear-vocab/blob/main/docs/user-guide.md',
      },
    ],
    displayName: 'Polarbear Vocab',
    accent: 'var(--mint)',
    tags: ['Offline-first', 'macOS'],
    repositoryUrl: 'https://github.com/smartscity/polarbear-vocab',
    documentationUrl:
      'https://github.com/smartscity/polarbear-vocab/blob/main/docs/user-guide.md',
    releaseUrl: 'https://github.com/smartscity/polarbear-vocab/releases',
    version: 'v0.3.2',
    license: {
      en: 'MIT declared; license text pending',
      'zh-CN': '声明为 MIT；许可正文待补充',
    },
    content: {
      en: {
        category: 'WORDS THAT STAY WITH YOU',
        tagline: 'A new word. A wider world.',
        description: 'Build your vocabulary, offline and at your own pace.',
        overview:
          'Make unfamiliar words part of your everyday vocabulary. Polarbear Vocab is a separate, offline-first vocabulary app with collections, practice, and native speech. Bring your own words, revisit mistakes, and make steady room for discovery.',
        status: 'Public release · macOS',
        capabilities: [
          {
            title: 'Your words, collected',
            text: 'Organize vocabulary collections and import CSV files. The interface supports English and Simplified Chinese.',
          },
          {
            title: 'Practice with purpose',
            text: 'Practice with 4 choices and sessions of 10, 20, or 50 words. Revisit mistakes and explore 30-day learning statistics.',
          },
          {
            title: 'Listen offline',
            text: 'Hear words with native offline speech. Current public release artifacts are available for macOS.',
          },
        ],
        workflow: [
          'Collect or import',
          'Practice',
          'Revisit mistakes',
          'Review history',
        ],
        useCases: [
          'Personal word collections',
          'Offline practice',
          'Listening to pronunciation',
        ],
      },
      'zh-CN': {
        category: '让新词留在记忆里',
        tagline: '多认识一个词，多打开一扇窗。',
        description: '离线积累词汇，按自己的节奏学习。',
        overview:
          '让陌生的词汇，逐渐成为日常表达。Polarbear Vocab 是独立的离线优先词汇应用，提供词汇集、练习与原生语音。带入自己的词汇，回顾错题，为新的发现留出空间。',
        status: '已公开发布 · macOS',
        capabilities: [
          {
            title: '收藏自己的词汇',
            text: '整理词汇集、导入 CSV 文件。界面支持英文与简体中文。',
          },
          {
            title: '有方向地练习',
            text: '通过四选一练习，每轮学习 10、20 或 50 个词，并结合错题与 30 天统计回顾学习过程。',
          },
          {
            title: '离线聆听',
            text: '通过原生离线语音聆听词汇发音。目前公开发布包适用于 macOS。',
          },
        ],
        workflow: ['收集或导入', '练习', '回顾错题', '查看历史'],
        useCases: ['个人词汇积累', '离线练习', '聆听发音'],
      },
    },
  },
];
