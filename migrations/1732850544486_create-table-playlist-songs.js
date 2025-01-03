/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlist_songs', {
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
    });

    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');
    pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id');
    pgm.dropTable('playlist_songs');    
};
