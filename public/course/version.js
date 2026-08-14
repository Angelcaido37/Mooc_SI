(()=>{
  const VERSION="production-1";
  window.NEXUS_VERSION=VERSION;
  document.documentElement.dataset.nexusVersion=VERSION;
  if(!("serviceWorker" in navigator)||location.protocol==="file:")return;
  let reloading=false;
  navigator.serviceWorker.addEventListener("controllerchange",()=>{
    if(reloading)return;
    reloading=true;
    location.reload();
  });
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})
      .then(registration=>registration.update())
      .catch(()=>{});
  });
})();
