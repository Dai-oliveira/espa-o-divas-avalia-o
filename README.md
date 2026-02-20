# App de Avaliação

Aplicação web estática para coleta de avaliações de atendimento de salão, com envio da avaliação para WhatsApp, armazenamento local e painel simples de métricas.

## Visão geral

O projeto permite que clientes preencham um formulário de feedback com:

- Nome
- Categoria e subserviço
- Humor no atendimento (emoji)
- Nível de satisfação (1 a 5)
- Indicação (sim/talvez/não)
- Comentário opcional
- Autorização de uso do feedback nas redes sociais

Após envio:

- A avaliação é salva no `localStorage`
- A janela do WhatsApp é aberta com a mensagem formatada
- O painel lateral atualiza métricas (total, média e taxa de indicação)

## Funcionalidades

- Formulário com validação de campos obrigatórios
- Seletor dinâmico de subserviços por categoria
- Contador de caracteres no comentário
- Cartinhas motivacionais com mensagem aleatória sem repetição imediata
- Feedback visual com toast e card de agradecimento
- Dashboard com métricas calculadas em tempo real
- Bloco de contatos, Instagram e mapa incorporado
- Layout responsivo para desktop e mobile

## Estrutura do projeto

- `index.html`: estrutura da página
- `style.css`: estilos e responsividade
- `script.js`: regras de interação, validação, métricas e integração com WhatsApp
- `logosalão.png`: logo exibida no banner

## Como executar

Por ser um projeto estático, não exige instalação de dependências.

1. Abra o arquivo `index.html` no navegador.
2. Ou rode com um servidor local simples (opcional), por exemplo com a extensão Live Server no VS Code.

## Persistência de dados

As avaliações ficam armazenadas no navegador usando a chave:

- `avaliacoes_clientes`

Para limpar os dados, apague essa chave no `localStorage` (DevTools do navegador).

## Integração com WhatsApp

O envio usa a URL `https://wa.me/` e o número configurado em `script.js`:

- `OWNER_WHATSAPP_NUMBER = "55996052565"`

Se quiser trocar o número de destino, altere essa constante.

## Observações

- O app depende de JavaScript habilitado.
- O `localStorage` é por navegador/dispositivo, então os dados não são compartilhados entre aparelhos.
- O envio para WhatsApp abre uma nova aba/janela no momento do envio do formulário.
