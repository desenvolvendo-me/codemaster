// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const [repoOwner = 'marcodotcastro', repoName = 'codemaster'] =
	(process.env.GITHUB_REPOSITORY || 'marcodotcastro/codemaster').split('/');

const isGithubPages =
	process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
	site: `https://${repoOwner}.github.io`,
	base: isGithubPages ? `/${repoName}` : '/',
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
						{ label: 'Q&A 3.2', slug: 'trainning/q-and-a-3-2' },
					],
				},
			],
		}),
	],
});
