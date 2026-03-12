import { BUILD_TARGET } from '$env/static/private';

export const prerender = BUILD_TARGET === 'android';