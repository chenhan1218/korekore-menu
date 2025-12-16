# 📑 AI Agent 文件索引

> 根據你的需求，只讀取必要的文件，節省 token

## 🎯 按使用場景選擇

### 場景 1: 第一次使用這個專案
**讀這個** → `.ai/QUICKSTART.md` (500 tokens)

### 場景 2: 開發新功能
**讀這些** →
- `.ai/QUICKSTART.md` (500 tokens)
- `.ai/prompts/new-feature.md` (1,000 tokens)
- 相關 ADR（按需）

### 場景 3: 修復 Bug
**讀這些** →
- `.ai/QUICKSTART.md` (500 tokens)
- 測試檔案（了解預期行為）

### 場景 4: 重構代碼
**讀這些** →
- `.ai/QUICKSTART.md` (500 tokens)
- 相關 ADR（了解設計決策）
- `TESTING.md`（確保測試覆蓋）

### 場景 5: 深入了解架構
**讀這些** →
- `CLAUDE.md` (5,400 tokens) - 完整工作模式
- `docs/adr/README.md` - ADR 索引
- 相關技術 ADR

---

## 📊 文件 Token 消耗表

| 文件 | Token | 用途 | 優先級 |
|------|-------|------|--------|
| `.ai/QUICKSTART.md` | 500 | 快速上手 | 🔴 必讀 |
| `.ai/prompts/new-feature.md` | 1,000 | 開發流程 | 🟡 按需 |
| `.ai/rules.md` | 9,200 | 詳細規則 | 🟢 參考 |
| `CLAUDE.md` | 5,400 | 完整指南 | 🟢 參考 |
| `.ai/README.md` | 7,100 | 通用指南 | 🟢 參考 |
| `TESTING.md` | ~3,000 | 測試指南 | 🟡 按需 |
| 單個 ADR | ~1,500 | 決策記錄 | 🟡 按需 |

---

## 🚀 推薦讀取策略

### Claude Code（Context: 200k tokens）
```
啟動時：
  ✅ 讀 QUICKSTART.md (500 tokens)
  ✅ 讀專案 README.md (1,000 tokens)

需要時：
  ✅ 讀相關 ADR
  ✅ 讀 prompts
  ✅ 讀完整文件
```

### Gemini CLI（Context: 32k-128k tokens）
```
啟動時：
  ✅ 只讀 QUICKSTART.md (500 tokens)
  ✅ 只讀任務相關的 prompt

絕對不要：
  ❌ 不要讀 CLAUDE.md
  ❌ 不要讀 .ai/README.md
  ❌ 不要一次讀多個 ADR
```

### GitHub Copilot（Context: 小）
```
依賴：
  ✅ 現有代碼模式
  ✅ 註解中的指引

輔助：
  ✅ 偶爾參考 QUICKSTART.md
```

---

## 💡 使用範例

### Claude Code
```bash
# 開始新任務時
cat .ai/QUICKSTART.md      # 500 tokens
cat .ai/prompts/new-feature.md  # 1,000 tokens
# 總計: 1,500 tokens ✅（原本 30,000）
```

### Gemini CLI
```bash
# 精簡模式
gemini "$(cat .ai/QUICKSTART.md)

請根據以上規則，幫我實作菜單掃描功能"
# 總計: 500 tokens ✅
```

---

## 🎓 學習路徑

```
第 1 天：QUICKSTART.md
  ↓
第 2-3 天：prompts + 相關 ADR
  ↓
第 4-5 天：CLAUDE.md（深入理解）
  ↓
隨時：按需查閱詳細文件
```

---

**Token 優化成果**: 從 30,000 → 500 tokens（減少 98%）
