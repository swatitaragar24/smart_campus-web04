// DATA - We use localStorage so no database needed
let facilities = [
  {id:0, name:"Seminar Hall A", type:"room", cap:100, loc:"Main Block"},
  {id:1, name:"Kaspersky lab", type:"lab", cap:60, loc:"CS Block"},
  {id:2, name:"Gymkhana", type:"equipment", cap:50, loc:"Room"}
];
let bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
let issues = JSON.parse(localStorage.getItem("issues") || "[]");
let audit = JSON.parse(localStorage.getItem("audit") || "[]");

function login(){
  let email = document.getElementById("email").value;
  let role = document.getElementById("role").value;
  if(!email.includes("@")){ alert("Enter valid email"); return; } // Validation Feature 6
  localStorage.setItem("email", email);
  localStorage.setItem("role", role);
  addAudit("LOGIN as "+role);
  if(role=="admin") location.href="admin.html";
  else location.href="student.html";
}
function logout(){ localStorage.clear(); location.href="index.html"; }
function addAudit(msg){
  audit.push(new Date().toLocaleString()+" - "+msg);
  localStorage.setItem("audit", JSON.stringify(audit));
}
function showToast(msg){
  let t=document.getElementById("toast");
  t.innerText=msg; t.style.display="block";
  setTimeout(()=>t.style.display="none",3000);
}

// STUDENT PAGE
function loadStudent(){
  document.getElementById("user").innerText=localStorage.getItem("email");
  showFacilities(); showMyBookings(); showMyIssues();
}
function showFacilities(){
  let date = document.getElementById("date")?.value;
  let html="";
  facilities.forEach(f=>{
    let booked = bookings.find(b=>b.facId==f.id && b.date==date && b.status!="cancelled");
    html+=`<div class="card ${booked?'booked':'free'}">
      <b>${f.name}</b><br>${f.loc} - Cap: ${f.cap}<br>
      <small>${booked? 'BOOKED by '+booked.email+' Status: '+booked.status : 'FREE'}</small><br>
      ${!booked? `<button onclick="book(${f.id})">Book 10-11 AM</button>` : `<small>Slot blocked - double booking prevented</small>`}
    </div>`;
  });
  document.getElementById("facilities").innerHTML=html;
}
function book(facId){
  let date=document.getElementById("date").value;
  if(!date){ alert("Select date first"); return; }
  // PREVENT CONFLICTING BOOKING - Feature 3
  let conflict = bookings.find(b=>b.facId==facId && b.date==date);
  if(conflict){ alert("❌ Double booking blocked! Already booked."); return; }
  
  let newBook = {id:Date.now(), facId, date, time:"10-11 AM", email:localStorage.getItem("email"), status:"pending"};
  bookings.push(newBook);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  addAudit("BOOK_CREATED "+facilities[facId].name+" on "+date);
  showToast("✅ Booked! Status: pending");
  showFacilities(); showMyBookings();
}
function showMyBookings(){
  let my = bookings.filter(b=>b.email==localStorage.getItem("email"));
  let html=my.map(b=>`<div class="card">${facilities[b.facId].name} - ${b.date} ${b.time} - Status: <b>${b.status}</b> <button onclick="cancelBook(${b.id})">Cancel</button></div>`).join("");
  document.getElementById("myBookings").innerHTML=html || "No bookings";
}
function cancelBook(id){
  let b=bookings.find(x=>x.id==id); b.status="cancelled";
  localStorage.setItem("bookings", JSON.stringify(bookings));
  addAudit("BOOK_CANCELLED id "+id);
  showToast("Booking cancelled"); showFacilities(); showMyBookings();
}
function reportIssue(){
  let facId=document.getElementById("facId").value;
  let cat=document.getElementById("cat").value;
  let pri=document.getElementById("pri").value;
  let desc=document.getElementById("desc").value;
  if(desc.length<10){ alert("Description min 10 letters - Validation"); return; }
  let iss={id:Date.now(), facId, cat, pri, desc, status:"open", email:localStorage.getItem("email")};
  issues.push(iss); localStorage.setItem("issues", JSON.stringify(issues));
  addAudit("ISSUE_REPORTED "+cat+" "+pri);
  showToast("Issue reported with priority: "+pri); showMyIssues();
}
function showMyIssues(){
  let my=issues.filter(i=>i.email==localStorage.getItem("email"));
  document.getElementById("myIssues").innerHTML=my.map(i=>`<div class="card">${facilities[i.facId].name} | ${i.cat} | ${i.pri} | Status: ${i.status}</div>`).join("");
}

// ADMIN PAGE
function loadAdmin(){
  let pend = bookings.filter(b=>b.status=="pending");
  document.getElementById("pending").innerHTML=pend.map(b=>`<div class="card">${facilities[b.facId].name} - ${b.date} by ${b.email} <button onclick="approve(${b.id},'approved')">Approve</button> <button onclick="approve(${b.id},'rejected')">Reject</button></div>`).join("") || "No pending";

  // ANALYTICS - Simple
  let counts={}; bookings.forEach(b=>{ if(b.status!="cancelled") counts[b.facId]=(counts[b.facId]||0)+1; });
  let anaHtml=""; for(let id in counts){ anaHtml+=`<div>${facilities[id].name}: <div style="background:#22d3ee; height:20px; width:${counts[id]*50}px"></div> ${counts[id]} bookings</div>`; }
  document.getElementById("analytics").innerHTML=anaHtml || "No data yet";

  document.getElementById("allIssues").innerHTML=issues.map(i=>`<div class="card">${facilities[i.facId].name} | ${i.cat} | ${i.pri} | ${i.desc} <br>Status: <select onchange="changeIssue(${i.id},this.value)"><option ${i.status=='open'?'selected':''}>open</option><option ${i.status=='in_progress'?'selected':''}>in_progress</option><option ${i.status=='resolved'?'selected':''}>resolved</option><option>closed</option></select></div>`).join("");

  document.getElementById("audit").innerHTML=audit.slice(-20).reverse().join("<br>");
}
function approve(id,status){ let b=bookings.find(x=>x.id==id); b.status=status; localStorage.setItem("bookings", JSON.stringify(bookings)); addAudit("BOOK_"+status.toUpperCase()+" id "+id); showToast("Booking "+status); loadAdmin(); }
function changeIssue(id,status){ let i=issues.find(x=>x.id==id); i.status=status; localStorage.setItem("issues", JSON.stringify(issues)); addAudit("ISSUE_"+status); loadAdmin(); }

// auto refresh facilities when date changes
document.getElementById("date")?.addEventListener("change", showFacilities);