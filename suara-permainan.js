/* MISI BAKUL NOMBOR — pemain rakaman suara asal pengguna.
   48 fail MP3 berada di dalam folder audio/. Satu sumber audio digunakan
   supaya arahan dan maklum balas tidak dimainkan bertindih. */
(function(){
  'use strict';
  if(window.MBNVoice) return;
  const stems = [
    '01_selamat_datang','02_pilih_julat','03_mula_bermain','04_pilih_cara_bermain',
    '05_misi_1_pengenalan','06_misi_1_arahan','07_misi_1_bantuan','08_misi_1_berjaya','09_misi_1_tamat',
    '10_misi_2_pengenalan','11_misi_2_arahan','12_misi_2_kira','13_misi_2_bantuan','14_misi_2_berjaya','15_misi_2_tamat',
    '16_misi_3_pengenalan','17_misi_3_arahan','18_misi_3_menaik','19_misi_3_menurun','20_misi_3_bantuan','21_misi_3_berjaya','22_misi_3_tamat',
    '23_jawapan_betul_1','24_jawapan_betul_2','25_jawapan_betul_3','26_cuba_lagi_1','27_cuba_lagi_2','28_tunggu_sekejap',
    '29_misi_seterusnya','30_tahniah_semua_misi','31_main_semula','32_terima_kasih',
    '33_nombor_1','34_nombor_2','35_nombor_3','36_nombor_4','37_nombor_5','38_nombor_6','39_nombor_7','40_nombor_8','41_nombor_9','42_nombor_10',
    '43_dengar_arahan','44_kamera_hidup','45_kamera_mati','46_skrin_penuh','47_kembali_menu','48_pilih_misi'
  ];
  const known = new Set(stems);
  const base = new URL('./audio/', document.currentScript?.src || document.baseURI);
  const player = document.createElement('audio');
  player.id='rakaman-misi';
  player.preload='auto';
  player.style.display='none';
  player.setAttribute('aria-hidden','true');
  document.body.appendChild(player);
  let enabled=true, serial=0, queue=[], resolveCurrent=null, active=false, timer=null;
  const normalize = v => (typeof v === 'string' && known.has(v) ? v : null);
  function finish(result){
    if(resolveCurrent){const done=resolveCurrent;resolveCurrent=null;done(result)}
  }
  function stop(){
    serial++;queue=[];active=false;
    clearTimeout(timer);timer=null;
    player.pause();player.onended=null;player.onerror=null;
    player.removeAttribute('src');
    finish(false);
  }
  function pump(id){
    if(id !== serial || !enabled) return;
    let key=queue.shift();
    if(!key){active=false;finish(true);return;}
    player.src=new URL(key+'.mp3',base).href;
    player.load();
    let called=false;
    const advance=()=>{
      if(called || id!==serial)return;
      called=true;
      clearTimeout(timer);timer=null;
      pump(id);
    };
    player.onended=advance;
    player.onerror=()=>{console.warn('Rakaman tidak dapat dimainkan:',key);advance()};
    // Lindungi permainan daripada fail audio yang gagal memuatkan atau tergantung.
    timer=setTimeout(advance,18000);
    player.play().catch(err=>{console.warn('Audio disekat atau tidak tersedia:',key,err.message);advance()});
  }
  function play(...items){
    const keys=items.flat().map(normalize).filter(Boolean);
    stop();
    if(!enabled || !keys.length)return Promise.resolve(false);
    queue=keys;
    active=true;
    const id=serial;
    return new Promise(resolve=>{resolveCurrent=resolve;pump(id)});
  }
  function append(...items){
    const keys=items.flat().map(normalize).filter(Boolean);
    if(!enabled || !keys.length)return;
    if(!active){void play(...keys);return}
    queue.push(...keys);
  }
  const numKey=n => n>=1 && n<=10 && Number.isInteger(+n) ? stems[31+Number(n)] : null;
  function number(n){const key=numKey(n);return key?play(key):Promise.resolve(false)}
  function appendNumber(n){const key=numKey(n);if(key)append(key)}
  function setEnabled(v){enabled=!!v;if(!enabled)stop();return enabled}
  const intro = m => m===1?['05_misi_1_pengenalan','06_misi_1_arahan']:m===2?['10_misi_2_pengenalan','11_misi_2_arahan']:['16_misi_3_pengenalan','18_misi_3_menaik'];
  const instruction = (m,phase=1) => m===1?'06_misi_1_arahan':m===2?'11_misi_2_arahan':phase===2?'19_misi_3_menurun':'18_misi_3_menaik';
  const help = m => m===1?'07_misi_1_bantuan':m===2?'13_misi_2_bantuan':'20_misi_3_bantuan';
  const completed = m => m===1?'09_misi_1_tamat':m===2?'15_misi_2_tamat':'22_misi_3_tamat';
  const correct = m => m===1?'08_misi_1_berjaya':m===2?'14_misi_2_berjaya':'21_misi_3_berjaya';
  window.MBNVoice = {play,append,stop,number,appendNumber,setEnabled,intro,instruction,help,completed,correct,
    get enabled(){return enabled},get playing(){return active},get audioElement(){return player}};
})();
