# 🧪 Script de Validação - Refatoração Led Panel Manager (PowerShell)
# Execute este script após cada etapa para validar a integridade do projeto

Write-Host "🚀 Iniciando validação do projeto..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Função para imprimir status com cores
function Write-Status {
    param($Success, $Message)
    if ($Success) {
        Write-Host "✅ $Message" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message" -ForegroundColor Red
    }
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

Write-Host ""
Write-Info "Verificando estrutura do projeto..."

# 1. Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script no diretório raiz do projeto React" -ForegroundColor Red
    exit 1
}

# 2. Verificar se npm está disponível
try {
    npm --version | Out-Null
    Write-Status $true "NPM encontrado"
} catch {
    Write-Status $false "NPM não encontrado"
    exit 1
}

# 3. Verificar dependências
Write-Info "Verificando dependências npm..."
try {
    $npmList = npm list --depth=0 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status $true "Dependências npm instaladas"
    } else {
        Write-Status $false "Problemas com dependências npm"
    }
} catch {
    Write-Status $false "Erro ao verificar dependências"
}

# 4. Verificar sintaxe dos arquivos principais
Write-Info "Verificando sintaxe dos arquivos..."
$errorCount = 0

$mainFiles = @("src/App.jsx", "src/main.jsx", "src/Paineis.jsx")
foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        # Verificação básica verificando se o arquivo pode ser lido
        try {
            $content = Get-Content $file -Raw
            if ($content -match "export.*default|function.*\(|const.*=") {
                Write-Host "  ✅ $file" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  $file - Estrutura suspeita" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ❌ $file - Erro ao ler arquivo" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Warning "Arquivo $file não encontrado"
    }
}

# 5. Verificar build
Write-Info "Testando build do projeto..."
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status $true "Build executado com sucesso"
        # Limpar diretório dist se existir
        if (Test-Path "dist") {
            Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
        }
    } else {
        Write-Status $false "Build falhou"
        Write-Host "Erro do build:" -ForegroundColor Red
        Write-Host ($buildOutput | Select-Object -Last 10) -ForegroundColor Red
    }
} catch {
    Write-Status $false "Erro ao executar build"
}

# 6. Verificar estrutura de refatoração
Write-Info "Verificando estrutura de refatoração..."

$refactorDirs = @("src/pages", "src/pages/Paineis", "_docs")
foreach ($dir in $refactorDirs) {
    if (Test-Path $dir) {
        Write-Host "  ✅ $dir existe" -ForegroundColor Green
    } else {
        Write-Host "  ⏳ $dir não criado ainda" -ForegroundColor Yellow
    }
}

# 7. Verificar documentação
if (Test-Path "_docs/REFACTORING-PLAN.md") {
    Write-Status $true "Documentação de refatoração encontrada"
} else {
    Write-Status $false "Documentação de refatoração não encontrada"
}

# 8. Análise de tamanho de arquivos
Write-Info "Analisando tamanho dos arquivos..."
Write-Host ""

$largeFiles = Get-ChildItem -Path "src" -Include "*.jsx", "*.js" -Recurse | 
    ForEach-Object { 
        $lineCount = (Get-Content $_.FullName | Measure-Object -Line).Lines
        if ($lineCount -gt 500) {
            "$lineCount linhas - $($_.Name)"
        }
    }

if ($largeFiles) {
    Write-Host "📊 Arquivos com mais de 500 linhas:" -ForegroundColor Yellow
    $largeFiles | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "✅ Nenhum arquivo com mais de 500 linhas encontrado" -ForegroundColor Green
}

# 9. Resumo final
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Info "RESUMO DA VALIDAÇÃO"
Write-Host "==================================" -ForegroundColor Cyan

$totalChecks = 4
$passedChecks = 0

# Contar sucessos
if ($errorCount -eq 0) { $passedChecks++ }
if ($LASTEXITCODE -eq 0) { $passedChecks++ }
if (Test-Path "_docs/REFACTORING-PLAN.md") { $passedChecks++ }
if (Test-Path "package.json") { $passedChecks++ }

Write-Host "Verificações passaram: $passedChecks/$totalChecks"

if ($passedChecks -eq $totalChecks -and $errorCount -eq 0) {
    Write-Host "🎉 Todas as validações passaram! Pronto para próxima etapa." -ForegroundColor Green
    exit 0
} else {
    Write-Host "🚨 Algumas validações falharam. Corrija os problemas antes de continuar." -ForegroundColor Red
    exit 1
}
