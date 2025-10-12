/* Capital City Contractors — Ottawa Renovation Guide (8–12 pages), branded and generated client-side */
(function(){
  function generateGuidePDF(){
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF generator not loaded. Please try again.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' }); // 612 x 792

    // Brand + layout
    const BLACK = '#000000';
    const AMBER = '#f59e0b';
    const PAGE_W = 612, PAGE_H = 792, M = 56, CONTENT_W = PAGE_W - (M*2);
    let y = M;

    function header(title){
      // Brand bar
      doc.setFillColor(0,0,0); doc.rect(0,0,PAGE_W,44,'F');
      doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(12);
      doc.text('Capital City Contractors', M, 28);
      doc.setFont('helvetica','normal'); doc.text('| Ottawa Home Renovation Guide', M+200, 28);
      // Section title
      doc.setTextColor(0,0,0); doc.setFont('helvetica','bold'); doc.setFontSize(18);
      y = 72; doc.text(title, M, y); y += 14;
      // Amber underline
      doc.setDrawColor(245,158,11); doc.setLineWidth(2); doc.line(M, y, M+220, y); y += 20;
    }
    function footer(){
      const text = 'Capital City Contractors • Ottawa, ON • (613) 301-1311 • capitalcitycontractors.ca';
      doc.setFont('helvetica','italic'); doc.setFontSize(9); doc.setTextColor(90);
      doc.text(text, M, PAGE_H-24);
    }
    function ensureSpace(lines=1, lineH=16){
      if (y + (lines*lineH) > PAGE_H - 64){
        footer(); doc.addPage(); y = M; header('Ottawa Home Renovation Guide');
      }
    }
    function h2(text){
      ensureSpace(2); doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(0);
      doc.text(text, M, y); y += 18;
    }
    function p(text){
      doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(30);
      const lines = doc.splitTextToSize(text, CONTENT_W);
      lines.forEach((ln)=>{ ensureSpace(1); doc.text(ln, M, y); y += 14; }); y += 4;
    }
    function bullets(items){
      doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(30);
      items.forEach((it)=>{
        const lines = doc.splitTextToSize('• ' + it, CONTENT_W);
        lines.forEach((ln)=>{ ensureSpace(1); doc.text(ln, M, y); y += 14; });
      }); y += 4;
    }
    function callout(title, body){
      ensureSpace(4); doc.setDrawColor(245,158,11); doc.setLineWidth(1.2);
      doc.roundedRect(M, y, CONTENT_W, 48, 6, 6);
      doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.setTextColor(0); doc.text(title, M+10, y+18);
      doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(30);
      const lines = doc.splitTextToSize(body, CONTENT_W-20); doc.text(lines, M+10, y+34);
      y += 58;
    }

    // Cover
    header('Ottawa Home Renovation Guide 2025');
    p('A practical, contractor-approved guide tailored for Ottawa homeowners. This guide focuses on planning, quality, and coordination—without divulging pricing strategies.');
    callout('How to Use','Skim each section before meeting contractors. Mark what applies to your home and bring this guide to site visits.');
    footer(); doc.addPage(); header('1) Pre‑Renovation Planning Checklist');

    // 1) Pre-Renovation Planning
    p('Define the project clearly and capture constraints before any quotes.');
    bullets([
      'Rooms/spaces included and goals (must‑haves vs nice‑to‑haves)',
      'Timeline window (earliest start, latest finish); any blackout dates',
      'Access/parking constraints; condo elevator bookings if applicable',
      'Containment expectations (dust control, daily cleanup)',
      'After‑hours or weekend limits (neighbours/HOA)'
    ]);
    callout('Ottawa Tip','Book condo elevators early and confirm fire panel procedures if any work triggers alarms.');

    // 2) Questions to Ask Contractors
    footer(); doc.addPage(); header('2) Questions to Ask Contractors');
    bullets([
      'Are you licensed/insured locally? WSIB coverage confirmation?',
      'Who is on site daily? Who is my single point of contact?',
      'What does your warranty cover (labour, materials)? For how long?',
      'How do you manage dust, ventilation, and protection for floors/fixtures?',
      'What is the daily schedule and cleanup routine?'
    ]);
    p('Ask for references or recent Ottawa projects similar to yours. Focus on communication, schedule discipline, and cleanliness as key quality indicators.');

    // 3) Ottawa-specific Permits
    footer(); doc.addPage(); header('3) Ottawa‑Specific Permits & Compliance');
    p('Many interior projects don’t require permits; however, structural changes, electrical, plumbing, and egress adjustments may. Always verify with the City of Ottawa.');
    bullets([
      'Interior structural changes (load‑bearing walls, beam work)',
      'Electrical circuits, new subpanels, or major rewiring (ESA permits)',
      'Plumbing relocations or new fixtures (where applicable)',
      'Basement bedrooms: egress and smoke/CO requirements',
      'Historic or condo bylaws where applicable'
    ]);
    callout('Where to Start','City of Ottawa Building Code Services and ESA (Electrical Safety Authority) are the authoritative sources.');

    // 4) Timeline Expectations
    footer(); doc.addPage(); header('4) Typical Timeline Expectations');
    p('Timelines vary by scope and selections. Expect buffers for drying/curing and inspections.');
    bullets([
      'Interior repaint (occupied): 2‑7 days depending on rooms and prep',
      'Drywall repair + repaint: add 1‑3 days for compound dry time',
      'Kitchen refresh (paint + minor carpentry): 1‑2 weeks',
      'Full bathroom remodel: 2‑4 weeks depending on trades/lead times'
    ]);
    callout('Pro Tip','Build in 10‑20% schedule contingency for selections or unforeseen repairs.');

    // 5) Material Selection (no pricing)
    footer(); doc.addPage(); header('5) Material Selection (No Pricing)');
    bullets([
      'Paint: match sheen to use—matte/eggshell for walls, semi‑gloss for trim/doors',
      'Drywall: note previous patches, water damage, and texture matching needs',
      'Ventilation: ensure proper airflow and humidity control, especially in winter',
      'Floor protection: Ram Board or comparable for heavy traffic areas'
    ]);
    p('Your contractor can recommend durable, locally available products without committing to vendor‑specific pricing in the guide.');

    // 6) Seasonal Considerations (Ottawa)
    footer(); doc.addPage(); header('6) Seasonal Considerations in Ottawa');
    bullets([
      'Winter: humidity/ventilation planning; paint curing time may increase',
      'Spring: schedule fills quickly—book consultations early',
      'Summer: exterior tie‑ins (e.g., venting) may be more feasible',
      'Fall: plan ahead for holiday deadlines; allow reorder buffers'
    ]);

    // 7) Quality Indicators
    footer(); doc.addPage(); header('7) Quality Indicators to Look For');
    bullets([
      'Prep thoroughness: caulking, sanding, priming where needed',
      'Straight cut lines, consistent sheen, no visible lap marks',
      'Proper masking and surface protection maintained throughout',
      'Final walkthrough with tape‑mark touch‑ups and written punchlist'
    ]);

    // 8) Red Flags When Hiring
    footer(); doc.addPage(); header('8) Red Flags When Hiring');
    bullets([
      'No written scope/warranty; vague timelines',
      'Uninsured/WSIB issues; reluctance to provide references',
      'Pressure tactics or unusually low quotes without clear scope',
      'Poor site protection plan or lack of daily cleanup'
    ]);

    // 9) Project Preparation Steps
    footer(); doc.addPage(); header('9) Project Preparation Steps');
    bullets([
      'Clear rooms and surfaces; store valuables; plan pet/child safety',
      'Discuss parking, access, elevator bookings',
      'Agree on daily start/end times and home access protocol',
      'Confirm colour selections, paint finishes, and any test walls'
    ]);

    // 10) Post‑Renovation Maintenance
    footer(); doc.addPage(); header('10) Post‑Renovation Maintenance');
    bullets([
      'Keep leftover labelled paint for future touch‑ups',
      'Note product info (brand, sheen, colour codes) and store digitally',
      'Wipe surfaces with mild cleaners; avoid harsh chemicals initially',
      'Schedule seasonal inspections for caulking, grout, and joints'
    ]);
    callout('Get Help','Have questions? We’re happy to advise on upkeep and next steps.');

    // Final page with contact
    footer(); doc.addPage(); header('Ready to Start?');
    p('When you’re ready, we can help plan, schedule, and execute a clean, professional renovation. Expect clear communication, tidy workspaces, and a quality walkthrough at the end.');
    callout('Contact','(613) 301-1311 • capitalcitycontractors.ca • Ottawa & Area');
    footer();

    doc.save('Ottawa-Renovation-Guide-CCC.pdf');
  }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('downloadGuideBtn');
    if (btn) btn.addEventListener('click', generateGuidePDF);
  });
})();

