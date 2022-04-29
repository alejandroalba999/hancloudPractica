process.env.PORT = process.env.PORT || 3000;

let urlDB;
//mongodb+srv://admin:admin@cluster0.dyboa.mongodb.net/josemariaSigma?retryWrites=true&w=majority
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/InventarioHancloud"
} else {
    urlDB = "mongodb://localhost:27017/InventarioHancloud"
}

process.env.URLDB = urlDB;

process.env.SEED = process.env.SEED || 'Firma-Secreta';

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '1m';
