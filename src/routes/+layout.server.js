import { BUILD_TARGET } from '$env/static/private';

export const prerender = BUILD_TARGET === 'android';

export function load() {
	return {
		isAndroid: BUILD_TARGET === 'android'
	};
}