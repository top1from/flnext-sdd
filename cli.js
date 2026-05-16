#!/usr/bin/env node
// FLNext-SDD CLI — 安装/更新入口
// npx flnext-sdd@latest         → 安装
// npx flnext-sdd --update        → 更新
// npx flnext-sdd --target ./proj → 指定目标目录

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = '3.2.0';
const args = process.argv.slice(2);

// 帮助
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
╔══════════════════════════════════════════╗
║  FLNext-SDD v${VERSION} — CLI 安装工具    ║
╚══════════════════════════════════════════╝

用法:
  npx flnext-sdd@latest              在当前目录安装
  npx flnext-sdd --target <dir>      安装到指定目录
  npx flnext-sdd --update            更新已有安装（保留 STATE.md 和 docs/sdd/）
  npx flnext-sdd --help              显示帮助

安装后在你的项目中:
  /flnext-sdd-discovery              老项目扫描代码库
  /flnext-sdd-requirement            开始需求讨论
  /flnext-sdd-status                 查看进度
`);
  process.exit(0);
}

// 参数解析
const targetIdx = args.indexOf('--target');
const targetDir = targetIdx !== -1 ? args[targetIdx + 1] : process.cwd();
const isUpdate = args.includes('--update');

// 源目录：npm 包中的 .flnext-sdd/
const sourceDir = path.resolve(__dirname, '.flnext-sdd');
if (!fs.existsSync(sourceDir)) {
  console.error('错误: 找不到框架源文件');
  process.exit(1);
}

// 目标项目
const flnextDir = path.join(targetDir, '.flnext-sdd');
const skillsDir = path.join(targetDir, '.claude', 'skills');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// ============================================================
// 更新模式
// ============================================================
if (isUpdate) {
  if (!fs.existsSync(flnextDir)) {
    console.error('错误: 项目中没有 .flnext-sdd，请先安装');
    process.exit(1);
  }

  console.log(`[FLNext-SDD] 更新 v${VERSION} → ${targetDir}`);
  console.log('');

  // 备份用户配置
  let savedName = '', savedType = '', savedFeature = '';
  const configPath = path.join(flnextDir, 'config.yaml');
  if (fs.existsSync(configPath)) {
    const cfg = fs.readFileSync(configPath, 'utf-8');
    const m1 = cfg.match(/project_name:\s*"(.*?)"/);
    const m2 = cfg.match(/project_type:\s*"(.*?)"/);
    const m3 = cfg.match(/feature_name:\s*"(.*?)"/);
    if (m1) savedName = m1[1];
    if (m2) savedType = m2[1];
    if (m3) savedFeature = m3[1];
  }

  // 复制技能
  console.log('[1/4] 更新技能文件...');
  copyDir(path.join(sourceDir, 'skills'), skillsDir);
  console.log('  技能文件已更新');

  // 复制 Agents
  console.log('[2/4] 更新 Agent 定义...');
  copyDir(path.join(sourceDir, 'agents'), path.join(flnextDir, 'agents'));
  console.log('  Agent 定义已更新');

  // 复制参考
  console.log('[3/4] 更新参考文档...');
  copyDir(path.join(sourceDir, 'references'), path.join(flnextDir, 'references'));
  console.log('  参考文档已更新');

  // 更新配置（保留用户自定义）
  console.log('[4/4] 更新配置...');
  let cfgContent = fs.readFileSync(path.join(sourceDir, 'config.yaml'), 'utf-8');
  if (savedName) cfgContent = cfgContent.replace(/project_name:\s*".*?"/, `project_name: "${savedName}"`);
  if (savedType) cfgContent = cfgContent.replace(/project_type:\s*"greenfield"/, `project_type: "${savedType}"`);
  if (savedFeature) cfgContent = cfgContent.replace(/feature_name:\s*""/, `feature_name: "${savedFeature}"`);
  fs.writeFileSync(configPath, cfgContent, 'utf-8');

  if (fs.existsSync(path.join(sourceDir, 'constitution.md'))) {
    fs.copyFileSync(path.join(sourceDir, 'constitution.md'), path.join(flnextDir, 'constitution.md'));
  }

  // 更新 STATE.md 版本号
  const statePath = path.join(targetDir, 'STATE.md');
  if (fs.existsSync(statePath)) {
    let state = fs.readFileSync(statePath, 'utf-8');
    state = state.replace(/sdd_version:\s*[\d.]+/, 'sdd_version: 3.2');
    fs.writeFileSync(statePath, state, 'utf-8');
  }

  console.log('  配置已更新（已保留项目名/类型/功能名）');
  console.log('');
  console.log('FLNext-SDD 更新完成!');
  console.log('已更新: .claude/skills/  .flnext-sdd/agents/  references/  constitution.md  config.yaml');
  console.log('保留:   STATE.md  docs/sdd/');
  process.exit(0);
}

// ============================================================
// 安装模式
// ============================================================

// 检测项目类型
let projectType = 'greenfield';
const indicators = ['package.json', 'pom.xml', 'go.mod', 'pyproject.toml', 'Cargo.toml', 'build.gradle'];
for (const f of indicators) {
  if (fs.existsSync(path.join(targetDir, f))) { projectType = 'brownfield'; break; }
}
if (!fs.existsSync(path.join(targetDir, 'src'))) {
  // src 不存在但也没其他标志 → greenfield
  if (projectType === 'brownfield') {} // already set
} else {
  projectType = 'brownfield';
}

const projectName = path.basename(targetDir);

console.log(`╔══════════════════════════════════════════╗`);
console.log(`║  FLNext-SDD v${VERSION} 安装               ║`);
console.log(`╚══════════════════════════════════════════╝`);
console.log('');
console.log(`项目名称: ${projectName}`);
console.log(`项目类型: ${projectType}`);
console.log(`目标目录: ${targetDir}`);
console.log('');

// 1. 创建目录
console.log('[1/6] 创建目录结构...');
fs.mkdirSync(flnextDir, { recursive: true });
fs.mkdirSync(path.join(flnextDir, 'agents'), { recursive: true });
fs.mkdirSync(path.join(flnextDir, 'references'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'docs', 'sdd'), { recursive: true });
console.log('  目录结构创建完成');

// 2. 复制技能
console.log('[2/6] 复制技能文件...');
copyDir(path.join(sourceDir, 'skills'), skillsDir);
console.log('  技能文件复制完成');

// 3. 复制配置
console.log('[3/6] 复制配置文件...');
let cfg = fs.readFileSync(path.join(sourceDir, 'config.yaml'), 'utf-8');
cfg = cfg.replace(/project_name:\s*""/, `project_name: "${projectName}"`);
cfg = cfg.replace(/project_type:\s*"greenfield"/, `project_type: "${projectType}"`);
fs.writeFileSync(path.join(flnextDir, 'config.yaml'), cfg, 'utf-8');

if (fs.existsSync(path.join(sourceDir, 'constitution.md'))) {
  fs.copyFileSync(path.join(sourceDir, 'constitution.md'), path.join(flnextDir, 'constitution.md'));
}
console.log('  配置文件复制完成');

// 4. 复制 Agent
console.log('[4/6] 复制 Agent 定义...');
copyDir(path.join(sourceDir, 'agents'), path.join(flnextDir, 'agents'));
console.log('  Agent 定义复制完成');

// 5. STATE.md
console.log('[5/6] 初始化 STATE.md...');
const statePath = path.join(targetDir, 'STATE.md');
if (!fs.existsSync(statePath)) {
  const date = new Date().toISOString().slice(0, 10);
  const phases = [
    '0-discovery', '1-requirement', '2-prototype', '3-architecture',
    '3b-arch-review', '4-backend', '5-frontend', '6-testcase',
    '7-testing', '8-submit', '9-accept', '10-release'
  ];
  const firstAction = projectType === 'brownfield' ? '/flnext-sdd-discovery' : '/flnext-sdd-requirement';
  
  let state = `---
sdd_version: 3.2
project_name: "${projectName}"
project_type: "${projectType}"
current_phase: 0
phase_status: pending
next_action: ${firstAction}
phase_name: ""
feature_name: ""

progress:
  total_phases: 11
  completed_phases: 0
  percent: 0

phases:
`;
  for (const p of phases) {
    state += `  ${p}:\n    status: PENDING\n`;
    if (p === '3b-arch-review' || p === '7-testing') state += '    result: ""\n';
    if (p === '4-backend' || p === '5-frontend') state += '    compilation_gate: ""\n';
    if (p === '8-submit') state += '    branch: ""\n    self_check: {}\n';
  }
  state += `
phase_history: []
current_step: ""
steps_completed: []

wave_progress:
  current_wave: 0
  wave_status: {}

compilation_gates:
  backend:
    status: pending
  frontend:
    status: pending

metadata:
  created_at: "${date}"
  updated_at: "${date}"
  output_folder: "docs/sdd"
  discovery_context: ""
---
`;
  fs.writeFileSync(statePath, state, 'utf-8');
  console.log('  STATE.md 初始化完成');
} else {
  console.log('  STATE.md 已存在，跳过');
}

// 6. 参考文档
console.log('[6/6] 复制参考文档...');
copyDir(path.join(sourceDir, 'references'), path.join(flnextDir, 'references'));
console.log('  参考文档复制完成');

// .gitignore
const giPath = path.join(targetDir, '.gitignore');
if (!fs.existsSync(giPath)) {
  fs.writeFileSync(giPath, `# FLNext-SDD
STATE.md
docs/sdd/

node_modules/
dist/
build/
.next/
out/

.env
.env.local
.env.*.local

.vscode/
.idea/
*.swp
*.swo

.DS_Store
Thumbs.db
`, 'utf-8');
  console.log('  .gitignore 已创建');
}

console.log('');
console.log(`╔══════════════════════════════════════════╗`);
console.log(`║  FLNext-SDD v${VERSION} 安装完成!          ║`);
console.log(`╚══════════════════════════════════════════╝`);
console.log('');
if (projectType === 'brownfield') {
  console.log('下一步: 输入 /flnext-sdd-discovery 扫描代码库');
} else {
  console.log('下一步: 输入 /flnext-sdd-requirement 开始需求讨论');
}
console.log('');
console.log('提示: 更新框架请运行 npx flnext-sdd@latest --update');
console.log('');

// ============================================================
// 工具函数
// ============================================================
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
