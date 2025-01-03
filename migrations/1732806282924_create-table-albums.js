/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('albums', {
        id: {
          type: 'TEXT',
          primaryKey: true,
        },
        name: {
          type: 'TEXT',
          notNull: true,
        },
        year: {
          type: 'INTEGER',
          notNull: true,
        }
    });    
};

exports.down = pgm => {
    pgm.dropTable('albums');
};
