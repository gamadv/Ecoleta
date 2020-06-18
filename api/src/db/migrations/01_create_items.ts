import Knex from "knex";

export async function up(knex: Knex) {
    // Função de fazer
    return knex.schema.createTable('items', table => {
        table.increments('id').primary()
        table.string('img').notNullable()
        table.string('title').notNullable()
    })
}

export async function down(knex: Knex) {
    // Função de desfazer
    return knex.schema.dropTable('items')

}