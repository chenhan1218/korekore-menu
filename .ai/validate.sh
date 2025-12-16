# KoreKore 專案驗證腳本

# 這個腳本用於驗證專案是否遵守所有 AI agent 規則

validate_all() {
  npm run type-check && \
  npm run lint && \
  npm run test:run && \
  npm run build
}

validate_all
