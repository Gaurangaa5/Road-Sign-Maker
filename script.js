(() => {
  const $ = id => document.getElementById(id);
  const defaults = {department:'GAURA CONSTRUCTION',headline:'ROAD CLOSURE',subline:'Please take the diversion route.',arrow:'none',signColor:'#f5c400',textColor:'#111820',headlineSize:'8.2',sublineSize:'3.4',logoTextSize:'2.1'};
  let logoUrl = null, fontUrl = null, placeholderHidden = false;
  $('sign').style.fontFamily = '"DA Road Signs", Arial, sans-serif';
  document.documentElement.style.setProperty('--ui', '"Graphik", Arial, sans-serif');
  function update() {
    $('previewDepartment').textContent = $('department').value.trim();
    $('previewHeadline').textContent = $('headline').value.trim();
    $('previewSubline').textContent = $('subline').value.trim();
    $('sign').style.setProperty('--accent', $('signColor').value);
    $('sign').style.background = $('signColor').value;
    $('sign').style.color = $('textColor').value;
    $('sign').style.setProperty('--sign-text', $('textColor').value);
    $('sign').querySelector('.sign-border').style.borderColor = $('textColor').value;
    $('sign').querySelector('.sign-top').style.borderColor = $('textColor').value;
    ['previewDepartment','previewHeadline','previewSubline'].forEach(id => $(id).style.color = $('textColor').value);
    const arrow = $('arrow').value;
    $('previewArrow').textContent = ({left:'←',right:'→',both:'↔',up:'↑',none:''})[arrow];
    $('previewArrow').style.color = $('textColor').value;
    $('previewArrow').style.display = arrow === 'none' ? 'none' : 'block';
    $('previewHeadline').style.fontSize = $('headlineSize').value + 'cqw';
    $('previewSubline').style.fontSize = $('sublineSize').value + 'cqw';
    $('previewDepartment').style.fontSize = $('logoTextSize').value + 'cqw';
    ['headlineSize','sublineSize','logoTextSize'].forEach(id => $(id+'Value').textContent = $(id).value);
  }
  ['department','headline','subline','arrow','signColor','textColor','headlineSize','sublineSize','logoTextSize'].forEach(id => { $(id).addEventListener('input', update); $(id).addEventListener('change', update); });
  $('logoUpload').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) { alert('Please choose an image file.'); e.target.value=''; return; }
    if (logoUrl) URL.revokeObjectURL(logoUrl); logoUrl = URL.createObjectURL(file);
    const slot=$('logoSlot'); slot.innerHTML=''; $('sign').querySelector('.sign-top').classList.remove('no-logo'); const img=document.createElement('img'); img.alt='Department logo'; img.src=logoUrl;
    img.onload=()=> $('logoStatus').textContent='Logo loaded'; img.onerror=()=> $('logoStatus').textContent='Could not display image. Try PNG or JPG.'; slot.appendChild(img);
  });
  $('fontUpload').addEventListener('change', async e => {
    const file=e.target.files && e.target.files[0]; if(!file)return; const ext=file.name.split('.').pop().toLowerCase();
    if(!['ttf','otf','woff','woff2'].includes(ext)){alert('Choose a TTF, OTF, WOFF or WOFF2 font file.');e.target.value='';return;}
    if(fontUrl)URL.revokeObjectURL(fontUrl);fontUrl=URL.createObjectURL(file);
    try{const face=new FontFace('RoadSignFont',`url("${fontUrl}")`);await face.load();document.fonts.add(face);$('sign').style.fontFamily='"RoadSignFont", Arial, sans-serif';$('fontStatus').textContent='Custom font applied';}
    catch{$('fontStatus').textContent='Font could not load. Try another font file.';alert('The browser could not load that font file.');}
  });
  const placeholderLogo = '<svg viewBox="0 0 100 110" class="placeholder" aria-label="Placeholder badge"><path d="M50 4 89 20v28c0 26-16 44-39 58C27 92 11 74 11 48V20L50 4Z" fill="#fff" stroke="#172b45" stroke-width="4"/><path d="m31 52 13 13 26-29" fill="none" stroke="#172b45" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  $('removeLogoBtn').addEventListener('click',()=>{
    $('logoUpload').value=''; if(logoUrl) URL.revokeObjectURL(logoUrl); logoUrl=null;
    $('logoSlot').innerHTML=placeholderHidden ? '' : placeholderLogo; $('sign').querySelector('.sign-top').classList.toggle('no-logo', placeholderHidden); $('logoStatus').textContent=placeholderHidden ? 'Logo removed. Placeholder badge hidden.' : 'Logo removed. Placeholder badge shown.';
  });
  $('removePlaceholderBtn').addEventListener('click',()=>{
    placeholderHidden = !placeholderHidden;
    const uploaded = $('logoSlot').querySelector('img');
    if (!uploaded) $('logoSlot').innerHTML = placeholderHidden ? '' : placeholderLogo;
    $('sign').querySelector('.sign-top').classList.toggle('no-logo', placeholderHidden && !uploaded);
    $('removePlaceholderBtn').textContent = placeholderHidden ? 'Show placeholder badge' : 'Remove placeholder badge';
    $('logoStatus').textContent = uploaded ? 'Logo loaded' : (placeholderHidden ? 'Placeholder badge hidden.' : 'Placeholder badge shown.');
  });
  $('removeFontBtn').addEventListener('click',()=>{
    $('fontUpload').value=''; if(fontUrl) URL.revokeObjectURL(fontUrl); fontUrl=null;
    $('sign').style.fontFamily='"DA Road Signs", Arial, sans-serif'; $('fontStatus').textContent='DA Road Signs restored.';
  });
  $('screenshotBtn').addEventListener('click',()=>{document.body.classList.add('screenshot-mode');});
  $('exitScreenshotBtn').addEventListener('click',()=>{document.body.classList.remove('screenshot-mode');});
  const exitButton = $('exitScreenshotBtn');
  const syncExitButton = () => { exitButton.style.display = document.body.classList.contains('screenshot-mode') ? 'block' : 'none'; };
  new MutationObserver(syncExitButton).observe(document.body, {attributes:true, attributeFilter:['class']});
  syncExitButton();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('screenshot-mode');});
  $('printBtn').addEventListener('click',()=>window.print());
  $('resetBtn').addEventListener('click',()=>{Object.entries(defaults).forEach(([id,val])=>$(id).value=val);$('logoUpload').value='';$('fontUpload').value='';if(logoUrl)URL.revokeObjectURL(logoUrl);if(fontUrl)URL.revokeObjectURL(fontUrl);logoUrl=null;fontUrl=null;placeholderHidden=false;$('sign').querySelector('.sign-top').classList.remove('no-logo');$('removePlaceholderBtn').textContent='Remove placeholder badge';$('logoSlot').innerHTML='<svg viewBox="0 0 100 110" class="placeholder" aria-label="Placeholder badge"><path d="M50 4 89 20v28c0 26-16 44-39 58C27 92 11 74 11 48V20L50 4Z" fill="#fff" stroke="#172b45" stroke-width="4"/><path d="m31 52 13 13 26-29" fill="none" stroke="#172b45" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';$('logoStatus').textContent='No logo uploaded. Placeholder badge shown.';$('fontStatus').textContent='DA Road Signs is the default sign font. You can upload another font if needed.';$('sign').style.fontFamily='"DA Road Signs", Arial, sans-serif';update();});
  update();
})();
