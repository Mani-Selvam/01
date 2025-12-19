export const environment = {
    apiRoot : () => {
      // In Replit, backend is on the same domain but different port
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      
      if (hostname.includes('replit.dev')) {
        // Use the backend through the Replit domain on port 3001
        return `${protocol}//${hostname}:3001/`;
      }
      // Fallback for local development - use relative proxy path
      return '/api/';
    },
    apiRootStr: '/api/', //Replit proxy
    paginatorValue:[10,25,50],
  }

  