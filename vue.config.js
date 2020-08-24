module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://192.168.106.128:8082',
                changeOrigin: true
            }
        }
    }
};