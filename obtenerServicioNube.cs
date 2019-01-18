public IGestionContenidoNube ObtenerServicioNube(double? idSitio)
        {
            IGestionContenidoNube servicio = null;
            try
            {
                if (idSitio != null)
                {
                    using (UnitOfWork unitOfWork = new UnitOfWork(idEmpresa))
                    {
                        var sitio = unitOfWork.SitiosRepository.Items.Where(m => m.Id == idSitio).FirstOrDefault();
                        if (sitio != null)
                        {
                            if (sitio.Descripcion == "Google Drive")
                            {
                                servicio = new GoogleService();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("No se obtuvo el servicio en la nube" + Geminus.Utils.UtilGeminusException.GetInnerException(ex));
            }

            return servicio;
        }
    
