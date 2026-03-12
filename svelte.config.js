import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';

const target = process.env.BUILD_TARGET || 'node';
const isAndroid = target === 'android';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: isAndroid
			? adapterStatic({
					pages: 'build',
					assets: 'build',
					fallback: 'index.html'
			  })
			: adapterNode()
	}
};

export default config;