# Projeto CONTA365 - Nodejs Expressjs API

[![Author]()](https://github.com/guicollab) 

API financeira para gerenciar usuários e suas respectivas despesas pessoais.

## Sobre o Projeto

Desenvolvido no curso DEVinHouse 

## Requerido

- Node.js
- Express

## Como Utilizar

### Usando Git

1.  Clone o projeto do github. Altere "DEVinBank" para o nome do seu projeto.

```bash
git clone https://github.com/guicollab/DEVinBank.git ./nomeProjeto
```

### Download Manual (ZIP)

1.  Acesse o Projeto
2.  Code / Download ZIP
3.  Descompacte no diretório desejado

### Instalar as dependências npm depois da instalação (via Git ou Download ZIP)

```bash
cd nomeProjeto
npm install
```

### Executar o Projeto

```bash
npm start
```

Acesse a URL: http://localhost:3333

- Documentação dos Endpoint's via Swagger

  Para acessar as especificações dos endpoint acesse o endereço: http://localhost:3333/api-docs 


## Estrutura do Projeto

```sh
.
├── src
│   └── controllers
│       ├── financialController.js
│       └── userController.js
│   └── database
│       ├── financial.json
│       └── users.json
│   └── routes
│       └── v1
│           ├── financial.routes.js
│           └── user.routes.js
│       └── index.js
│   └── services
│   └── utils
│       ├── constants.js
│       └── functions.js
│       └── swagger.js
│   ├── server.js
│   ├── swagger_output.json
```

