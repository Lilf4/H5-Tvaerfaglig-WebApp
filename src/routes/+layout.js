const isAndroid = process.env.BUILD_TARGET === 'android';

export const prerender = isAndroid;