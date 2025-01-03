/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
          type: 'TEXT',
          primaryKey: true,
        },
        title: {
          type: 'TEXT',
          notNull: true,
        },
        year: {
          type: 'INTEGER',
          notNull: true,
        },
        genre: {
          type: 'TEXT',
          notNull: true,
        },
        performer: {
          type: 'TEXT',
          notNull: true,
        },
        duration: {
          type: 'INTEGER',
          null: true,
        },
        albumId: {
          type: 'TEXT',
          null: true,
        },
    });

    pgm.addConstraint('songs', 'fk_songs.albumId_albums.id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');    
};

exports.down = pgm => {
    pgm.dropConstraint('songs', 'fk_songs.albumId_albums.id');
    pgm.dropTable('songs');    
};
