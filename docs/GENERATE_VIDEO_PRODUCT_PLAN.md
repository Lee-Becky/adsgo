# Generate Video（AI 营销视频）产品方案 — 功能平移说明

> **依据来源**  
> - **流程与信息架构**：KreadoAI「AI Marketing Video」实际页面（浏览器完整走通 Step 1–7）。  
> - **视觉与组件规范**：`adsgo-ui-skill`（`SKILL.md` + `references/layout-system.md` 等），**不以项目内其他页面为规范来源**。  
> - **工程范围**：模拟数据 / 模拟耗时；不接真实 Kreado API。

---

## 1. 目标与原则

| 维度 | 要求 |
|------|------|
| 功能平移 | 每一步的**主任务、关键字段、主 CTA、分支状态（加载/完成）**与 Kreado 对齐；不增加「全流程常驻侧栏」「快速跳转」等与参考产品无关的能力。 |
| AdsGo UI | 页面内容区遵循 **Level 0–4 容器层级**、token（`primary-*` / `gray-*`）、按钮/输入/卡片/焦点环；**紫色为强调色**，大面为中性灰白。 |
| 框架边界 | `MainLayout` 的 Sidebar + Header **不改造**；本页仅在 **main 内容区** 内放置工具栏、步骤条与卡片（见 `layout-system.md` §1 Framework Boundary）。 |

---

## 2. 七步流程（与 Kreado 步骤条一致）

顶部 **横向步骤条**（7 步）：已完成 / 当前 / 未解锁（未到步或依赖未满足时可 `disabled` 样式，点击策略：仅允许返回已走过步骤，前进由 CTA 驱动）。

| Step | 步骤条文案（Kreado） | 主内容区标题/任务（观察到的文案） |
|------|---------------------|-----------------------------------|
| 1 | 输入 URL | URL 输入、示例链接、**开始创作视频**；可选「暂无网址？手动输入商品信息」等价能力（URL / 手动二选一）。底部 **三种视频类型卡片**（手持商品 / 虚拟试穿 / 产品讲解）与状态标签；手动模式下 **输出语种为下拉**（`SelectAdsgo`）。 |
| 2 | 品牌及商品分析 | **布局与 Kreado 一致：左侧**表单（分区标题「商品信息」「脚本与视频参数」）；**输出语种下拉**；核心卖点旁 **AI 润色 →** 链式操作（`BtnLink` + `FieldHint`）；其余字段同前；**右侧** **「创意素材资源」**。顶部 **AlertInfo** 提示分析就绪；**CardAdsgo footer** 承载底部说明 + **确认并生成脚本**（主按钮 `loading`）。对应 skill **Template C**。 |
| 3 | 视频脚本策划 | **消耗说明 AlertInfo（模拟）**；生成中 **GeneratingPanel（§31）**；脚本卡片带 **StatusTagProcessing** 已选态；**选择此脚本** 使用主按钮 `loading`。 |
| 4 | 人物形象设计 | 数字人候选（多卡）；**重新设计人物形象**（占位）；**选择此人物**；卡片级生成中状态。 |
| 5 | 视频分镜设计 | **LineTabs**（分镜 1 / 分镜 2；分镜 2 为演示说明 **AlertInfo**）；首帧必选 / 尾帧可选、口播 **AI 润色 →**、动作提示词、**ToggleAdsgo**「生成分镜口播与配音」、**重新生成图片**（占位）、主 CTA **生成分镜视频**。提交：**GeneratingPanel**。布局：**Template C**，侧栏 `sticky`。 |
| 6 | 视频分镜预览 | 主标题在内容区为 **「视频片段预览」**。片段生成中：**GeneratingPanel** + 标题区 **StatusTagProcessing**；列表卡片 + 排序；**BtnDashed** 添加片段；合成 CTA 主按钮 `loading`。 |
| 7 | 最终成片生成 | 右侧 **AlertSuccess（§26）** + **MetricTile** 规格栅格 + 口播回顾 + 操作按钮。布局：左预览右摘要。 |

---

## 3. AdsGo UI 实施要点（对应 skill）

1. **内容区结构**（`layout-system.md` §2）  
   - 页面背景由框架提供；本页根节点使用 **`space-y-6`** 组织块级间距。  
   - **Level 1**：单层 `bg-white rounded-[20px] p-6` 包裹：**页内工具栏 + 步骤条 + 当前步主内容**（避免多层无关嵌套）。  
   - **Level 2**：各步主体使用 **Card**：`rounded-xl border border-[#F0F0F0] shadow-[−2px_2px_16px_rgba(14,0,45,0.06)]`，卡片头 `border-b border-[#F5F5F5] bg-gray-50/50`。  
   - **Level 3**：分镜块、元信息区等用 `bg-gray-50 rounded-lg p-4`。  

2. **组件**（实现集中于 `generateVideo/ui.jsx`，与 `SKILL.md` / `components-*` references 对齐）  
   - `BtnPrimary` / `BtnDefault` / `BtnLink` / `BtnDashed`；`InputAdsgo` / `TextareaAdsgo` / `SelectAdsgo`（`getNextModalZIndex`）；`ToggleAdsgo`；`LineTabs`；`FlowStepper`；`CardAdsgo`（含 `footer`）；`AlertInfo` / `AlertSuccess`；`StatusTagProcessing`；`GeneratingPanel`（§31）；`MetricTile`。  
   - 步骤完成态：`FlowStepper` 使用 `success-*` 语义色。  

3. **禁止**  
   - **全流程**右侧常驻「创意素材库」列（与 Step2 **仅本步右侧**素材区不同：后者为 Kreado 既定布局）。  
   - 未在 skill / 本方案中定义的「快速入口」类演示控件。  
   - 抄 Kreado 蓝色主品牌色替代 AdsGo `primary-500`。  

---

## 4. 模拟数据与状态机（实现约定）

- **Step 1→2**：URL 分析 loading → 填充 Step 2 表单默认值（手动模式则跳过 URL 解析）。  
- **Step 2→3**：校验至少 3 张素材 + 必填字段 → 生成 3 套脚本。  
- **Step 3→4**：选脚本 → 匹配数字人（loading）。  
- **Step 4→5**：选人物 → 分镜关键帧（由已选素材派生候选图）。  
- **Step 5→6**：提交分镜视频 → 提交 loading → Step 6 **片段生成中**（可配置短延迟模拟 3–5 分钟）→ 展示片段列表。  
- **Step 6→7**：合成最终成片 → loading → 成片页 + 元数据。  
- **重置**：清空任务状态，回到 Step 1。  

---

## 5. 验收清单（产品）

- [ ] 七步与上表一致；无多余侧栏。  
- [ ] Step 2：左侧表单 + **右侧**「创意素材资源」（仅 Step 2，非整页永久侧栏）。  
- [ ] Step 5 为左右分栏（2/3 + 1/3），含口播/动作/开关/主 CTA。  
- [ ] Step 1 含视频类型三卡片 + 手动模式语种下拉。  
- [ ] Step 2 含分区标题、语种下拉、AI 润色链式、AlertInfo、footer 主 CTA。  
- [ ] Step 3 含消耗说明、GeneratingPanel、脚本卡选中标签。  
- [ ] Step 5 含 LineTabs、Toggle、口播润色、提交 GeneratingPanel。  
- [ ] Step 6 含 GeneratingPanel、StatusTag、BtnDashed 添加、合成 loading。  
- [ ] Step 7 含 AlertSuccess、MetricTile、口播回顾、分享/下载/重建。  
- [ ] 全局类名符合 skill token，无随意 hex（仅允许 skill 列出的 AdsGo 特例色）。  

---

*文档版本：与实现同步于 `src/components/creativeHub/generateVideo/`。*
