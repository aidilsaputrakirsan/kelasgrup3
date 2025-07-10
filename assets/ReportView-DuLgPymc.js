import{u as J,f as X,g as T,c as D,M as B,D as k,i as Z,a as c,d as t,b as tt,k as C,m as M,x as _,j as at,e as m,l as P,G as I,F as S,s as j,t as n,o as g,n as z,C as et}from"./index-w4NFn9Xs.js";import{u as ot,b as st,c as U,a as q}from"./amalan-VF6s2JUw.js";import{_ as N}from"./AppButton-CcxJClVj.js";const rt={class:"min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50"},nt={class:"bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm"},lt={class:"max-w-md mx-auto px-4 py-4"},it={class:"flex items-center justify-between"},dt={class:"max-w-md mx-auto p-4 space-y-6"},ut={class:"bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm"},ct={class:"space-y-4"},mt=["value"],gt=["value"],ht={class:"grid grid-cols-2 gap-4"},pt={class:"bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl"},xt={class:"text-3xl font-bold mb-1"},ft={class:"bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl"},bt={class:"text-3xl font-bold mb-1"},vt={class:"bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm"},yt={class:"space-y-3"},kt={class:"bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm"},wt={class:"space-y-3"},Mt={class:"flex-1"},_t={class:"font-bold text-gray-800"},At={class:"text-sm text-gray-600"},Tt={class:"text-xs text-gray-500"},Dt={class:"w-20"},St={class:"w-full h-3 bg-gray-200 rounded-full overflow-hidden"},jt={class:"text-xs text-gray-500 text-center mt-1"},Rt={class:"bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm"},Et={class:"space-y-4"},Ct={class:"flex justify-between items-center mb-3"},Nt={class:"flex items-center gap-3"},$t={class:"w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold"},Lt={class:"font-bold text-gray-800"},Vt={class:"text-right"},Bt={class:"text-xl font-bold text-pink-600"},Pt={class:"space-y-2"},It={class:"flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"},zt={class:"text-gray-700"},Ut={class:"font-medium text-gray-600"},qt={key:0,class:"fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50"},Ft={class:"bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 shadow-xl"},Ot={class:"w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-soft mb-4"},Yt={class:"text-white text-xl"},Kt={class:"text-gray-700 font-medium"},Jt={__name:"ReportView",setup(Gt){const F=J(),f=ot(),A=X(),w=T(st()),b=T(U()),R=T(!1),v=T(!1),O=D(()=>{const o=U();return Array.from({length:5},(a,e)=>o-2+e)}),$=D(()=>{const o=f.monthlyReportData;return!o||!o.summary?{totalAmalan:0,averagePerMember:0,mostActive:"-"}:{totalAmalan:o.summary.totalAmalan||0,averagePerMember:o.summary.avgPerMember||0,mostActive:o.summary.mostActive||"-"}}),L=D(()=>{const o=f.monthlyReportData;if(!o||!o.amalan)return[];const a=B.map(s=>{let l=0,h=0;Object.entries(o.amalan).forEach(([d,i])=>{const r=i[s]||0;r>0&&l++,h+=r});const y=Math.round(l/k.length*100);return{name:s,activeTypes:l,totalAmalan:h,consistency:y}});a.sort((s,l)=>l.activeTypes===s.activeTypes?l.consistency-s.consistency:l.activeTypes-s.activeTypes);const e=k.length;return a.map(s=>({...s,percentage:Math.round(s.activeTypes/e*100)}))});D(()=>L.value);const Y={"Dzikir pagi/petang":"1x/hari",Tilawah:"1 juz/hari","Shalat tepat waktu":"5x/hari","Shalat malam":"3x/pekan","Shalat Dhuha":"3x/pekan","Puasa Sunnah":"3x/pekan",Istighfar:"100x/hari",Shalawat:"100x/hari","Membaca Baqiyatush-shalihat":"10x/hari","Infaq Harian":"1x/hari","Doa kemenangan dakwah dan umat islam":"1x/hari"};async function K(){try{v.value=!0,console.log("📊 Starting Excel export...");const o=f.monthlyReportData;let a={},e=!1;o&&o.amalan&&Object.keys(o.amalan).length>0?(console.log("✅ Using real data"),a=o.amalan,e=!0):(console.log("⚠️ Using sample data"),k.forEach(i=>{let r,u,p,x;i.includes("Istighfar")||i.includes("Shalawat")?(r=Math.floor(Math.random()*200)+50,u=Math.floor(Math.random()*200)+50,p=Math.floor(Math.random()*200)+50,x=Math.floor(Math.random()*200)+50):i.includes("Shalat tepat waktu")?(r=Math.floor(Math.random()*20)+20,u=Math.floor(Math.random()*20)+20,p=Math.floor(Math.random()*20)+20,x=Math.floor(Math.random()*20)+20):i.includes("Membaca Baqiyatush-shalihat")?(r=Math.floor(Math.random()*30)+40,u=Math.floor(Math.random()*30)+40,p=Math.floor(Math.random()*30)+40,x=Math.floor(Math.random()*30)+40):i.includes("pekan")?(r=Math.floor(Math.random()*5)+1,u=Math.floor(Math.random()*5)+1,p=Math.floor(Math.random()*5)+1,x=Math.floor(Math.random()*5)+1):(r=Math.floor(Math.random()*10)+1,u=Math.floor(Math.random()*10)+1,p=Math.floor(Math.random()*10)+1,x=Math.floor(Math.random()*10)+1),a[i]={ATK:r,AYS:u,FTR:p,WIN:x,total:r+u+p+x}}));const s=q(w.value);let l=`
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        table { 
          border-collapse: collapse; 
          width: 100%; 
          font-family: Arial, sans-serif; 
          margin-bottom: 20px;
        }
        th, td { 
          border: 1px solid #000; 
          padding: 8px; 
          text-align: center; 
        }
        th { 
          background-color: #f2f2f2; 
          font-weight: bold; 
        }
        .header { 
          font-size: 18px; 
          font-weight: bold; 
          margin-bottom: 10px; 
          text-align: center;
        }
        .info { 
          margin-bottom: 5px; 
          text-align: center;
        }
        .amalan-name {
          text-align: left;
          width: 300px;
        }
        .target-col {
          text-align: center;
          width: 100px;
          background-color: #ffffcc;
        }
      </style>
    </head>
    <body>
      <div class="header">LAPORAN AMALAN HARIAN</div>
      <div class="info">Periode: ${s} ${b.value}</div>
      <div class="info">Tanggal: ${new Date().toLocaleDateString("id-ID")}</div>
      <br>
      
      <table>
        <thead>
          <tr>
            <th class="amalan-name">NAMA AMALAN</th>
            <th class="target-col">TARGET</th>
            <th>ATK</th>
            <th>AYS</th>
            <th>FTR</th>
            <th>WIN</th>
          </tr>
        </thead>
        <tbody>
    `;k.forEach(i=>{const r=a[i]||{},u=Y[i]||"-";l+=`
        <tr>
          <td class="amalan-name">${i}</td>
          <td class="target-col">${u}</td>
          <td>${r.ATK||0}</td>
          <td>${r.AYS||0}</td>
          <td>${r.FTR||0}</td>
          <td>${r.WIN||0}</td>
        </tr>
      `}),l+=`
        </tbody>
      </table>
      
      <br>
      <div style="text-align: center; font-size: 12px; color: #666;">
        ${e?"Data: Real dari database":"Data: Sample untuk testing"}<br>
        Target menunjukkan frekuensi ideal per amalan
      </div>
    </body>
    </html>
    `;const h=new Blob([l],{type:"application/vnd.ms-excel;charset=utf-8;"}),y=URL.createObjectURL(h),d=document.createElement("a");d.href=y,d.download=`Laporan_${s}${b.value}.xls`,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(y),console.log("✅ Excel export completed successfully"),A.showToast("Berhasil export ke Excel!","success")}catch(o){console.error("❌ Export error:",o),A.showToast("Gagal export data","error")}finally{v.value=!1}}async function E(){try{R.value=!0,console.log("📊 Loading report data for:",w.value,b.value),await f.loadMonthlyReport(w.value,b.value),A.showToast("Laporan berhasil dimuat","success")}catch(o){console.error("❌ Failed to load report:",o),A.showToast("Gagal memuat data laporan","error")}finally{R.value=!1}}const G={"Dzikir pagi/petang":7,Tilawah:7,"Shalat tepat waktu":35,"Shalat malam":3,"Shalat Dhuha":3,"Puasa Sunnah":3,Istighfar:700,Shalawat:700,"Membaca Baqiyatush-shalihat":70,"Infaq Harian":7,"Doa kemenangan dakwah dan umat islam":7};function H(o){const a=f.monthlyReportData;if(!a||!a.amalan)return 0;let e=0;return Object.entries(a.amalan).forEach(([s,l])=>{(l[o]||0)>0&&e++}),e}function V(o){const a=f.monthlyReportData;if(!a||!a.amalan)return{name:"Belum ada data",frequency:"0%"};let e="Belum ada data",s=0;Object.entries(a.amalan).forEach(([h,y])=>{const d=y[o]||0,i=G[h]||1,r=d/i*100;r>s&&d>0&&(s=r,e=h)});const l=s>0?`${Math.round(s)}%`:"0%";return{name:e,frequency:l}}function W(o){const a=["bg-gradient-to-r from-yellow-400 to-orange-500","bg-gradient-to-r from-gray-400 to-gray-500","bg-gradient-to-r from-orange-400 to-orange-500","bg-gradient-to-r from-blue-400 to-blue-500"];return a[o]||a[3]}function Q(o){const a=["bg-gradient-to-r from-yellow-400 to-orange-500","bg-gradient-to-r from-gray-400 to-gray-500","bg-gradient-to-r from-orange-400 to-orange-500","bg-gradient-to-r from-blue-400 to-blue-500"];return a[o]||a[3]}return Z(async()=>{await E()}),(o,a)=>(g(),c("div",rt,[t("header",nt,[t("div",lt,[t("div",it,[C(N,{variant:"ghost",size:"sm",onClick:a[0]||(a[0]=e=>o.$router.push("/dashboard")),class:"text-gray-600 hover:text-pink-600"},{icon:M(()=>a[3]||(a[3]=[t("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M15 19l-7-7 7-7"})],-1)])),default:M(()=>[a[4]||(a[4]=m(" Dashboard "))]),_:1,__:[4]}),a[6]||(a[6]=t("div",{class:"flex items-center gap-2"},[t("div",{class:"w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center"},[t("span",{class:"text-white text-lg"},"📊")]),t("h1",{class:"text-lg font-bold text-gray-800"},"Laporan")],-1)),C(N,{variant:"ghost",size:"sm",onClick:_(F).logout,class:"text-gray-600 hover:text-pink-600"},{default:M(()=>a[5]||(a[5]=[m(" Keluar ")])),_:1,__:[5]},8,["onClick"])])])]),t("main",dt,[t("div",ut,[a[9]||(a[9]=t("h3",{class:"font-bold text-gray-800 mb-4 flex items-center gap-2"},[t("span",null,"🗓️"),m(" Pilih Periode ")],-1)),t("div",ct,[t("div",null,[a[7]||(a[7]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Bulan",-1)),P(t("select",{"onUpdate:modelValue":a[1]||(a[1]=e=>w.value=e),class:"w-full bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 text-gray-700 border border-white/20 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200",onChange:E},[(g(),c(S,null,j(12,e=>t("option",{key:e,value:e},n(_(q)(e)),9,mt)),64))],544),[[I,w.value]])]),t("div",null,[a[8]||(a[8]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Tahun",-1)),P(t("select",{"onUpdate:modelValue":a[2]||(a[2]=e=>b.value=e),class:"w-full bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 text-gray-700 border border-white/20 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200",onChange:E},[(g(!0),c(S,null,j(O.value,e=>(g(),c("option",{key:e,value:e},n(e),9,gt))),128))],544),[[I,b.value]])])])]),t("div",ht,[t("div",pt,[t("div",xt,n($.value.totalAmalan),1),a[10]||(a[10]=t("div",{class:"text-sm opacity-90"},"Total Amalan",-1)),a[11]||(a[11]=t("div",{class:"text-xs opacity-75 mt-1"},"Bulan ini",-1))]),t("div",ft,[t("div",bt,n($.value.averagePerMember),1),a[12]||(a[12]=t("div",{class:"text-sm opacity-90"},"Rata-rata",-1)),a[13]||(a[13]=t("div",{class:"text-xs opacity-75 mt-1"},"Per anggota",-1))])]),t("div",vt,[a[18]||(a[18]=t("h3",{class:"font-bold text-gray-800 mb-4 flex items-center gap-2"},[t("span",null,"📤"),m(" Export Data ")],-1)),t("div",yt,[a[16]||(a[16]=t("div",{class:"text-sm text-gray-600 mb-4"}," Export laporan dalam format Excel ",-1)),C(N,{variant:"primary",class:"w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",loading:v.value,onClick:K},{icon:M(()=>a[14]||(a[14]=[t("span",{class:"text-lg"},"📊",-1)])),default:M(()=>[a[15]||(a[15]=m(" Export ke Excel "))]),_:1,__:[15]},8,["loading"]),a[17]||(a[17]=t("div",{class:"text-xs text-gray-500"}," 📋 Format: Tabel 4 nama × 11 amalan ",-1))])]),t("div",kt,[a[19]||(a[19]=t("div",{class:"flex justify-between items-start mb-4"},[t("h3",{class:"font-bold text-gray-800 flex items-center gap-2"},[t("span",null,"🏆"),m(" Anggota Terkonsisten ")]),t("div",{class:"text-xs text-gray-500 text-right max-w-[180px]"}," Berdasarkan berapa jenis amalan yang rutin dilakukan ")],-1)),t("div",wt,[(g(!0),c(S,null,j(L.value,(e,s)=>(g(),c("div",{key:e.name,class:"flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20"},[t("div",{class:z([W(s),"w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"])},n(s+1),3),t("div",Mt,[t("div",_t,n(e.name),1),t("div",At,n(e.activeTypes)+"/"+n(_(k).length)+" jenis amalan aktif",1),t("div",Tt,"Konsistensi: "+n(e.consistency)+"%",1)]),t("div",Dt,[t("div",St,[t("div",{style:et({width:`${e.percentage}%`}),class:z([Q(s),"h-full rounded-full transition-all duration-1000"])},null,6)]),t("div",jt,n(e.percentage)+"%",1)])]))),128))]),a[20]||(a[20]=t("div",{class:"mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"},[t("div",{class:"text-xs text-blue-700"},[t("strong",null,"💡 Cara Hitung:"),m(" Dilihat dari berapa banyak jenis amalan yang dilakukan (bukan total angka). Contoh: Yang melakukan 8 jenis amalan berbeda lebih konsisten daripada yang cuma fokus 3 jenis tapi total tinggi. ")])],-1))]),t("div",Rt,[a[23]||(a[23]=t("div",{class:"flex justify-between items-start mb-4"},[t("h3",{class:"font-bold text-gray-800 flex items-center gap-2"},[t("span",null,"👥"),m(" Detail per Anggota ")]),t("div",{class:"text-xs text-gray-500 text-right max-w-[150px]"}," Amalan terrutin = yang paling sering dilakukan ")],-1)),t("div",Et,[(g(!0),c(S,null,j(_(B),e=>(g(),c("div",{key:e,class:"bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20"},[t("div",Ct,[t("div",Nt,[t("div",$t,n(e),1),t("h4",Lt,n(e),1)]),t("div",Vt,[t("div",Bt,n(H(e))+"/"+n(_(k).length),1),a[21]||(a[21]=t("div",{class:"text-xs text-gray-500"},"jenis amalan",-1))])]),t("div",Pt,[a[22]||(a[22]=t("div",{class:"text-xs text-gray-600 font-medium"},"Amalan Terrutin:",-1)),t("div",It,[t("span",zt,n(V(e).name),1),t("span",Ut,n(V(e).frequency),1)])])]))),128))]),a[24]||(a[24]=t("div",{class:"mt-4 p-3 bg-green-50 rounded-lg border border-green-200"},[t("div",{class:"text-xs text-green-700"},[t("strong",null,"💡 Penjelasan:"),m(' "Amalan Terrutin" dihitung dari frekuensi relatif per jenis amalan. Contoh: Shalat 25x lebih rutin daripada Istighfar 100x (karena target Shalat 35x vs Istighfar 700x per pekan). ')])],-1))]),a[25]||(a[25]=at('<div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 shadow-sm"><div class="text-center"><div class="text-2xl mb-3">📈</div><p class="text-sm text-gray-700 font-medium leading-relaxed"> &quot;Dan bahwasanya seorang manusia tiada memperoleh selain apa yang telah diusahakannya.&quot; </p><p class="text-xs text-gray-500 mt-2">- QS An-Najm: 39</p></div></div>',1))]),R.value||v.value?(g(),c("div",qt,[t("div",Ft,[t("div",Ot,[t("span",Yt,n((v.value,"📊")),1)]),a[26]||(a[26]=t("div",{class:"w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"},null,-1)),t("p",Kt,n(v.value?"Membuat file Excel...":"Memuat laporan..."),1)])])):tt("",!0)]))}};export{Jt as default};
