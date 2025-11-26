// Script simples para testar se o servidor está funcionando
const http = require('http');

console.log('\n🧪 TESTANDO SERVIDOR...\n');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ SERVIDOR ESTÁ FUNCIONANDO!\n');
    console.log('📡 Status:', res.statusCode);
    console.log('📄 Resposta:', data);
    console.log('\n✅ Backend OK! Agora configure o IP no app.\n');
  });
});

req.on('error', (error) => {
  console.log('❌ ERRO: Servidor NÃO está rodando!\n');
  console.log('Detalhes:', error.message);
  console.log('\n🔧 Solução: Execute "npm start" na pasta backend\n');
});

req.end();

