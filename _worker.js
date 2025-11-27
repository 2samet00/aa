export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Ana sayfa
    if (pathname === '/') {
      return env.ASSETS.fetch(new URL('/index.html', url.origin));
    }
    
    // Eğer path .html ile bitmiyorsa, .html ekle
    if (!pathname.includes('.') && pathname !== '/') {
      // Trailing slash varsa kaldır
      if (pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
      }
      
      // .html uzantısı ekle
      const htmlPath = pathname + '.html';
      const htmlUrl = new URL(htmlPath, url.origin);
      
      // HTML dosyasını dene
      const response = await env.ASSETS.fetch(htmlUrl);
      if (response.status === 200) {
        return response;
      }
    }
    
    // Varsayılan olarak assets'ten serve et
    return env.ASSETS.fetch(request);
  }
};


