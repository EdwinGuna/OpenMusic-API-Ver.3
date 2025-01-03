/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('collaborations', {
        id: {
            type: 'TEXT',
            primaryKey: true,
        },
        playlist_id: {
            type: 'TEXT',
            notNull: true,
        },
        user_id: {
            type: 'TEXT',
            notNull: true,
        } 
    });

    pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');    
};

exports.down = pgm => {
    pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id');
    pgm.dropTable('collaborations');
};
