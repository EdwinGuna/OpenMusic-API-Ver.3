const PlaylistsActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsActivities',
  version: '1.0.0',
  register: async (server, { service, playlistsService }) => {
    const playlistActivitiesHandler = new PlaylistsActivitiesHandler(service, playlistsService);

    server.route(routes(playlistActivitiesHandler));
  },
};
