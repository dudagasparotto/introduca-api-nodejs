const db = require('../dataBase/connection');

module.exports = {
    async listarMotorista(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'listar motorista',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao listar motorista',
                    dados: null 
 }); 
                }           
    },

            async cadastrarMotorista(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Cadastrar motorista',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao cadastrar motorista',
                    dados: null 
 }); 
               } 
            }, 
            async atualizarMotorista(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'atualizar motorista',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar motorista',
                    dados: null 
 }); 
               } 
            },   
            async apagarMotorista(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'apagar motorista',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao apagar motorista',
                    dados: null 
 }); 
               }
            }                           
    };