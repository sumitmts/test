// test merchant hosted at render, it includes checkout.js which is served by dev desktop ->

const http = require('http');
const url = require('url');


const server = http.createServer((req, res) => {

    // Parse the URL to get pathname without query parameters
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname || '/'; // Default to '/' if pathname is empty


    const isHtmlPath = ['/', '/checkout'].includes(pathname);
    const contentType = isHtmlPath ? 'text/html' : 'application/json';

    res.writeHead(200, { 'Content-Type': contentType });

    const styles = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                -webkit-tap-highlight-color: transparent;
            }

            body {
                background-color: #f5f5f5;
                padding: 0;
                margin: 0;
            }

            .header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: #232f3e;
                color: white;
                display: flex;
                align-items: center;
                padding: 0 16px;
                z-index: 1000;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .content {
                margin-top: 60px;
                padding: 16px;
            }

            .product-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .product-card {
                background: white;
                border-radius: 8px;
                padding: 12px;
                display: flex;
                align-items: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .product-image {
                width: 80px;
                height: 80px;
                background: #f0f0f0;
                border-radius: 4px;
                margin-right: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .product-details {
                flex: 1;
            }

            .product-title {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 4px;
            }

            .price {
                color: #232f3e;
                font-size: 18px;
                font-weight: bold;
                margin: 4px 0;
            }

            .btn {
                background-color: #ff9900;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                width: 100%;
                margin-top: 8px;
                touch-action: manipulation;
            }

            .btn:active {
                background-color: #ff8800;
                transform: scale(0.98);
            }

            .checkout-container {
                padding: 16px;
                background: white;
            }

            .loading {
                text-align: center;
                padding: 20px;
                color: #666;
            }

            .back-button {
                color: white;
                text-decoration: none;
                font-size: 24px;
                margin-right: 16px;
            }

            @media (max-width: 360px) {
                .product-image {
                    width: 60px;
                    height: 60px;
                }

                .product-title {
                    font-size: 14px;
                }

                .price {
                    font-size: 16px;
                }
            }
        </style>
    `;

    const routes = {
        '/': `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Mobile Store</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                ${styles}
                <script src="https://dev-dsk-sumitkux-cdd-1c-04ea29cc.eu-west-1.amazon.com/checkout.js"></script>
            </head>
            <body>
                <div class="header">
                    <h1>Store</h1>
                </div>
                <div class="content">
                    <div class="product-list">
                        <div class="product-card">
                            <div class="product-image">P1</div>
                            <div class="product-details">
                                <div class="product-title">Premium Widget</div>
                                <div class="price">$29.99</div>
                                <button class="btn" onclick="goToCheckout('prod1')">Buy Now</button>
                            </div>
                        </div>
                        <div class="product-card">
                            <div class="product-image">P2</div>
                            <div class="product-details">
                                <div class="product-title">Super Gadget</div>
                                <div class="price">$49.99</div>
                                <button class="btn" onclick="goToCheckout('prod2')">Buy Now</button>
                            </div>
                        </div>
                        <div class="product-card">
                            <div class="product-image">P3</div>
                            <div class="product-details">
                                <div class="product-title">Mega Device</div>
                                <div class="price">$79.99</div>
                                <button class="btn" onclick="goToCheckout('prod3')">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
                <script>
                    function goToCheckout(productId) {
                        window.location.href = '/checkout?product=' + productId;
                    }
                </script>
            </body>
            </html>
        `,
        '/checkout': `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Checkout</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                ${styles}
                <script src="https://dev-dsk-sumitkux-cdd-1c-04ea29cc.eu-west-1.amazon.com/checkout.js"></script>
            </head>
            <body>
                <div class="header">
                    <a href="/" class="back-button">Back</a>
                    <h1>Checkout</h1>
                </div>
                <div class="content">
                    <div class="checkout-container">
                        <div id="checkout-content">
                            <div class="loading">
                                <div>Processing your order...</div>
                                <div id="product-info" style="margin-top: 8px; font-size: 14px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <script>
                    const urlParams = new URLSearchParams(window.location.search);
                    const productId = urlParams.get('product');
                    document.getElementById('product-info').textContent = 'Order ID: ' + productId;
                </script>
            </body>
            </html>
        `,
        '/api': { message: 'API endpoint' },
        '/health': { status: 'healthy' }
    };

    // Use pathname instead of req.url.split('?')[0]
    const returnContent = routes[pathname] || '404 Not Found';
    res.end(isHtmlPath ? returnContent : JSON.stringify(returnContent));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
