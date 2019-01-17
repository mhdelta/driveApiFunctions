class headerComponentFunctions {
	// const
	discovery_docs = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
					'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
	scope = 'https://www.googleapis.com/auth/calendar ' +
			'https://www.googleapis.com/auth/drive ' +
			'https://www.googleapis.com/auth/drive.appdata ' +
			'https://www.googleapis.com/auth/drive.metadata ' +
			'https://www.googleapis.com/auth/drive.file'

	inicializarGapi() {
		try {
			let _gapi = gapi;
			let _this = this;
			this.controlDespachosService.obtener()
				.subscribe(function (response) {
					if (Utils.responseValidator(response)) {
						if (response.datos) {
							let dataControlDespacho = response.datos;
							gapi.load('client:auth2', function () {
								gapi.client.init({
									// Estas dos llaves deben cambiarse, estas son las de geminus, debe
									// utilizarse las de cada empresa y se crean en el cloud console de Google
									// en la sección de credenciales
									apiKey: dataControlDespacho.apiKeyGoogle,
									clientId: dataControlDespacho.clientIdGoogle,
									discoveryDocs: _this.discovery_docs,
									scope: _this.scope
								}).then((res) => {
									if (_gapi.auth2.getAuthInstance()) {
										if (_gapi.auth2.getAuthInstance().isSignedIn.get()) {
											let auth2 = gapi.auth2.getAuthInstance();
											let googleUser = auth2.currentUser.get();
											_this.ValidarCorreoGoogle(googleUser, true);
										}
									}
								}, (err) => {
									console.log(err);
								});
							});
						}
					}
				});
		} catch (error) {
			Utils.cerrarModalCargando();
			throw new UserException('Error.',
				error, 'componente:' + 'inicia' + ' => funcion:' + this.inicializarGapi.name)
		}
	}

	Connect2google(event) {
		try {
			if (gapi) {
				if (gapi.auth2) {
					if (gapi.auth2.getAuthInstance()) {
						if (gapi.auth2.getAuthInstance().isSignedIn.get() === false) {
							console.log('sing in');
							gapi.auth2.getAuthInstance().signIn().then((res) => {
								this.googleLogged = true;
								let auth2 = gapi.auth2.getAuthInstance();
								let googleUser = auth2.currentUser.get();
								this.ValidarCorreoGoogle(googleUser);
							}, (err) => {
								console.log(err)
							})
						} else {
							console.log('sing out');
							gapi.auth2.getAuthInstance().signOut();
							this.googleLogged = false;
						}
					}
				}
			}
		} catch (error) {
			Utils.cerrarModalCargando();
			throw new UserException('Error conectando a google.',
				error, 'componente:' + this.name + ' => funcion:' + this.Connect2google.name)
		}
	}
}

class pygComponentFunctions {
	listarArchivos() {
		try {
			let _this = this;
			if (gapi) {
				if (gapi.client) {
					if (gapi.client.drive) {
						gapi.client.drive.files.list({
							'pageSize': 30,
						}).then((res) => {
							console.log('Files:');
							let files = res.result.files;
							if (files && files.length > 0) {
								for (let i = 0; i < files.length; i++) {
									let file = files[i];
									console.log(file.name + ' (' + file.id + ')');
									if (file.mimeType === 'image/jpeg') {
										_this.id = file.id;
									}

								}
							} else {
								console.log('No files found.');
							}
						}, (err) => {
							console.log(err);
						});
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	downloadFile(action) {
		try {
			if (gapi) {
				if (gapi.client) {
					if (gapi.client.drive) {
						gapi.client.drive.files.get({
							'fileId': this.id,
							'fields': 'webContentLink, webViewLink'
						}).then((res) => {
							if (action === 'show') {
								window.open(res.result.webViewLink)
							}
							if (action === 'download') {
								window.open(res.result.webContentLink)
							}
							console.log(res);
						}, (err) => {
							console.log(err);
						});
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	handleFileInput(files: FileList) {
		let fileToUpload = files.item(0);
		let fileContent = 'hello world'; // As a sample, upload a text file.
		let file = new Blob([fileContent], {type: 'text/plain'});
		let metadata = {
				'name': 'sampleName', // Filename at Google Drive
				'mimeType': 'text/plain', // mimeType at Google Drive
				// 'parents': ['### folder ID ###'], // Folder ID at Google Drive
		};

		let accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
		let form = new FormData();
		form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
		form.append('file', file);

		let xhr = new XMLHttpRequest();
		xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
		xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		xhr.responseType = 'json';
		xhr.onload = () => {
				console.log(xhr.response); // Retrieve uploaded file ID.
		};
		xhr.send(form);
	}
}





