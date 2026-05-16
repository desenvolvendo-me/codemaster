// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const [repoOwner = 'marcodotcastro', repoName = 'codemaster'] =
	(process.env.GITHUB_REPOSITORY || 'marcodotcastro/codemaster').split('/');

const astroCommand = process.argv[2] || '';
const isDevServer = astroCommand === 'dev';

export default defineConfig({
	site: `https://${repoOwner}.github.io`,
	// GitHub Pages deploys this repo as a project site under /<repoName>/.
	// Keep local dev at root, but force any static build to emit Pages-safe URLs.
	base: isDevServer ? '/' : `/${repoName}`,
	outDir: '../build/site',
	output: 'static',
	vite: {
		server: {
			fs: {
				allow: ['..'],
			},
		},
	},
	integrations: [
		starlight({
			title: 'CodeMaster Docs',
			description:
				'Treinamentos do CodeMaster publicados em Markdown e convertidos para HTML com Astro + Starlight.',
			customCss: ['./src/styles/custom.css'],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: `https://github.com/${repoOwner}/${repoName}`,
				},
			],
			sidebar: [
				{
					label: 'Aula 1: Apresentação',
					items: [
						{
							label: 'Visão Geral',
							slug: 'trainning/lesson-1',
						},
						{ label: 'Q&A 1.1', slug: 'trainning/q-and-a-1-1' },
						{ label: 'Q&A 1.2', slug: 'trainning/q-and-a-1-2' },
					],
				},
				{
					label: 'Aula 2: Workflow & XP',
					items: [
						{ label: 'Visão Geral', slug: 'trainning/lesson-2' },
						{ label: 'Q&A 2.1', slug: 'trainning/q-and-a-2-1' },
						{ label: 'Q&A 2.2', slug: 'trainning/q-and-a-2-2' },
					],
				},
				{
					label: 'Aula 3: BMAD + XP',
					items: [
						{ label: 'Visão Geral', slug: 'trainning/lesson-3' },
						{ label: 'Q&A 3.2', slug: 'trainning/q-and-a-3-2' },
					],
				},
				{
					label: 'Aula 4: Portal Agro',
					items: [{ label: 'Visão Geral', slug: 'trainning/lesson-4' }],
				},
				{
					label: 'Aula Bônus: Brownfield to TEA',
					items: [{ label: 'Visão Geral', slug: 'trainning/lesson-bonus-1' }],
				},
			],
		}),
	],
});
