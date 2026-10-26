/* Role-specific application copy. Historical job titles and dates remain in HTML. */
(() => {
'use strict';
const versions = {
  "design-lead": {
    "headline": "I turn design direction into shared systems and shipped work.",
    "summary": "Design Lead with experience at RightCapital, Amazon and IBM. I lead complex redesigns, establish reusable design foundations and align designers, product and engineering around a clear direction.",
    "approach": "My work connects hands-on design with delivery planning, cross-team communication and design advocacy.",
    "intro": "Led the Advisor / Admin Portal redesign while partnering with Beijing engineering, Shelton product and the Marketing design team.",
    "rightcapital": [
      "<strong>Design roadmap & delivery.</strong> Led a launched redesign across <strong>50+ pages</strong> in RightIntel, RightFlows and Risk. Mapped scope by user role, navigation, designer and due date, enabling <strong>3+ designers</strong> to work in parallel.",
      "<strong>Direction through hands-on design.</strong> Established the Risk module’s visual and interaction baseline and personally designed core Firm Admin journeys, giving the broader redesign a concrete reference.",
      "<strong>Shared design foundations.</strong> Co-led Design Tokens Season 2 across color, typography, spacing and radius. Aligned product and Marketing needs around a DTCG-aligned foundation for Design System V2; maintained the Figma source for <strong>10+ production components</strong>.",
      "<strong>US reporting & design advocacy.</strong> Traveled to the US to represent the design team and present project outcomes. Delivered separate work updates on behalf of the UI/UX and Marketing teams, explaining the design principles behind the work and advocating their adoption.",
      "<strong>User testing & stakeholder discussion.</strong> Conducted a qualitative usability pilot with <strong>6 internal participants</strong>. Brought findings on navigation, action visibility and interface clarity into design discussions and follow-up priorities.",
      "<strong>Cross-functional quality.</strong> Worked with engineering through implementation and design QA, including Client Portal themes, web / PDF consistency and Redtail / Wealthbox integrations."
    ],
    "amazonlead": [
      "<strong>Design direction.</strong> Led UX/UI, branding and design consulting initiatives, guiding the design team and aligning stakeholders on complex design decisions.",
      "<strong>Scalable process.</strong> Created a design system that improved consistency across product features and <strong>reduced design iteration time by 28%</strong>.",
      "<strong>Quality standards.</strong> Drove an AI-assisted accessibility audit, increasing visual assets meeting accessibility standards from <strong>69% to 95%</strong> by Q4 2022."
    ],
    "amazondesigner": [
      "Supported <strong>13 marketplaces</strong> across North America, Europe, India and Japan, connecting UX/UI, visual design, 2D animation and communication.",
      "Served as a Prime subject-matter expert and XCM Prime brand ambassador. Led creative reviews that raised the design quality score from <strong>2 to 3.5</strong>, and trained internal teams and stakeholders on accessibility and brand consistency.",
      "Improved Amazon US middle-funnel creative through forms and interactive elements; reduced design rejection rate from <strong>7.01% to 2.4%</strong> over the reporting period."
    ],
    "skills": "Design direction · Design delivery planning · Cross-functional alignment · Design systems · Design critique · Visual design · User testing · Design QA"
  },
  "uiux": {
    "headline": "I make complex workflows easier to understand and use.",
    "summary": "UI/UX Designer with experience at RightCapital, Amazon and IBM. I design financial advisor workflows, clarify everyday actions and build reusable interface systems—from interaction details and prototypes to implementation review.",
    "approach": "I combine interaction design, qualitative user testing and a strong visual foundation to carry decisions through to the shipped interface.",
    "intro": "Designed complex financial advisor workflows across the Advisor / Admin Portal, working closely with product and engineering from design through launch.",
    "rightcapital": [
      "<strong>Complex workflows.</strong> Led the redesign of <strong>50+ pages</strong> across RightIntel, RightFlows and Risk. Personally designed Firm Admin analytics, opportunity views, workflow templates and settings; the redesign is now launched.",
      "<strong>Interaction clarity.</strong> Clarified status and next actions in Data Import, distinguished read-only content from editable fields, and separated selection from navigation in review flows. Established a consistent visual and interaction baseline for Risk.",
      "<strong>Prototypes & user testing.</strong> Conducted a qualitative usability pilot with <strong>6 internal participants</strong>, examining navigation, action discovery and interface clarity. Synthesized observations to support design decisions and identify follow-up priorities.",
      "<strong>Reusable UI.</strong> Co-led layered color, typography, spacing and radius tokens aligned with DTCG. Maintained the master Figma library and specified <strong>10+ components shipped to production</strong>, covering loading, empty, error, disabled, hover and focus states.",
      "<strong>Implementation quality.</strong> Partnered with Beijing engineering and Shelton product on design QA for Client Portal themes, web / PDF consistency and Redtail / Wealthbox integrations, refining spacing, controls and destructive-action signaling."
    ],
    "amazonlead": [
      "Led UX/UI and visual design work, translating stakeholder requirements into consistent interface and brand decisions.",
      "Created a reusable design system that <strong>reduced design iteration time by 28%</strong> and improved consistency across product features.",
      "Used an AI-assisted accessibility audit to identify visual issues and improve the share of assets meeting accessibility standards from <strong>69% to 95%</strong> by Q4 2022."
    ],
    "amazondesigner": [
      "Designed UX/UI, visual assets and 2D motion for <strong>13 marketplaces</strong> across North America, Europe, India and Japan.",
      "Refined forms and interactive elements for Amazon US middle-funnel creative; reduced design rejection rate from <strong>7.01% to 2.4%</strong> over the reporting period.",
      "Applied accessibility and global brand standards as a Prime subject-matter expert and XCM Prime brand ambassador. Led creative reviews that raised the design quality score from <strong>2 to 3.5</strong>."
    ],
    "skills": "Interaction design · Information architecture · Prototyping · Qualitative usability testing · Visual design · Design systems · Design tokens · Accessibility · Design QA"
  }
};
const key = new URLSearchParams(location.search).get('role') === 'uiux' ? 'uiux' : 'design-lead';
const copy = versions[key];
const title = key === 'uiux' ? 'UI/UX Designer' : 'Design Lead';
document.title = title + ' — Yingchen Tang';
document.querySelector('meta[name=description]').content = copy.summary;
document.querySelector('.about-lead').textContent = copy.headline;
document.querySelector('[data-resume-summary]').textContent = copy.summary;
document.querySelector('.about-approach').textContent = copy.approach;
document.querySelector('.job-intro').textContent = copy.intro;
document.querySelector('[data-resume-skills]').textContent = copy.skills;
for (const job of ['rightcapital', 'amazonlead', 'amazondesigner']) {
 const list = document.querySelector('[data-resume-job=' + job + '] ul');
 list.innerHTML = copy[job].map(item => '<li>' + item + '</li>').join('');
}
})();
