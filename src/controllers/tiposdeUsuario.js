const db = require('../dataBase/connection');

module.exports = {
    async listarTiposdeUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'listar Tipos de usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao listar tipos de usuário',
                    dados: null 
 }); 
                }           
    },

            async cadastrarTiposdeUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'Cadastrar Tipos de usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao cadastrar tipos de usuário',
                    dados: null 
 }); 
               } 
            }, 
            async atualizarTiposdeUsuario(req, res) {

        try {
            return res.status(200).json(
                {
                    sucesso: true, 
                    mensagem: 'atualizar Tipos de usuário',
                    dados: null
                }
            ); 
        }catch (error) {
                return res.status(500).json(
 {
                    sucesso: false, 
                    mensagem: 'Erro ao atualizar tipos de usuário',
                    dados: null 
 }); 
               } 
            },   
            async apagarTiposdeUsuario(req, res) {

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
                    mensagem: 'Erro ao apagar tipos de usuário',
                    dados: null 
 }); 
               }
            }                           
    };