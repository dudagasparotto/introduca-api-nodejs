const db = require('../dataBase/connection');

module.exports = {
    async listarUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'listar usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao listar usuário',
                    dados: null 
 }); 
                }           
    },

            async cadastrarUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Cadastrar usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao cadastrar usuário',
                    dados: null 
 }); 
               } 
            }, 
            async atualizarUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'atualizar usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar usuário',
                    dados: null 
 }); 
               } 
            },   
            async apagarUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'apagar Tipos de usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar usuário',
                    dados: null 
 }); 
               }
            }                           
    };