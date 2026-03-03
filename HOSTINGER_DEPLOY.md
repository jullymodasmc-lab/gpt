# Deploy na Hostinger (JL STORE)

Este projeto é estático (HTML/CSS/JS), então o deploy na Hostinger é simples.

## 1) Gerar pacote para upload
No terminal do projeto, rode:

```bash
bash deploy-hostinger.sh
```

Isso cria:
- `deploy/jl-store-hostinger.zip` (arquivo para enviar)
- `deploy/site/` (conteúdo descompactado)

## 2) Upload via hPanel (mais fácil)
1. Acesse o **hPanel da Hostinger**.
2. Vá em **Hospedagem > Gerenciar > Arquivos > Gerenciador de arquivos**.
3. Entre na pasta `public_html`.
4. Faça upload de `jl-store-hostinger.zip`.
5. Extraia o zip dentro de `public_html`.
6. Se necessário, mova os arquivos para a raiz de `public_html` (onde fica o `index.html`).

## 3) Upload via FTP (alternativa)
Use FileZilla com dados da Hostinger:
- Host
- Usuário FTP
- Senha FTP
- Porta (geralmente 21)

Envie todos os arquivos para `public_html`.

## 4) Credenciais admin (frontend atual)
- Usuário: `admin`
- Senha: `jlstore123`

> **Importante:** esse login é client-side (não é seguro para produção real). Ideal migrar para backend autenticado.

## 5) Checklist pós-deploy
- Abrir `https://seu-dominio.com`
- Validar `https://seu-dominio.com/admin.html`
- Testar abas (Joias/Perfumes/Acessórios)
- Testar carrinho e botão de checkout WhatsApp
- Testar imagens dos banners

## 6) Problemas comuns
- **Página antiga em cache:** faça hard refresh (`Ctrl+F5`).
- **404 em arquivos:** confirme se `index.html`, `styles.css`, `script.js`, `admin.js` estão em `public_html`.
- **Banners não carregam:** verifique se a hospedagem permite saída HTTPS para imagens externas.
