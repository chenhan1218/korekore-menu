# Architecture Decision Records (ADRs)

本目錄記錄 KoreKore 專案的重要技術決策。

## 什麼是 ADR？

Architecture Decision Record (ADR) 是記錄重要架構決策的文件格式。每個決策都應該記錄：
- **Context**: 為什麼需要做這個決策？
- **Decision**: 我們決定做什麼？
- **Consequences**: 這個決策的優缺點是什麼？

## ADR 列表

| ID | 標題 | 狀態 | 日期 |
|----|------|------|------|
| [ADR-001](./001-state-management-zustand.md) | 選擇 Zustand 作為狀態管理工具 | Accepted | 2025-12-16 |
| [ADR-002](./002-ui-abstraction-layer.md) | 建立 UI 抽象層 | Accepted | 2025-12-16 |
| [ADR-003](./003-firebase-backend.md) | 使用 Firebase 作為後端服務 | Accepted | 2025-12-16 |
| [ADR-004](./004-tailwind-css-v4.md) | 採用 Tailwind CSS v4 | Accepted | 2025-12-16 |

## 如何新增 ADR

1. 複製 `000-template.md` 作為起點
2. 編號使用遞增序號（例如：005）
3. 檔名格式：`{編號}-{簡短描述}.md`
4. 更新本 README 的 ADR 列表

## ADR 狀態

- **Proposed**: 提議中
- **Accepted**: 已接受
- **Deprecated**: 已棄用
- **Superseded**: 被取代（註明被哪個 ADR 取代）
