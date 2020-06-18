import Knex from "knex";

export async function seed(knex: Knex) {
    // Função de fazer
    return knex('items').insert([
        {title: 'Lâmpadas', img: 'lampadas.svg'},
        {title: 'Pilhas e Baterias', img: 'baterias.svg'},
        {title: 'Papéis e Papelão', img: 'papers.svg'},
        {title: 'Resíduos Eletrônicos', img: 'eletronicos.svg'},
        {title: 'Resíduos Orgânicos', img: 'organicos.svg'},
        {title: 'Óleo de Cozinha', img: 'oleo.svg'},
    ])
}

export async function down(knex: Knex) {
    // Função de desfazer
    return knex.schema.dropTable('items')

}