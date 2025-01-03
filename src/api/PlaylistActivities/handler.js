const autoBind = require('auto-bind');

class PlaylistsActivitiesHandler {
  constructor(service, playlistsService) {
    this._service = service;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getPlaylistsActivitiesHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const _activities = await this._service.getActivities(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities: _activities,
      },
    };
  }
}

module.exports = PlaylistsActivitiesHandler;
