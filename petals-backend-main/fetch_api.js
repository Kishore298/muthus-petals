import fs from 'fs';
import https from 'https';

async function fetchAndMigrate() {
    try {
        console.log('Fetching products from GET API...');
        const productsResponse = await fetch('https://petals-backend.vercel.app/api/v1/products');
        const productsData = await productsResponse.json();
        const oldProducts = productsData.product || [];
        
        console.log('Found ' + oldProducts.length + ' products.');
        fs.writeFileSync('products_backup.json', JSON.stringify(oldProducts, null, 2));
        
        console.log('Successfully saved to products_backup.json');
    } catch(err) {
        console.error(err);
    }
}
fetchAndMigrate();
