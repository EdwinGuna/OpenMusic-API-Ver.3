exports.up = pgm => {
    pgm.createTable('playlists', {
        id: {
            type: 'TEXT',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'TEXT',
            notNull: true,
        },
    });

    pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
    pgm.dropTable('playlists');
};
