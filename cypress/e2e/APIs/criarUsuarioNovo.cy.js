const fs = require('fs'); // ✅ Adicione isso no topo
import verificarResponse from '../../support/commands.js';


describe.only('Should API Test - GET', () => {
    
    it('Retorna a lista de usuários', () => {
        cy.request({
            method: 'GET',
            url: 'https://serverest.dev/usuarios',
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.writeFile('cypress/response/user.json', response.body);
        })
    });

    it('Criar novo usuário', () => {
        const filePath = 'cypress/response/createUser.json';

        // Informações do usuário: 
        const requestBody = {
            nome: "ID 03", // Nome do usuário
            email: "ID03@teste.com", // Email do usuário
            password: "teste", // Senha do usuário
            administrador: "true" // Se o usuário é administrador
        };

        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/usuarios',
            body: requestBody
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');

            // Captura os dados enviados + o _id retornado
            const userData = {
                id: response.body._id,
                ...requestBody
            };

            // Verifica se o arquivo existe e salva ou atualiza
            cy.task('fileExists', filePath).then((exists) => {
                if (exists) {
                cy.readFile(filePath).then((existingUsers) => {
                    const users = Array.isArray(existingUsers) ? existingUsers : [];
                    const updatedUsers = [...users, userData];
                    cy.writeFile(filePath, updatedUsers);
                });
                } else {
                cy.writeFile(filePath, [userData]);
                }
            });
        });
    });


    it('Realizar Login', () => {
        const filePath = 'cypress/response/statusLogin.json';

        const loginData = {
            email: "teste_11@teste.com",
            password: "teste"
        };

        cy.request({
            method: 'POST',
            url: 'https://serverest.dev/login',
            body: loginData,
            failOnStatusCode: false // evita quebra caso login falhe
        }).then((response) => {
            expect([200, 401]).to.include(response.status); // aceita sucesso ou falha, dependendo do teste

            const loginResult = {
                status: response.status,
                message: response.body.message,
                token: response.body.authorization || null,
                timestamp: new Date().toISOString(),
                email: loginData.email
            };

            // Verifica se já existe histórico
            cy.task('fileExists', filePath).then((exists) => {
                if (exists) {
                cy.readFile(filePath).then((existingLogins) => {
                    const logins = Array.isArray(existingLogins) ? existingLogins : [];
                    const updatedLogins = [...logins, loginResult];
                    cy.writeFile(filePath, updatedLogins);
                });
                } else {
                cy.writeFile(filePath, [loginResult]);
                }
            });
        });
    });
});



