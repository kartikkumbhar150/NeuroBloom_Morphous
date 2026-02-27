from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.platypus.flowables import Flowable
import json
import os
import time


# ─── Custom Flowable: Colored Section Banner ───────────────────────────────
class SectionBanner(Flowable):
    """A full-width colored banner for section headers."""
    def __init__(self, text, bg_color, text_color=colors.white, height=26, font_size=11):
        super().__init__()
        self.text = text
        self.bg_color = bg_color
        self.text_color = text_color
        self.banner_height = height
        self.font_size = font_size
        self.width = 0  # will be set by doc

    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        return (availWidth, self.banner_height + 6)

    def draw(self):
        c = self.canv
        # Rounded-rect background
        c.setFillColor(self.bg_color)
        c.roundRect(0, 2, self.width, self.banner_height, 4, fill=1, stroke=0)
        # Text
        c.setFillColor(self.text_color)
        c.setFont("Helvetica-Bold", self.font_size)
        c.drawString(10, 9, self.text)


# ─── Custom Flowable: Thin accent rule ─────────────────────────────────────
class AccentRule(Flowable):
    def __init__(self, width_frac=1.0, color=None, thickness=0.6):
        super().__init__()
        self.width_frac = width_frac
        self.rule_color = color
        self.thickness = thickness

    def wrap(self, availWidth, availHeight):
        self._avail = availWidth
        return (availWidth, self.thickness + 4)

    def draw(self):
        c = self.canv
        c.setStrokeColor(self.rule_color)
        c.setLineWidth(self.thickness)
        c.line(0, 2, self._avail * self.width_frac, 2)


def create_pdf(full_json, llm_response):
    try:
        if isinstance(llm_response, str):
            clean_json = llm_response.replace("```json", "").replace("```", "").strip()
            llm_data = json.loads(clean_json)
        else:
            llm_data = llm_response
    except Exception as e:
        print(f"[PDF ERROR] JSON Parsing Failed: {e}")
        return None

    os.makedirs("reports", exist_ok=True)
    session_id = full_json.get('session_id', 'report')
    filename = f"reports/{session_id}.pdf"

    doc = SimpleDocTemplate(
        filename, pagesize=A4,
        rightMargin=36, leftMargin=36,
        topMargin=36, bottomMargin=48
    )

    # ── Palette ─────────────────────────────────────────────────────────────
    PRIMARY       = colors.HexColor("#1B4F72")   # deep navy
    PRIMARY_LIGHT = colors.HexColor("#2E86C1")   # medium blue
    ACCENT        = colors.HexColor("#148F77")   # teal accent
    HEADER_BG     = colors.HexColor("#1B4F72")
    ROW_ALT       = colors.HexColor("#EBF5FB")   # very light blue stripe
    SOFT_BG       = colors.HexColor("#F8FAFB")
    BORDER        = colors.HexColor("#AEB6BF")
    DANGER_RED    = colors.HexColor("#C0392B")
    WARNING_OG    = colors.HexColor("#D35400")
    SUCCESS_GRN   = colors.HexColor("#1E8449")
    LOW_BLUE      = colors.HexColor("#2471A3")
    TEXT_DARK     = colors.HexColor("#1C2833")
    TEXT_MID      = colors.HexColor("#2C3E50")
    FOOTER_LINE   = colors.HexColor("#85929E")
    CONFIDENTIAL  = colors.HexColor("#E8F4F8")

    # ── Typography ───────────────────────────────────────────────────────────
    def ps(name, parent_name='Normal', **kw):
        styles = getSampleStyleSheet()
        return ParagraphStyle(name, parent=styles[parent_name], **kw)

    title_style = ps('ReportTitle', 'Title',
        fontSize=22, textColor=colors.white,
        fontName='Helvetica-Bold', alignment=0,
        spaceAfter=0, spaceBefore=0, leading=26)

    subtitle_style = ps('ReportSubtitle',
        fontSize=9, textColor=colors.HexColor("#BDC3C7"),
        fontName='Helvetica', leading=13)

    normal_style = ps('ReportNormal',
        fontSize=9.5, textColor=TEXT_DARK, leading=13.5)

    small_style = ps('ReportSmall',
        fontSize=8.5, textColor=TEXT_MID, leading=12)

    bold_style = ps('ReportBold',
        fontSize=9.5, fontName='Helvetica-Bold', textColor=TEXT_DARK, leading=13.5)

    table_header_style = ps('TblHeader',
        fontSize=9, fontName='Helvetica-Bold',
        textColor=colors.white, leading=12)

    label_style = ps('Label',
        fontSize=8, fontName='Helvetica-Bold',
        textColor=colors.HexColor("#5D6D7E"), leading=11)

    value_style = ps('Value',
        fontSize=9.5, fontName='Helvetica', textColor=TEXT_DARK, leading=13)

    activity_title_style = ps('ActTitle',
        fontSize=10, fontName='Helvetica-Bold',
        textColor=PRIMARY, leading=14)

    story = []
    W = 7.17 * inch  # usable width (A4 minus margins)

    # ════════════════════════════════════════════════════════════════════════
    # HEADER BLOCK
    # ════════════════════════════════════════════════════════════════════════
    header_data = [[
        Table([
            [Paragraph("NeuroBloom", title_style)],
            [Paragraph("Clinical Neuro-Cognitive Assessment Report", subtitle_style)],
        ], colWidths=[4.5*inch], rowHeights=None),
        Table([
            [Paragraph("CONFIDENTIAL", ps('Conf', fontSize=7, fontName='Helvetica-Bold',
                textColor=colors.HexColor("#E74C3C"), alignment=2))],
            [Paragraph(f"Report Date: {time.strftime('%B %d, %Y')}", ps('RD', fontSize=8,
                textColor=colors.HexColor("#BDC3C7"), alignment=2))],
            [Paragraph(f"Document ID: {session_id}", ps('DID', fontSize=7.5,
                textColor=colors.HexColor("#85929E"), alignment=2))],
        ], colWidths=[2.5*inch]),
    ]]
    header_table = Table(header_data, colWidths=[4.5*inch, 2.5*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 16),
        ('BOTTOMPADDING', (0,0), (-1,-1), 16),
        ('LEFTPADDING', (0,0), (0,-1), 16),
        ('RIGHTPADDING', (-1,0), (-1,-1), 14),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # ── Teal accent bar ──────────────────────────────────────────────────────
    story.append(AccentRule(color=ACCENT, thickness=2.5))
    story.append(Spacer(1, 10))

    # ════════════════════════════════════════════════════════════════════════
    # PATIENT DEMOGRAPHICS
    # ════════════════════════════════════════════════════════════════════════
    def dem_cell(label, value):
        return Table([
            [Paragraph(label, label_style)],
            [Paragraph(value, value_style)],
        ], colWidths=[1.65*inch])

    demo_data = [[
        dem_cell("PATIENT NAME", full_json.get('patient_name', 'Kartik Kumbhar')),
        dem_cell("AGE / SEX", "6 Years / Male"),
        dem_cell("SESSION ID", session_id),
        dem_cell("ASSESSMENT DATE", time.strftime('%d %b %Y')),
    ]]
    demo_table = Table(demo_data, colWidths=[1.79*inch]*4)
    demo_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SOFT_BG),
        ('BOX', (0,0), (-1,-1), 0.8, PRIMARY_LIGHT),
        ('LINEAFTER', (0,0), (2,0), 0.5, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(demo_table)
    story.append(Spacer(1, 16))

    # ════════════════════════════════════════════════════════════════════════
    # SECTION I — CLINICAL RISK SCREENING MATRIX
    # ════════════════════════════════════════════════════════════════════════
    story.append(SectionBanner("I.  CLINICAL RISK SCREENING MATRIX", HEADER_BG))
    story.append(Spacer(1, 8))

    screenings = llm_data.get("screenings", [])
    if screenings:
        matrix_data = [[
            Paragraph("DISORDER", table_header_style),
            Paragraph("RISK LEVEL", table_header_style),
            Paragraph("CLINICAL FINDINGS & MECHANISM", table_header_style),
        ]]

        for i, item in enumerate(screenings):
            status = item.get('status', 'N/A')
            if "High" in status:
                risk_color, risk_bg = DANGER_RED, colors.HexColor("#FDEDEC")
            elif "Medium" in status:
                risk_color, risk_bg = WARNING_OG, colors.HexColor("#FEF9E7")
            elif "Low" in status:
                risk_color, risk_bg = LOW_BLUE, colors.HexColor("#EBF5FB")
            else:
                risk_color, risk_bg = ACCENT, colors.HexColor("#E8F8F5")

            status_cell = Table([
                [Paragraph(f"<b>{status}</b>",
                    ps('RiskTxt', fontSize=9, fontName='Helvetica-Bold',
                       textColor=risk_color, alignment=1, leading=12))],
            ])
            status_cell.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), risk_bg),
                ('BOX', (0,0), (-1,-1), 0.8, risk_color),
                ('TOPPADDING', (0,0), (-1,-1), 5),
                ('BOTTOMPADDING', (0,0), (-1,-1), 5),
                ('LEFTPADDING', (0,0), (-1,-1), 4),
                ('RIGHTPADDING', (0,0), (-1,-1), 4),
            ]))

            finding_text = (
                f"<b>Observation:</b> {item.get('finding', '')}<br/>"
                f"<font color='#5D6D7E' size='8.5'><b>Mechanism:</b> "
                f"{item.get('biological_cause', 'Neurological processing delay')}</font>"
            )
            row_bg = ROW_ALT if i % 2 == 0 else colors.white
            matrix_data.append([
                Paragraph(f"<b>{item.get('disability', 'N/A')}</b>", normal_style),
                status_cell,
                Paragraph(finding_text, normal_style),
            ])

        t = Table(matrix_data, colWidths=[1.5*inch, 1.1*inch, 4.37*inch])
        style_cmds = [
            ('BACKGROUND', (0, 0), (-1, 0), HEADER_BG),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor("#D5D8DC")),
            ('BOX', (0, 0), (-1, -1), 0.8, PRIMARY),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 9),
            ('TOPPADDING', (1, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (1, 1), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, ROW_ALT]),
        ]
        t.setStyle(TableStyle(style_cmds))
        story.append(t)

    story.append(Spacer(1, 16))

    # ════════════════════════════════════════════════════════════════════════
    # SECTION II — DEVELOPMENTAL PROFILE
    # ════════════════════════════════════════════════════════════════════════
    story.append(SectionBanner("II.  DEVELOPMENTAL PROFILE", HEADER_BG))
    story.append(Spacer(1, 8))

    profile = llm_data.get("child_profile", {})
    strengths = profile.get("strengths", [])
    weaknesses = profile.get("weaknesses", [])

    def make_profile_col(items, accent_col):
        rows = []
        for s in items:
            rows.append(Table([
                [Paragraph(f"<b>{s['area']}</b>", ps('PA', fontSize=9, fontName='Helvetica-Bold',
                    textColor=accent_col, leading=12)),
                 Paragraph(s['description'], small_style)]
            ], colWidths=[1.1*inch, 2.1*inch]))
        return rows

    str_rows = make_profile_col(strengths, SUCCESS_GRN)
    wk_rows  = make_profile_col(weaknesses, DANGER_RED)
    max_rows = max(len(str_rows), len(wk_rows))

    # Build header row
    sw_data = [[
        Table([[Paragraph("▲  KEY COGNITIVE STRENGTHS",
            ps('PH', fontSize=9, fontName='Helvetica-Bold', textColor=SUCCESS_GRN, leading=12))]],
            colWidths=[3.4*inch]),
        Table([[Paragraph("▼  IDENTIFIED VULNERABILITIES",
            ps('PH2', fontSize=9, fontName='Helvetica-Bold', textColor=DANGER_RED, leading=12))]],
            colWidths=[3.4*inch]),
    ]]
    for i in range(max_rows):
        left  = str_rows[i] if i < len(str_rows) else Paragraph("", normal_style)
        right = wk_rows[i]  if i < len(wk_rows)  else Paragraph("", normal_style)
        sw_data.append([left, right])

    sw_table = Table(sw_data, colWidths=[3.55*inch, 3.55*inch])
    sw_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#EAFAF1")),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor("#FDEDEC")),
        ('LINEBELOW', (0, 0), (-1, 0), 1, BORDER),
        ('BOX', (0, 0), (-1, -1), 0.8, BORDER),
        ('LINEBETWEEN', (0, 0), (1, -1), 0.5, BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (0, -1), [colors.white, colors.HexColor("#F4FCF7")]),
        ('ROWBACKGROUNDS', (1, 1), (1, -1), [colors.white, colors.HexColor("#FEF9F9")]),
    ]))
    story.append(sw_table)

    # ── Parental Precautions ─────────────────────────────────────────────────
    precautions = profile.get("parental_precautions", [])
    if precautions:
        story.append(Spacer(1, 12))
        story.append(SectionBanner("PARENTAL MANAGEMENT & ENVIRONMENTAL ADJUSTMENTS",
            colors.HexColor("#1A5276"), height=22, font_size=9.5))
        story.append(Spacer(1, 6))
        prec_items = [[Paragraph(f"<b>→</b>  {p}", normal_style)] for p in precautions]
        prec_table = Table(prec_items, colWidths=[W])
        prec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EBF5FB")),
            ('BOX', (0,0), (-1,-1), 0.6, PRIMARY_LIGHT),
            ('LINEBEFORE', (0,0), (0,-1), 3, PRIMARY_LIGHT),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
        ]))
        story.append(prec_table)

    # ════════════════════════════════════════════════════════════════════════
    # PAGE BREAK → SECTION III
    # ════════════════════════════════════════════════════════════════════════
    story.append(PageBreak())

    # Re-print compact page header on page 2
    p2_header = Table([[
        Paragraph("<b>NeuroBloom</b> — Therapeutic Intervention Plan",
            ps('P2H', fontSize=10, fontName='Helvetica-Bold', textColor=colors.white)),
        Paragraph(f"Patient: {full_json.get('patient_name', 'Kartik Kumbhar')}  |  {time.strftime('%d %b %Y')}",
            ps('P2S', fontSize=8.5, textColor=colors.HexColor("#AED6F1"), alignment=2)),
    ]], colWidths=[4.2*inch, 2.97*inch])
    p2_header.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LEFTPADDING', (0,0), (0,0), 14),
        ('RIGHTPADDING', (-1,0), (-1,0), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(p2_header)
    story.append(AccentRule(color=ACCENT, thickness=2))
    story.append(Spacer(1, 12))

    story.append(SectionBanner("III.  THERAPEUTIC INTERVENTION PLAN", HEADER_BG))
    story.append(Spacer(1, 10))

    interventions = llm_data.get("intervention_plan", {})
    activities = interventions.get("daily_activities", [])

    for idx, act in enumerate(activities):
        act_num = f"Activity {idx+1:02d}"
        act_content = [
            [Paragraph(act_num, ps('AN', fontSize=7.5, fontName='Helvetica-Bold',
                textColor=PRIMARY_LIGHT, leading=10)),
             Paragraph(f"<b>{act.get('name', 'N/A')}</b>",
                ps('ANAME', fontSize=10.5, fontName='Helvetica-Bold',
                   textColor=PRIMARY, leading=14))],
            [Paragraph("GOAL", ps('GL', fontSize=7.5, fontName='Helvetica-Bold',
                textColor=ACCENT, leading=10)),
             Paragraph(act.get('goal', 'N/A'), normal_style)],
            [Paragraph("HOW TO", ps('HT', fontSize=7.5, fontName='Helvetica-Bold',
                textColor=colors.HexColor("#5D6D7E"), leading=10)),
             Paragraph(act.get('instructions', 'N/A'), normal_style)],
        ]
        at = Table(act_content, colWidths=[0.65*inch, 6.3*inch])
        at.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), SOFT_BG),
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#EBF5FB")),
            ('LINELEFT', (0,0), (0,-1), 4, PRIMARY_LIGHT),
            ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor("#D6EAF8")),
            ('LINEBELOW', (0,1), (-1,1), 0.5, colors.HexColor("#D6EAF8")),
            ('BOX', (0,0), (-1,-1), 0.6, BORDER),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 7),
            ('LEFTPADDING', (0,0), (0,-1), 8),
            ('LEFTPADDING', (1,0), (1,-1), 10),
            ('RIGHTPADDING', (1,0), (1,-1), 10),
        ]))
        story.append(KeepTogether([at, Spacer(1, 8)]))

    # ── Therapy Recommendations ──────────────────────────────────────────────
    therapies = interventions.get("therapeutic_recommendations", [])
    if therapies:
        story.append(Spacer(1, 8))
        story.append(SectionBanner("RECOMMENDED PROFESSIONAL SERVICES", ACCENT, height=22, font_size=9.5))
        story.append(Spacer(1, 6))

        th_data = [[
            Paragraph("THERAPY / SERVICE", table_header_style),
            Paragraph("CLINICAL RATIONALE", table_header_style),
        ]]
        for i, therapy in enumerate(therapies):
            th_data.append([
                Paragraph(f"<b>{therapy['therapy']}</b>", normal_style),
                Paragraph(therapy['reason'], normal_style),
            ])

        th_table = Table(th_data, colWidths=[2.0*inch, 5.17*inch])
        th_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), ACCENT),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.4, colors.HexColor("#D5D8DC")),
            ('BOX', (0,0), (-1,-1), 0.8, ACCENT),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#E8F8F5")]),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(th_table)

    # ════════════════════════════════════════════════════════════════════════
    # FOOTER / SIGNATURE BLOCK
    # ════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 30))
    story.append(AccentRule(color=FOOTER_LINE, thickness=0.5))
    story.append(Spacer(1, 10))

    sig_data = [[
        Table([
            [Paragraph("_________________________________", ps('SL', fontSize=9, textColor=TEXT_MID))],
            [Paragraph("Certified Clinical Reviewer", bold_style)],
            [Paragraph("NeuroBloom Diagnostic Centre", small_style)],
            [Paragraph(f"Date Signed: {time.strftime('%d/%m/%Y')}", small_style)],
        ], colWidths=[3.0*inch]),
        Table([
            [Paragraph("DISCLAIMER", ps('DL', fontSize=7.5, fontName='Helvetica-Bold',
                textColor=colors.HexColor("#E74C3C")))],
            [Paragraph(
                "This report is generated to assist qualified clinicians and is not a standalone "
                "diagnostic tool. All findings must be interpreted by a licensed healthcare "
                "professional in conjunction with a comprehensive clinical evaluation.",
                ps('DC', fontSize=7.5, textColor=colors.HexColor("#7F8C8D"), leading=11)
            )],
        ], colWidths=[3.9*inch]),
    ]]
    sig_table = Table(sig_data, colWidths=[3.2*inch, 4.0*inch])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (1,0), (1,0), 20),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#FEF9E7")),
        ('BOX', (1,0), (1,0), 0.5, colors.HexColor("#F0B27A")),
        ('TOPPADDING', (1,0), (1,0), 8),
        ('BOTTOMPADDING', (1,0), (1,0), 8),
        ('RIGHTPADDING', (1,0), (1,0), 10),
    ]))
    story.append(sig_table)

    doc.build(story)
    return filename