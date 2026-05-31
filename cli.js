#!/usr/bin/env node
// FLNext-SDD CLI v4.0 — 安装/更新/状态/审计（合并 SDD-Forge CLI 能力）

const fs = require('fs');
const path = require('path');

const PKG = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const VERSION = PKG.version;
const FRAMEWORK_VERSION = '4.0.0';  // 框架版本（独立于 npm 包版本，便于追踪 breaking changes）
const args = process.argv.slice(2);
const targetIdx = args.indexOf('--target');
const targetDir = targetIdx !== -1 ? args[targetIdx + 1] : process.cwd();
const CWD = targetDir;

const PHASE_NAMES = [
  '0-discovery', '1-requirement', '2-prototype', '3-architecture',
  '3b-arch-review', '4-backend', '5-frontend', '6-testcase',
  '7-testing', '7b-integration-gate', '8-submit', '9-accept', '10-release'
];

// ─── 路由 ───────────────────────────────────────────────────────────────────
if (args.includes('--version') || args.includes('-v')) {
  console.log(`flnext-sdd v${VERSION}`);
  process.exit(0);
}
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}
if (args.includes('--status')) {
  runStatus();
  process.exit(0);
}
if (args.includes('--audit')) {
  runAudit();
  process.exit(0);
}
if (args.includes('--self-check')) {
  runSelfCheck();
  process.exit(0);
}
if (args.includes('--drift-check')) {
  runDriftCheck();
  process.exit(0);
}
if (args.includes('--delta-merge')) {
  const featureIdx = args.indexOf('--feature');
  const featureName = featureIdx !== -1 ? args[featureIdx + 1] : '';
  runDeltaMerge(featureName);
  process.exit(0);
}

const isUpdate = args.includes('--update');
runInstallOrUpdate(isUpdate);

// ─── Help ─────────────────────────────────────────────────────────────────────
function showHelp() {
  console.log(`
╔══════════════════════════════════════════╗
║  FLNext-SDD v${VERSION} (框架 v${FRAMEWORK_VERSION})  ║
╚══════════════════════════════════════════╝

用法:
  npx flnext-sdd@latest                    在当前目录安装
  npx flnext-sdd --target <dir>            安装到指定目录
  npx flnext-sdd --update                  更新（保留 STATE.md 和 docs/sdd/）
  npx flnext-sdd --status                  查看项目进度
  npx flnext-sdd --audit                   宪法合规审计
  npx flnext-sdd --self-check              显示 AI 自检清单路径
  npx flnext-sdd --drift-check             检测代码漂移
  npx flnext-sdd --delta-merge --feature <name>  合并 Delta 规格变更
  npx flnext-sdd --help                    显示帮助

工作流命令（Claude Code）:
  /flnext-sdd-discovery | requirement | prototype | architecture
  /flnext-sdd-backend | frontend | testcase | testing
  /flnext-sdd-integration-gate | submit | accept | release
  /flnext-sdd-hotfix | consultation | quick | status | help
`);
}

// ─── Install / Update ─────────────────────────────────────────────────────────
function runInstallOrUpdate(isUpdate) {
  const sourceDir = path.resolve(__dirname, '.flnext-sdd');
  if (!fs.existsSync(sourceDir)) {
    console.error('错误: 找不到框架源文件 .flnext-sdd/');
    process.exit(1);
  }

  const flnextDir = path.join(CWD, '.flnext-sdd');
  const skillsDir = path.join(CWD, '.claude', 'skills');

  if (!fs.existsSync(CWD)) {
    fs.mkdirSync(CWD, { recursive: true });
  }

  if (isUpdate) {
    if (!fs.existsSync(flnextDir)) {
      console.error('错误: 项目中没有 .flnext-sdd，请先安装');
      process.exit(1);
    }
    console.log(`[FLNext-SDD] 更新 v${VERSION} (框架 v${FRAMEWORK_VERSION}) → ${CWD}\n`);

    let savedName = '', savedType = '', savedFeature = '', savedBackendOnly = false;
    const configPath = path.join(flnextDir, 'config.yaml');
    if (fs.existsSync(configPath)) {
      const cfg = fs.readFileSync(configPath, 'utf-8');
      const m1 = cfg.match(/project_name:\s*"(.*?)"/);
      const m2 = cfg.match(/project_type:\s*"(.*?)"/);
      const m3 = cfg.match(/feature_name:\s*"(.*?)"/);
      const m4 = cfg.match(/backend_only:\s*(true|false)/);
      if (m1) savedName = m1[1];
      if (m2) savedType = m2[1];
      if (m3) savedFeature = m3[1];
      if (m4) savedBackendOnly = m4[1] === 'true';
    }

    console.log('[1/5] 更新技能文件...');
    copyDir(path.join(sourceDir, 'skills'), skillsDir);

    console.log('[2/5] 更新 Agent / delta / references...');
    copyDir(path.join(sourceDir, 'agents'), path.join(flnextDir, 'agents'));
    copyDir(path.join(sourceDir, 'references'), path.join(flnextDir, 'references'));
    if (fs.existsSync(path.join(sourceDir, 'delta'))) {
      copyDir(path.join(sourceDir, 'delta'), path.join(flnextDir, 'delta'));
    }

    console.log('[3/5] 更新配置与宪法...');
    let cfgContent = fs.readFileSync(path.join(sourceDir, 'config.yaml'), 'utf-8');
    if (savedName) cfgContent = cfgContent.replace(/project_name:\s*".*?"/, `project_name: "${savedName}"`);
    if (savedType) cfgContent = cfgContent.replace(/project_type:\s*"greenfield"/, `project_type: "${savedType}"`);
    if (savedFeature) cfgContent = cfgContent.replace(/feature_name:\s*""/, `feature_name: "${savedFeature}"`);
    cfgContent = cfgContent.replace(/backend_only:\s*(true|false)/, `backend_only: ${savedBackendOnly}`);
    fs.writeFileSync(configPath, cfgContent, 'utf-8');
    if (fs.existsSync(path.join(sourceDir, 'constitution.md'))) {
      fs.copyFileSync(path.join(sourceDir, 'constitution.md'), path.join(flnextDir, 'constitution.md'));
    }

    console.log('[4/5] 迁移 STATE.md（v4.0 新阶段）...');
    migrateStateV4(path.join(CWD, 'STATE.md'));

    console.log('[5/5] 完成');
    console.log('\nFLNext-SDD 更新完成! 已合并 SDD-Forge v2.0 能力。');
    return;
  }

  // 安装模式
  let projectType = 'greenfield';
  const indicators = ['package.json', 'pom.xml', 'go.mod', 'pyproject.toml', 'Cargo.toml', 'build.gradle'];
  let hasConfig = false;
  for (const f of indicators) {
    if (fs.existsSync(path.join(CWD, f))) { hasConfig = true; break; }
  }
  // 优化：同时存在配置文件和代码目录才判定为 brownfield
  const hasCodeDir = fs.existsSync(path.join(CWD, 'src')) || fs.existsSync(path.join(CWD, 'app')) || fs.existsSync(path.join(CWD, 'lib'));
  if (hasConfig && hasCodeDir) projectType = 'brownfield';
  const projectName = path.basename(CWD);
  
  // 检测是否为纯后端项目
  let backendOnly = false;
  const frontendConfigFiles = ['tsconfig.json', 'angular.json', 'vue.config.js', 'next.config.js', 'vite.config.js', 'webpack.config.js'];
  const hasFrontendConfig = frontendConfigFiles.some(f => fs.existsSync(path.join(CWD, f)));
  const hasFrontendDir = fs.existsSync(path.join(CWD, 'public')) || fs.existsSync(path.join(CWD, 'pages')) || fs.existsSync(path.join(CWD, 'components')) || fs.existsSync(path.join(CWD, 'views'));
  // 检查 package.json 中是否有前端依赖
  let hasFrontendDeps = false;
  if (fs.existsSync(path.join(CWD, 'package.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    const frontendPackages = ['react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'solid-js'];
    hasFrontendDeps = Object.keys(allDeps || {}).some(dep => frontendPackages.includes(dep));
  }
  if (projectType === 'brownfield' && !hasFrontendConfig && !hasFrontendDir && !hasFrontendDeps) {
    backendOnly = true;
  }

  console.log(`╔══════════════════════════════════════════════╗`);
  console.log(`║  FLNext-SDD v${VERSION} (框架 v${FRAMEWORK_VERSION})  ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);
  console.log(`项目: ${projectName}  类型: ${projectType}  目录: ${CWD}\n`);

  fs.mkdirSync(flnextDir, { recursive: true });
  fs.mkdirSync(path.join(flnextDir, 'agents'), { recursive: true });
  fs.mkdirSync(path.join(flnextDir, 'references'), { recursive: true });
  fs.mkdirSync(path.join(CWD, 'docs', 'sdd'), { recursive: true });

  copyDir(path.join(sourceDir, 'skills'), skillsDir);
  copyDir(path.join(sourceDir, 'agents'), path.join(flnextDir, 'agents'));
  copyDir(path.join(sourceDir, 'references'), path.join(flnextDir, 'references'));
  if (fs.existsSync(path.join(sourceDir, 'delta'))) {
    copyDir(path.join(sourceDir, 'delta'), path.join(flnextDir, 'delta'));
  }

  let cfg = fs.readFileSync(path.join(sourceDir, 'config.yaml'), 'utf-8');
  cfg = cfg.replace(/project_name:\s*""/, `project_name: "${projectName}"`);
  cfg = cfg.replace(/project_type:\s*"greenfield"/, `project_type: "${projectType}"`);
  fs.writeFileSync(path.join(flnextDir, 'config.yaml'), cfg, 'utf-8');
  if (fs.existsSync(path.join(sourceDir, 'constitution.md'))) {
    fs.copyFileSync(path.join(sourceDir, 'constitution.md'), path.join(flnextDir, 'constitution.md'));
  }

  const statePath = path.join(CWD, 'STATE.md');
  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(statePath, buildInitialState(projectName, projectType, backendOnly), 'utf-8');
    console.log('STATE.md 已初始化');
  }
  
  // 更新 config.yaml 中的 backend_only 配置，并自动排除 frontend 自检类别
  if (backendOnly) {
    let cfgContent = fs.readFileSync(path.join(flnextDir, 'config.yaml'), 'utf-8');
    cfgContent = cfgContent.replace(/backend_only:\s*false/, 'backend_only: true');
    // 自动从自检类别中移除 frontend，避免纯后端项目执行前端检查
    cfgContent = cfgContent.replace(/\s+- frontend\s+#.*\n/, '');
    fs.writeFileSync(path.join(flnextDir, 'config.yaml'), cfgContent, 'utf-8');
  }

  const giPath = path.join(CWD, '.gitignore');
  if (!fs.existsSync(giPath)) {
    fs.writeFileSync(giPath, `STATE.md\ndocs/sdd/\nnode_modules/\ndist/\nbuild/\n.env\n.env.local\n`, 'utf-8');
  }

  console.log(`\n安装完成! 下一步: ${projectType === 'brownfield' ? '/flnext-sdd-discovery' : '/flnext-sdd-requirement'}`);
}

function buildInitialState(projectName, projectType, backendOnly = false) {
  const date = new Date().toISOString().slice(0, 10);
  const firstAction = projectType === 'brownfield' ? '/flnext-sdd-discovery' : '/flnext-sdd-requirement';
  let state = `---
sdd_version: ${FRAMEWORK_VERSION}
project_name: "${projectName}"
project_type: "${projectType}"
project_backend_only: ${backendOnly}
current_phase: 0
phase_status: pending
next_action: ${firstAction}
phase_name: ""
feature_name: ""

progress:
  total_phases: 13
  completed_phases: 0
  percent: 0

phases:
`;
  for (const p of PHASE_NAMES) {
    state += `  ${p}:\n    status: PENDING\n`;
    if (p === '3b-arch-review' || p === '7-testing' || p === '7b-integration-gate') state += '    result: ""\n';
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

constitution_compliance:
  violations: 0
  last_audit: ""
  status: COMPLIANT
  corrective_actions: []

decision_lineage: []

dingtalk:
  base_id: ""
  table_id: ""
  record_id: ""
  requirement_id: ""
  requirement_name: ""
  ai_start_time: ""
  ai_end_time: ""
  field_mapping:
    status: ""
    handler: ""
    ai_start: ""
    ai_end: ""
    req_id: ""
    req_name: ""

metadata:
  created_at: "${date}"
  updated_at: "${date}"
  output_folder: "docs/sdd"
  discovery_context: ""
---
`;
  return state;
}

function migrateStateV4(statePath) {
  if (!fs.existsSync(statePath)) return;
  let state = fs.readFileSync(statePath, 'utf-8');
  state = state.replace(/sdd_version:\s*[\d.]+/, `sdd_version: ${FRAMEWORK_VERSION}`);
  state = state.replace(/total_phases:\s*\d+/, 'total_phases: 13');

  if (!state.includes('7b-integration-gate:')) {
    const insert = `  7b-integration-gate:\n    status: PENDING\n    result: ""\n`;
    state = state.replace(/(  7-testing:[\s\S]*?\n)(  8-submit:)/, `$1${insert}$2`);
  }
  if (!state.includes('constitution_compliance:')) {
    state = state.replace(
      /(dingtalk:[\s\S]*?\n)(metadata:)/,
      `$1\nconstitution_compliance:\n  violations: 0\n  last_audit: ""\n  status: COMPLIANT\n  corrective_actions: []\n\ndecision_lineage: []\n\n$2`
    );
  }
  const now = new Date().toISOString().slice(0, 10);
  state = state.replace(/updated_at:\s*"[^"]*"/, `updated_at: "${now}"`);
  fs.writeFileSync(statePath, state, 'utf-8');
}

// ─── Status ───────────────────────────────────────────────────────────────────
function runStatus() {
  const statePath = path.join(CWD, 'STATE.md');
  if (!fs.existsSync(statePath)) {
    console.error('未找到 STATE.md，请先运行 npx flnext-sdd');
    process.exit(1);
  }
  const raw = fs.readFileSync(statePath, 'utf-8');
  const extract = (f) => { const m = raw.match(new RegExp(`${f}:\\s*"?([^"\\n]*)"?`)); return m ? m[1].trim() : ''; };

  console.log(`\nFLNext-SDD v${VERSION} (框架 v${FRAMEWORK_VERSION}) 状态\n`);
  console.log(`  项目: ${extract('project_name') || '(未命名)'}`);
  console.log(`  类型: ${extract('project_type')}`);
  console.log(`  版本: ${extract('sdd_version')}`);
  console.log(`  进度: ${extract('percent') || '0'}% (${extract('completed_phases') || '0'}/${extract('total_phases') || '13'})`);
  console.log(`  下一步: ${extract('next_action')}\n`);

  console.log('  阶段状态:');
  for (const pName of PHASE_NAMES) {
    const escaped = pName.replace(/-/g, '\\-');
    const re = new RegExp(`  ${escaped}:\\s*\\n((?:    .+\\n)*)`, 'm');
    const m = raw.match(re);
    if (m) {
      const st = m[1].match(/status:\s*(\w+)/);
      const status = st ? st[1] : 'PENDING';
      const mark = status === 'CONFIRMED' || status === 'COMPLETE' ? '✓' : status === 'IN_PROGRESS' ? '→' : ' ';
      console.log(`    ${mark} ${pName.padEnd(22)} ${status}`);
    }
  }
  console.log('');
}

// ─── Audit ────────────────────────────────────────────────────────────────────
function runAudit() {
  const statePath = path.join(CWD, 'STATE.md');
  if (!fs.existsSync(statePath)) {
    console.error('未找到 STATE.md');
    process.exit(1);
  }
  const raw = fs.readFileSync(statePath, 'utf-8');
  console.log('\nFLNext-SDD 宪法合规审计\n');

  const VALID_STATES = ['PENDING', 'IN_PROGRESS', 'AWAITING_CONFIRMATION', 'CONFIRMED', 'COMPLETE', 'SKIPPED'];
  let warnings = 0;
  let invalidStates = 0;

  for (const pName of PHASE_NAMES) {
    const escaped = pName.replace(/-/g, '\\-');
    const re = new RegExp(`  ${escaped}:\\s*\\n((?:    .+\\n)*)`, 'm');
    const m = raw.match(re);
    if (m) {
      const st = m[1].match(/status:\s*(\w+)/);
      const status = st ? st[1] : 'UNKNOWN';

      // 验证状态值合法性
      if (!VALID_STATES.includes(status)) {
        console.log(`  ✗ ${pName}: 非法状态 "${status}"`);
        invalidStates++;
        continue;
      }

      if (status === 'CONFIRMED' || status === 'COMPLETE' || status === 'SKIPPED') {
        console.log(`  ✓ ${pName}: ${status}`);
      } else if (status === 'PENDING') {
        console.log(`  · ${pName}: 未开始`);
      } else {
        console.log(`  ⚠ ${pName}: ${status}`);
        warnings++;
      }
    }
  }

  if (invalidStates > 0) {
    console.log(`\n  ✗ 状态机违规: ${invalidStates} 个阶段使用了非法状态值`);
    console.log(`  合法状态: ${VALID_STATES.join(' / ')}`);
  }

  const vMatch = raw.match(/violations:\s*(\d+)/);
  const violations = vMatch ? parseInt(vMatch[1], 10) : 0;
  if (violations > 0) {
    console.log(`\n  ✗ 记录违规: ${violations}`);
    if (violations >= 3) console.log('  🛑 违规已达熔断阈值 (3/3)！必须执行合规审查。');
  } else {
    console.log(`\n  ✓ 零违规记录`);
  }

  const total = warnings + invalidStates + violations;
  console.log(total ? `\n  结果: WARNING (${total} 项待关注)\n` : `\n  结果: COMPLIANT ✅\n`);
}

// ─── Self-check ───────────────────────────────────────────────────────────────
function runSelfCheck() {
  const p = path.join(CWD, '.flnext-sdd', 'references', 'ai-self-check.md');
  console.log('\nAI 自检清单:');
  if (fs.existsSync(p)) console.log(`  ${p}\n  提测前在 /flnext-sdd-submit 阶段强制执行（含第 9 类跨阶段一致性）\n`);
  else console.log('  未安装，请运行 npx flnext-sdd\n');
}

// ─── Drift-check ──────────────────────────────────────────────────────────────
function runDriftCheck() {
  const manifestPath = path.join(CWD, 'docs', 'sdd', '.scan-manifest.json');
  console.log('\n代码漂移检测\n');
  if (!fs.existsSync(manifestPath)) {
    console.log('  未找到 scan manifest，请先运行 Discovery\n');
    return;
  }
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const baseline = (manifest.baseline && manifest.baseline.files) || [];
    const current = [];
    function scan(dir, prefix) {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = prefix ? `${prefix}/${e.name}` : e.name;
        if (e.isDirectory()) {
          if (['node_modules', 'dist', 'build', '.git'].includes(e.name)) continue;
          scan(path.join(dir, e.name), rel);
        } else current.push(rel);
      }
    }
    scan(CWD, '');
    const added = current.filter(f => !baseline.includes(f));
    const removed = baseline.filter(f => !current.includes(f));
    const ratio = baseline.length ? (added.length + removed.length) / baseline.length : 0;
    console.log(`  基线: ${baseline.length}  当前: ${current.length}  漂移: ${(ratio * 100).toFixed(1)}%`);
    if (ratio > 0.2) console.log('  ⚠ 超过 20% 阈值，建议重新 Discovery\n');
    else console.log('  ✓ 漂移在可接受范围\n');
  } catch (e) {
    console.error(`  错误: ${e.message}\n`);
  }
}

// ─── Delta Merge ──────────────────────────────────────────────────────────────
function runDeltaMerge(featureName) {
  console.log('\nDelta 规格变更合并\n');
  
  if (!featureName) {
    console.error('错误: 请指定功能名称，例如: --delta-merge --feature short-url');
    process.exit(1);
  }
  
  const deltasDir = path.join(CWD, 'docs', 'sdd', featureName, 'deltas');
  if (!fs.existsSync(deltasDir)) {
    console.log(`  未找到 deltas 目录: ${deltasDir}`);
    console.log('  请先创建 Delta 变更文件\n');
    return;
  }
  
  // 读取所有未归档的 Delta 文件
  const deltaFiles = fs.readdirSync(deltasDir)
    .filter(f => f.startsWith('delta-') && f.endsWith('.md'))
    .sort(); // 按文件名日期排序
  
  if (deltaFiles.length === 0) {
    console.log('  没有待合并的 Delta 文件\n');
    return;
  }
  
  console.log(`  找到 ${deltaFiles.length} 个 Delta 文件:`);
  deltaFiles.forEach(f => console.log(`    - ${f}`));
  
  // 解析 Delta 操作
  const operations = { ADDED: [], MODIFIED: [], REMOVED: [], RENAMED: [] };
  const conflicts = [];
  
  for (const file of deltaFiles) {
    const content = fs.readFileSync(path.join(deltasDir, file), 'utf-8');
    
    // 检测操作类型
    for (const op of Object.keys(operations)) {
      const regex = new RegExp(`## ${op}[\s\S]*?(?=## |$)`, 'g');
      const matches = content.match(regex);
      if (matches) {
        operations[op].push({ file, sections: matches });
      }
    }
  }
  
  // 检测冲突（同 target_id 多 delta）
  const targetIds = new Map();
  for (const [op, deltas] of Object.entries(operations)) {
    for (const delta of deltas) {
      const idMatches = delta.sections.join('').match(/###?\s*(FR-\d+|NFR-\d+|TC-\d+)/g);
      if (idMatches) {
        for (const id of idMatches) {
          const cleanId = id.replace(/^###?\s*/, '');
          if (!targetIds.has(cleanId)) targetIds.set(cleanId, []);
          targetIds.get(cleanId).push({ file: delta.file, op });
        }
      }
    }
  }
  
  // 检查冲突
  for (const [id, sources] of targetIds) {
    if (sources.length > 1) {
      const hasRemove = sources.some(s => s.op === 'REMOVED');
      const hasModify = sources.some(s => s.op === 'MODIFIED');
      if (hasRemove && hasModify) {
        conflicts.push({ id, sources, type: 'REMOVED + MODIFIED' });
      } else if (sources.length > 1) {
        conflicts.push({ id, sources, type: 'MULTIPLE OPERATIONS' });
      }
    }
  }
  
  // 输出结果
  console.log('\n  合并分析:');
  console.log(`    ADDED: ${operations.ADDED.length} 个`);
  console.log(`    MODIFIED: ${operations.MODIFIED.length} 个`);
  console.log(`    REMOVED: ${operations.REMOVED.length} 个`);
  console.log(`    RENAMED: ${operations.RENAMED.length} 个`);
  
  if (conflicts.length > 0) {
    console.log('\n  ⚠ 检测到冲突:');
    for (const c of conflicts) {
      console.log(`    ${c.id}: ${c.type}`);
      c.sources.forEach(s => console.log(`      - ${s.file} (${s.op})`));
    }
    console.log('\n  请手动解决冲突后重新合并\n');
    return;
  }
  
  // 应用合并（按顺序：RENAMED → ADDED → MODIFIED → REMOVED）
  const specFiles = ['requirement-scope.md', 'architecture.md', 'database.md', 'api-design.md'];
  const mergeOrder = ['RENAMED', 'ADDED', 'MODIFIED', 'REMOVED'];

  console.log('\n  合并顺序: RENAMED → ADDED → MODIFIED → REMOVED');
  console.log('  目标规格文件: ' + specFiles.join(', '));

  // 尝试自动合并简单的 ADDED 操作到 spec 文件
  let autoApplied = 0;
  const specDir = path.join(CWD, 'docs', 'sdd', featureName);

  for (const op of mergeOrder) {
    for (const delta of operations[op]) {
      for (const section of delta.sections) {
        // 提取目标 spec 文件
        for (const specFile of specFiles) {
          const specPath = path.join(specDir, specFile);
          if (!fs.existsSync(specPath)) continue;

          let specContent = fs.readFileSync(specPath, 'utf-8');

          if (op === 'ADDED') {
            // 简单 ADDED: 追加新条目到对应 spec 文件末尾
            const frMatches = section.match(/###?\s*(FR-\d+|NFR-\d+|TC-\d+)[\s\S]*?(?=###?\s*(?:FR-|NFR-|TC-)|$)/g);
            if (frMatches && !conflicts.length) {
              for (const fr of frMatches) {
                if (!specContent.includes(fr.trim().split('\n')[0])) {
                  specContent += '\n\n' + fr.trim();
                  autoApplied++;
                }
              }
              fs.writeFileSync(specPath, specContent, 'utf-8');
            }
          } else if (op === 'MODIFIED') {
            // 简单 MODIFIED: 查找并替换匹配的条目
            const idMatch = section.match(/###?\s*(FR-\d+|NFR-\d+|TC-\d+)/);
            if (idMatch && !conflicts.length) {
              const targetId = idMatch[1];
              const modifiedMatch = section.match(/修改为:\s*([\s\S]*?)(?=\n- |\n##|$)/);
              if (modifiedMatch && specContent.includes(targetId)) {
                console.log(`    ⚡ 检测到 MODIFIED ${targetId}，需要人工确认修改内容`);
                console.log(`       变更内容: ${modifiedMatch[1].trim().substring(0, 80)}...`);
              }
            }
          } else if (op === 'REMOVED') {
            // REMOVED: 标记而非直接删除，避免数据丢失
            const idMatch = section.match(/###?\s*(FR-\d+|NFR-\d+|TC-\d+)/);
            if (idMatch) {
              console.log(`    ⚠ REMOVED ${idMatch[1]}: 请手动从 spec 中移除或标记为 DEPRECATED`);
            }
          }
        }
      }
    }
  }

  // 生成合并报告
  const reportPath = path.join(deltasDir, 'merge-report.md');
  const now = new Date().toISOString().slice(0, 10);
  let report = `# Delta 合并报告\n\n`;
  report += `> 合并日期: ${now}\n`;
  report += `> 功能: ${featureName}\n`;
  report += `> Delta 文件数: ${deltaFiles.length}\n`;
  report += `> 自动应用: ${autoApplied} 条 ADDED 条目\n\n`;

  report += `## 合并结果\n\n`;
  report += `| 操作 | 数量 | 自动应用 |\n`;
  report += `|------|------|----------|\n`;
  for (const op of mergeOrder) {
    const count = operations[op].length;
    const auto = op === 'ADDED' ? autoApplied : 0;
    report += `| ${op} | ${count} | ${auto} |\n`;
  }

  report += `\n## 冲突\n\n`;
  if (conflicts.length === 0) {
    report += `无冲突\n`;
  } else {
    for (const c of conflicts) {
      report += `- ${c.id}: ${c.type}\n`;
    }
  }

  report += `\n## 待手动处理\n\n`;
  report += `- MODIFIED 和 REMOVED 操作需要人工确认后更新主规格文档\n`;
  report += `- 目标文件: ${specFiles.map(f => path.join(specDir, f)).join(', ')}\n\n`;

  report += `\n## Delta 文件清单\n\n`;
  deltaFiles.forEach(f => report += `- ${f}\n`);

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n  ✓ 合并报告已生成: ${reportPath}`);
  if (autoApplied > 0) console.log(`  ✓ ${autoApplied} 条 ADDED 条目已自动应用到规格文档`);

  // 归档 Delta 文件
  const archiveDir = path.join(deltasDir, 'archive', now);
  fs.mkdirSync(archiveDir, { recursive: true });

  for (const file of deltaFiles) {
    fs.renameSync(
      path.join(deltasDir, file),
      path.join(archiveDir, file)
    );
  }
  console.log(`  ✓ ${deltaFiles.length} 个 Delta 文件已归档到: ${archiveDir}`);

  if (autoApplied === 0 && operations['MODIFIED'].length === 0 && operations['REMOVED'].length === 0) {
    console.log('\n  ✅ 所有变更已自动应用，无需手动操作\n');
  } else {
    console.log('\n  📝 MODIFIED/REMOVED 操作需手动更新主规格文档\n');
}

// ─── Utils ────────────────────────────────────────────────────────────────────
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
