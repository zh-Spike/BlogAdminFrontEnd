module.exports = {
	devServer: {
		proxy: {
			'/user': {
				target: 'http://localhost:8082',
				changeOrigin: true
			},
			'/admin': {
				target: 'http://localhost:8082',
				changeOrigin: true
			}
		}
	}
};