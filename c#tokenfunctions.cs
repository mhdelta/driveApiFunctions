# https://www.c-sharpcorner.com/article/retrieve-access-token-for-google-service-account-form-json-or-p12-key-in-c-sharp/


using System;
using System.Security.Cryptography.X509Certificates;

using Google.Apis.Auth.OAuth2;
using Google.Apis.Plus.v1;
using Google.Apis.Plus.v1.Data;
using Google.Apis.Services;

namespace Google.Apis.Samples.PlusServiceAccount
{
    /// <summary>
    /// This sample demonstrates the simplest use case for a Service Account service.
    /// The certificate needs to be downloaded from the Google API Console
    /// <see cref="https://console.developers.google.com/">
    ///   "Create another client ID..." -> "Service Account" -> Download the certificate,
    ///   rename it as "key.p12" and add it to the project. Don't forget to change the Build action
    ///   to "Content" and the Copy to Output Directory to "Copy if newer".
    /// </summary>
    public class Program
    {
        // A known public activity.
        private static String ACTIVITY_ID = "z12gtjhq3qn2xxl2o224exwiqruvtda0i";

        public static void Main(string[] args)
        {
            Console.WriteLine("Plus API - Service Account");
            Console.WriteLine("==========================");

            String serviceAccountEmail = "SERVICE_ACCOUNT_EMAIL_HERE";

            var certificate = new X509Certificate2(@"key.p12", "notasecret", X509KeyStorageFlags.Exportable);

            ServiceAccountCredential credential = new ServiceAccountCredential(
               new ServiceAccountCredential.Initializer(serviceAccountEmail)
               {
                   Scopes = new[] { PlusService.Scope.PlusMe }
               }.FromCertificate(certificate));

            // Create the service.
            var service = new PlusService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Plus API Sample",
            });

            Activity activity = service.Activities.Get(ACTIVITY_ID).Execute();
            Console.WriteLine("  Activity: " + activity.Object.Content);
            Console.WriteLine("  Video: " + activity.Object.Attachments[0].Url);

            Console.WriteLine("Press any key to continue...");
            Console.ReadKey();
        }
    }
}
