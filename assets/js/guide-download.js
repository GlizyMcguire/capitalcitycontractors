/* Generates a lightweight PDF Renovation Guide without requiring email. */
(function(){
  function generateGuidePDF(){
    if (!window.jspdf && !window.jspdf.jsPDF) {
      alert('PDF generator not loaded. Please try again.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });

    const margin = 48;
    let y = margin;

    function h1(text){
      doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.text(text, margin, y); y += 26;
    }
    function h2(text){
      doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.text(text, margin, y); y += 20;
    }
    function p(text){
      doc.setFont('helvetica','normal'); doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, 612 - margin*2);
      doc.text(lines, margin, y); y += lines.length * 14 + 6;
    }
    function li(text){
      doc.setFont('helvetica','normal'); doc.setFontSize(11);
      const lines = doc.splitTextToSize('• ' + text, 612 - margin*2);
      doc.text(lines, margin, y); y += lines.length * 14 + 4;
    }

    // Title
    h1('Ottawa Home Renovation Checklist');
    p('A practical, contractor-approved checklist to plan a smooth renovation without surprises. No pricing secrets here—just best practices that protect your time, budget, and home.');

    // Sections
    h2('1) Define Your Project Clearly');
    li('Room(s) affected, objectives, must-haves vs nice-to-haves');
    li('Target start/end window and any blackout dates (holidays, travel)');
    li('Comfort with phased work (e.g., paint first, cabinets later)');

    h2('2) Site Preparation');
    li('Clear work zones; protect floors and furniture (plastic, Ram Board)');
    li('Confirm access, parking, stairwells, elevator (if condo)');
    li('Pets and kids plan; daily cleanup expectations');

    h2('3) Materials & Selections');
    li('Paint sheens by room function (matte/eggshell walls, semi-gloss trim)');
    li('Drywall repairs: note water damage or previous patches');
    li('Ventilation and humidity plan, especially in winter');

    h2('4) Contractor Coordination');
    li('Primary contact person and preferred communication (text/email)');
    li('Agree on work hours and noise-sensitive times');
    li('Confirm warranty terms and touch-up policy');

    h2('5) Safety & Compliance');
    li('Confirm WSIB/insurance; safe tool storage; dust control');
    li('Smoke/CO detectors working; protect HVAC returns');

    h2('6) Final Walkthrough');
    li('Inspect walls at day and evening light');
    li('Blue tape for minor touch-ups; note any outstanding items');
    li('Get maintenance tips and paint color records');

    p('Pro tip: Photos before/after each room help track progress and color codes.');

    // Footer
    const footer = 'Capital City Contractors • Ottawa, ON • (613) 301-1311 • capitalcitycontractors.ca';
    doc.setFont('helvetica','italic'); doc.setFontSize(9);
    doc.text(footer, margin, 750);

    doc.save('Ottawa-Renovation-Checklist.pdf');
  }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('downloadGuideBtn');
    if (btn) btn.addEventListener('click', generateGuidePDF);
  });
})();

