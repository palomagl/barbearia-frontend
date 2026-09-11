// URL base da API, configurável por ambiente.
//
// Em dev (`npm run dev`) o Vite carrega .env.development e aponta para o
// backend local (http://localhost:3000). Em build de produção (`npm run
// build`), carrega .env.production e aponta para o backend em produção.
// O fallback abaixo garante que nada quebra caso a variável não esteja
// definida (mesmo comportamento de antes, quando a URL era fixa no código).
export const apiURL = import.meta.env.VITE_API_URL || 'https://barbearia-backend-f6kd.onrender.com';
