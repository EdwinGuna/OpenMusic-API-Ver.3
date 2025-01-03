const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, songsService, playlistActivitiesService, validator) {
    this._service = service;
    this._validator = validator;
    this._songsService = songsService;
    this._playlistActivitiesService = playlistActivitiesService;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const _playlistId = await this._service.addPlaylist({ name, credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId: _playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { cache, _playlists } = await this._service.getPlaylists(credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlists: _playlists,
      }
    });
    if (cache) response.header('X-Data-Source', 'cache');
    return response
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._songsService.getSongById(songId);
    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.addSongToPlaylist(id, songId);
    await this._playlistActivitiesService.addActivity(id, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke dalam playlist',
    });
    response.code(201);
    return response;
  }

  async getSongFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._service.getPlaylistById(id);
    const songs = await this._service.getSongFromPlaylist(id);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.deleteSongFromPlaylist(songId, id);
    await this._playlistActivitiesService.addActivity(id, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'song berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
