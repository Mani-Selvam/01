export const environment = {
    apiRoot : () => {
      // Use relative path for API calls
      // This will automatically use the same host/port as the frontend
      return '/api/';
    },
    apiRootStr: '/api/', //Replit proxy
    paginatorValue:[10,25,50],
  }

  