const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });  // Cambiar a 0.0.0.0 para aceptar conexiones externas

wss.on('connection', (ws) => {
    console.log('Un cliente se ha conectado');
    
    ws.send(JSON.stringify({ message: 'Bienvenido al servidor WebSocket' }));

    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);

        try {
            const data = JSON.parse(message);
            if (data.dni && data.mensaje) {
                console.log(`Enviando mensaje a todos: DNI: ${data.dni}, Mensaje: ${data.mensaje}`);
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ dni: data.dni, mensaje: data.mensaje }));
                    }
                });
            } else {
                console.error('Faltan datos: DNI o mensaje no recibido');
            }
        } catch (err) {
            console.error('Error al procesar el mensaje:', err);
        }
    });

    ws.on('close', () => {
        console.log('Un cliente se ha desconectado');
    });
});

console.log('Servidor WebSocket corriendo en ws://0.0.0.0:8080');
