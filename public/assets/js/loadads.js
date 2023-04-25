let lazyloadads = false;
const onScrollLoadAds = () => {
  if (
    !lazyloadads &&
    (document.documentElement.scrollTop != 0 || document.body.scrollTop != 0)
  ) {
    const url =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9043961430295462";
    let ad = document.createElement("script");
    ad.async = true;
    ad.setAttribute("crossorigin", "anonymous");
    ad.src = url;
    document.body.appendChild(ad);
    lazyloadads = true;
    window.removeEventListener("scroll", onScrollLoadAds);
  }
};

window.addEventListener("scroll", onScrollLoadAds);
