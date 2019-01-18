 public Resultado Test()
        {
            var result = new Resultado();

            try
            {
                result.Datos = Geminus.Api.Constants.LanguageTranslator.ALERT_ERROR_SERVER;

                if (IsValid())
                {
                    using (var unitOfWork = new UnitOfWork(idEmpresa))
                    {
                        // If modifying these scopes, delete your previously saved credentials
                        // at ~/.credentials/drive-dotnet-quickstart.json
                        string[] Scopes = { DriveService.Scope.DriveReadonly };
                        string ApplicationName = "Drive API .NET Quickstart";

                        var cred = GoogleCredential.FromFile("My Project-1d09d04f4987.json").CreateScoped(Scopes);
                        Console.WriteLine(cred);

                        // Create Drive API service.
                        var service = new DriveService(new BaseClientService.Initializer()
                        {
                            HttpClientInitializer = cred,
                            ApplicationName = ApplicationName,
                        });

                        // Define parameters of request.
                        FilesResource.ListRequest listRequest = service.Files.List();
                        listRequest.PageSize = 10;
                        listRequest.Fields = "nextPageToken, files(id, name)";

                        // List files.
                        IList<Google.Apis.Drive.v3.Data.File> files = listRequest.Execute()
                            .Files;
                        if (files != null && files.Count > 0)
                        {
                            List<string> res = new List<string>(); 
                            foreach (var file in files)
                            {
                                res.Add(file.Name + " Id: " +file.Id);
                            }
                            result.Datos = res;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                var exception = Geminus.Utils.UtilGeminusException.GetInnerException(ex);

                result.InfoOperacion = new InfoOperacion(exception, $"{nombreClase}_{nameof(ObtenerPedidosParaProgramar)}");
            }

            return result;
        }
    
