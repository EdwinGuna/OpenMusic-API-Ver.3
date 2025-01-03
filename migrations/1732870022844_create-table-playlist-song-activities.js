/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist_song_activities', {
        id: {
            type: 'TEXT',
            primaryKey: true,
        },
        playlist_id: {
            type: 'TEXT',
            notNull: true,
        },
        song_id: {
            type: 'TEXT',
            notNull: true,
        },
        user_id: {
            type: 'TEXT',
            notNull: true,
        },
        action: {
            type: 'TEXT',
            notNull: true,
        },
        time: {
            type: 'TIMESTAMP',
            notNull: true,
        },
    });
    
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id');
    pgm.dropTable('playlist_song_activities');    
};
