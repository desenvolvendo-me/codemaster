# CodeMaster Documentation Site

Esta pasta contém a configuração Astro + Starlight para publicar o conteúdo de treinamento do CodeMaster no GitHub Pages.

## Architecture

O site segue a mesma ideia usada no BMAD: o conteúdo fica em `docs/` na raiz do repositório e o Astro serve esse material a partir de um symlink.

```text
codemaster/
├── docs/                           # Conteúdo em Markdown no root
│   ├── index.mdx
│   ├── project-context.md
│   └── trainning/
│       ├── index.mdx
│       ├── lesson-1.md
│       ├── lesson-2.md
│       └── ...
└── website/
    ├── astro.config.mjs            # Config Astro + Starlight
    ├── src/
    │   ├── content/
    │   │   └── docs -> ../../../docs
    │   └── styles/
    │       └── custom.css
    └── public/
        └── trainning/raw/          # HTML/TXT originais publicados como material legado
```

## Development

Da raiz do repositório:

```sh
npm run docs:dev
npm run docs:build
npm run docs:preview
```

O site do `website/` exige Node 22.12+.
Se você usa `nvm`, rode `nvm use` dentro de `website/` antes de desenvolver.

## Platform Notes

### Windows Symlink Support

O symlink `website/src/content/docs` pode não funcionar corretamente no Windows sem Developer Mode habilitado ou privilégios de administrador.

Para habilitar symlinks no Windows:

1. Ative o Developer Mode:
   `Settings -> Update & Security -> For developers -> Developer Mode: On`
2. Ou habilite symlinks no Git:
   `git config core.symlinks true`
3. Ou crie uma junction manualmente:
   `mklink /J website\\src\\content\\docs ..\\..\\..\\docs`

Se symlink não funcionar, remova o link e copie a pasta `docs/` para `website/src/content/docs`.

## Build Output

O pipeline `npm run docs:build` gera um site estático em `build/site/`, pronto para publicação no GitHub Pages.
