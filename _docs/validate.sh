#!/bin/bash

# 🧪 Script de Validação - Refatoração Led Panel Manager
# Execute este script após cada etapa para validar a integridade do projeto

echo "🚀 Iniciando validação do projeto..."
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Função para imprimir warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função para imprimir info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
print_info "Verificando estrutura do projeto..."

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório raiz do projeto React${NC}"
    exit 1
fi

# 2. Verificar dependências
print_info "Verificando dependências npm..."
npm list --depth=0 > /dev/null 2>&1
print_status $? "Dependências npm instaladas"

# 3. Verificar syntax/lint (básico)
print_info "Verificando sintaxe dos arquivos..."

# Contar erros de sintaxe em arquivos JSX/JS
error_count=0

# Verificar arquivos principais
main_files=("src/App.jsx" "src/main.jsx" "src/Paineis.jsx")
for file in "${main_files[@]}"; do
    if [ -f "$file" ]; then
        # Verificação básica de sintaxe com node
        node -c "$file" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}  ✅ $file${NC}"
        else
            echo -e "${RED}  ❌ $file - Erro de sintaxe${NC}"
            ((error_count++))
        fi
    else
        print_warning "Arquivo $file não encontrado"
    fi
done

# 4. Verificar build
print_info "Testando build do projeto..."
npm run build > build_output.log 2>&1
build_status=$?

if [ $build_status -eq 0 ]; then
    print_status 0 "Build executado com sucesso"
    # Limpar arquivos de build para economizar espaço
    rm -rf dist/ 2>/dev/null
else
    print_status 1 "Build falhou - verifique build_output.log"
    echo ""
    echo "Últimas linhas do erro:"
    tail -10 build_output.log
fi

# 5. Verificar estrutura de refatoração (se existir)
print_info "Verificando estrutura de refatoração..."

refactor_dirs=("src/pages" "src/pages/Paineis" "_docs")
for dir in "${refactor_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}  ✅ $dir existe${NC}"
    else
        echo -e "${YELLOW}  ⏳ $dir não criado ainda${NC}"
    fi
done

# 6. Verificar documentação de refatoração
if [ -f "_docs/REFACTORING-PLAN.md" ]; then
    print_status 0 "Documentação de refatoração encontrada"
else
    print_status 1 "Documentação de refatoração não encontrada"
fi

# 7. Análise de tamanho de arquivos
print_info "Analisando tamanho dos arquivos..."
echo ""

# Encontrar arquivos com mais de 500 linhas
large_files=$(find src -name "*.jsx" -o -name "*.js" | xargs wc -l | awk '$1 > 500 {print $1 " linhas - " $2}' | head -10)

if [ -n "$large_files" ]; then
    echo "📊 Arquivos com mais de 500 linhas:"
    echo "$large_files"
else
    echo -e "${GREEN}✅ Nenhum arquivo com mais de 500 linhas encontrado${NC}"
fi

# 8. Resumo final
echo ""
echo "=================================="
print_info "RESUMO DA VALIDAÇÃO"
echo "=================================="

total_checks=4
passed_checks=0

# Contar sucessos
[ $error_count -eq 0 ] && ((passed_checks++))
[ $build_status -eq 0 ] && ((passed_checks++))
[ -f "_docs/REFACTORING-PLAN.md" ] && ((passed_checks++))
[ -f "package.json" ] && ((passed_checks++))

echo "Verificações passaram: $passed_checks/$total_checks"

if [ $passed_checks -eq $total_checks ] && [ $error_count -eq 0 ]; then
    echo -e "${GREEN}🎉 Todas as validações passaram! Pronto para próxima etapa.${NC}"
    exit 0
else
    echo -e "${RED}🚨 Algumas validações falharam. Corrija os problemas antes de continuar.${NC}"
    exit 1
fi

# Limpar arquivos temporários
rm -f build_output.log 2>/dev/null
