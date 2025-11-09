import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeo } from '../store/content';

const SEO = ({ title, description }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = getSeo();
    const routeSeo = seo[pathname] || {};
    const pageTitle = title || routeSeo.title;
    const pageDesc = description || routeSeo.description;
    if (pageTitle) document.title = pageTitle;
    if (pageDesc) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', pageDesc);

      // OG tags
      let ogt = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
      ogt.setAttribute('property', 'og:title');
      ogt.setAttribute('content', pageTitle || '');
      if (!ogt.parentNode) document.head.appendChild(ogt);

      let ogd = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
      ogd.setAttribute('property', 'og:description');
      ogd.setAttribute('content', pageDesc || '');
      if (!ogd.parentNode) document.head.appendChild(ogd);
    }
  }, [title, description, pathname]);
  return null;
};

export default SEO;
