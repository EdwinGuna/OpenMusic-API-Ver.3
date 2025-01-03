const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    const { name, year } = request.payload;
    await this._service.editAlbumById(id, { name, year });
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
  
  async uploadAlbumCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    this._validator.validateImageHeaders(cover.hapi.headers);

    // Simpan file ke storage dan dapatkan lokasi file
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._service.updateCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postAlbumByIdLikesHandler(request, h) {
    const { id: album_id } = request.params;
    await this._service.getAlbumById(album_id);

    const user_id = request.auth.credentials.id;

    await this._service.addLikes(user_id, album_id);

    const response = h.response({
      status: 'success',
      message: 'Likes berhasil ditambahkan',
    });
    response.code(201);
    return response;    
  }

  async deleteAlbumByIdLikesHandler(request, h) {
    const { id: album_id } = request.params;
    await this._service.getAlbumById(album_id);

    const user_id = request.auth.credentials.id;
    await this._service.deleteLikes(user_id, album_id);

    const response = h.response({
      status: 'success',
      message: 'Likes berhasil dihapus',
    });
    response.code(200);
    return response;     
  }

  async getAlbumByIdLikesHandler(request, h) {
    const { id: album_id } = request.params;
   
    const { likes, isCache } = await this._service.countLikesByAlbumId(album_id);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes,
      },
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'not-cache');
    }
    
    return response;     
  }
}

module.exports = AlbumsHandler;
