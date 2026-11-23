# Como publicar nos Escritos

Cada texto é um arquivo Markdown na pasta `blog/textos/`. Não há etapa de
build: dá para fazer tudo pelo site do GitHub.

## 1. Crie o arquivo

Em `blog/textos/`, clique em **Add file → Create new file** e dê um nome
no formato:

```
AAAA-MM-DD-titulo-curto.md
```

Use só letras minúsculas sem acento, números e hífens. Exemplo:
`2026-12-02-sobre-precisao.md`. O nome vira o endereço do texto:
`blog/texto.html?t=2026-12-02-sobre-precisao`.

## 2. Escreva o cabeçalho e o texto

```markdown
---
titulo: Sobre precisão
data: 2026-12-02
resumo: Uma ou duas linhas que aparecem na lista e abaixo do título.
idioma: pt
---

O primeiro parágrafo ganha capitular automaticamente.

## Um intertítulo

> Uma citação.

- Um item de lista

---

Depois do separador, o texto continua.
```

| Campo      | Obrigatório | O que faz                                          |
|------------|-------------|----------------------------------------------------|
| `titulo`   | sim         | Título do texto                                    |
| `data`     | sim         | `AAAA-MM-DD`; define a ordem da lista              |
| `resumo`   | não         | Aparece na lista e como subtítulo                  |
| `idioma`   | não         | `pt` (padrão) ou `en`, para hifenização e leitores |
| `rascunho` | não         | `sim` esconde o texto da lista                     |

A aba **Preview** do GitHub mostra o Markdown formatado enquanto você escreve.

## 3. Coloque o texto na lista

Abra `blog/textos.json` e acrescente o nome do arquivo, entre aspas, com
vírgula separando os itens:

```json
[
  "2026-12-02-sobre-precisao.md",
  "2026-11-23-como-este-blog-compoe-um-texto.md"
]
```

A ordem no arquivo não importa: a lista se ordena pela `data`. Cuidado só
com a vírgula: não pode haver vírgula depois do último item.

## Imagens

Envie a imagem para `blog/textos/img/` e escreva:

```markdown
![Descrição para quem não vê a imagem](img/foto.webp "Legenda opcional")
```

Com legenda, a imagem vira uma figura com o texto embaixo. Prefira `.webp`
com até 1600 px de largura.

## Para tirar um texto do ar

Apague o nome dele de `textos.json` (ou use `rascunho: sim`). O texto de
exemplo pode ser apagado quando você publicar o primeiro.
