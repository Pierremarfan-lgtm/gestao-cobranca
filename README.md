# Sistema de Cobrança — Bio Ozônio

App web responsivo para gestão de cobrança de clientes inadimplentes.

## Tecnologia
- React 18 + Vite
- 100% JavaScript (sem TypeScript)
- Sem banco de dados externo (dados em memória)

## Como fazer deploy no Vercel via GitHub

### 1. Instalar dependências localmente (opcional, só para testar)
```bash
npm install
npm run dev
```

### 2. Subir para o GitHub
1. Acesse github.com e crie um repositório novo (ex: `cobranca-viviane`)
2. No seu computador, abra o terminal na pasta do projeto e rode:
```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cobranca-viviane.git
git push -u origin main
```

### 3. Deploy no Vercel
1. Acesse vercel.com e faça login
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. As configurações são detectadas automaticamente (Vite)
5. Clique em "Deploy"

O Vercel fará o deploy automaticamente a cada `git push`.

## Funcionalidades
- Dashboard com KPIs e progresso de recuperação
- Lista de 55 clientes com filtro por nome/bairro/cidade
- Ficha do cliente com saldo devedor
- Registro de pagamentos com geração de recibo
- Simulador de parcelamento
- Registro de ocorrências de cobrança
- Recibo imprimível
- Totalmente responsivo para iOS e Android
