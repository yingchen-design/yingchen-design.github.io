const caseSummaries = {
  redesign: {
    en: [
      [
            "Challenge",
            "Years of growth had fragmented the portal’s visual language, navigation and interaction patterns."
      ],
      [
            "My responsibility",
            "I led the redesign direction and designed all work shown here, collaborating with design, product and engineering through implementation."
      ],
      [
            "Key decision",
            "Establish one recognizable RightCapital product language while preserving familiar workflows and improving ambiguous interactions."
      ],
      [
            "Delivered",
            "The complete redesign is live, including the pages and components shown here. A six-participant internal pilot provided qualitative interaction findings."
      ]
],
    ja: [
      [
            "課題",
            "長年の機能拡張によって、画面の見た目、ナビゲーション、操作パターンが分断されていました。"
      ],
      [
            "担当範囲",
            "全体のデザイン方針を主導し、本ケースに掲載したデザインをすべて担当。デザイン・プロダクト・開発と協働し、実装まで関わりました。"
      ],
      [
            "重要な判断",
            "使い慣れた業務フローを尊重しながら、RightCapitalらしい統一されたプロダクト体験を構築しました。"
      ],
      [
            "リリース",
            "掲載した画面・コンポーネントを含む全体の改修はリリース済みです。社内参加者6名のパイロットでは操作上の定性的な知見を得ました。"
      ]
]
  },
  crm: {
    en: [
      ['Challenge', 'Contact records showed who a person was, but not the shared relationship, current workload, or history an advisor needed to act.'],
      ['My responsibility', 'I led the information architecture and interaction design for the household list and household summary—the two core entry points shown here.'],
      ['Key decision', 'Make the household the primary work object while keeping client and co-client identities individually legible.'],
      ['Evidence', 'The direction came from the CEO’s observation and conversations with real users. The product launched; no CRM usability-test metrics are claimed here.']
    ],
    ja: [
      ['課題', '連絡先情報だけでは、顧客同士の関係、進行中の業務、これまでの履歴を把握できず、アドバイザーが次の行動を判断しにくい状態でした。'],
      ['担当範囲', '主要な入口となる世帯一覧と世帯サマリーについて、情報設計とインタラクションデザインを主導しました。'],
      ['重要な判断', '個人情報の識別性を保ちながら、「世帯」をCRMの中心となる業務単位にしました。'],
      ['根拠', 'CEOの観察と実際のユーザーとの会話から方向性を定め、プロダクトとしてリリースしました。CRM単体のユーザビリティテスト数値は掲載していません。']
    ]
  },
  express: {
    en: [
      ['Challenge', 'The full planning product created too much setup for people who were still evaluating whether to begin an advisor relationship.'],
      ['My responsibility', 'I led the 0→1 experience across both sides: advisor configuration and follow-up, plus the prospect’s focused planning journey.'],
      ['Key decision', 'Build Express as a planning type inside the existing client model, not as a disconnected lead-generation product.'],
      ['Evidence', 'Launched in 2025, with public advisor responses showing immediate workflow relevance and an industry critique confirming the core depth-versus-friction tradeoff.']
    ],
    ja: [
      ['課題', '顧客になるか検討中の見込み客にとって、フルプランニングは初期設定と情報入力の負担が大きすぎました。'],
      ['担当範囲', 'アドバイザー側の設定・フォローアップと、見込み客側の限定されたプランニング体験を含む0→1の体験設計を主導しました。'],
      ['重要な判断', '独立したリード獲得ツールではなく、既存の顧客モデル内にExpressというプランニング種別を設けました。'],
      ['結果', '2025年に正式リリース。公開された反応から実務フローへの適合が確認され、業界分析でも「負担軽減と十分な価値提示」の両立が主要論点として評価されました。']
    ]
  },
  mde: {
    en: [
      ['Challenge', 'A monthly campaign had to feel fresh while remaining recognizable across dense Japanese copy, changing categories, and radically different formats.'],
      ['My responsibility', 'Within GPS CN, I directed visual production and design QA against D1 Japan’s creative framework, collaborating with the CN 3D team and graphic designers. I also led the website UI/UX for Project Moon.'],
      ['Key decision', 'Separate stable brand structure from variable content so one system could absorb monthly change without becoming visually repetitive.'],
      ['Evidence', 'The system supported 60+ categories and approximately 12 events a year, while the self-service workflow substantially shortened production time.']
    ],
    ja: [
      ['課題', '情報量の多い日本語コピー、毎月変わるカテゴリー、多様なバナーサイズに対応しながら、鮮度と一貫した認知を両立する必要がありました。'],
      ['担当範囲', 'ビジュアルの方向性、制作フィードバック、デザインQA、およびProject MoonのWeb UI/UXを担当しました。3Dアセットはチームで制作しており、モデリング自体は担当していません。'],
      ['重要な判断', '固定するブランド構造と変更可能なコンテンツを分離し、毎月の変化を吸収できるシステムを設計しました。'],
      ['結果', '60以上の商品カテゴリーと年間12回以上のイベントに対応し、セルフサービス化によって制作時間を大幅に短縮しました。']
    ]
  }
};

const caseId = document.body.dataset.case;
const summary = caseSummaries[caseId];
const brief = document.querySelector('.case-brief');

if (summary && brief && document.body.dataset.language === 'en') {
  brief.querySelectorAll('article').forEach((article, index) => {
    const content = summary.en[index];
    if (!content) return;
    article.querySelector('span').textContent = content[0];
    article.querySelector('p').textContent = content[1];
  });
  brief.lang = 'en';
} else if (summary && brief) {
  const controls = document.createElement('div');
  controls.className = 'case-language-switch';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Case summary language');
  controls.innerHTML = '<button type="button" data-case-lang="en">EN</button><span>/</span><button type="button" data-case-lang="ja">日本語</button>';
  const count = document.querySelector('.case-nav .count');
  if (count) {
    const tools = document.createElement('div');
    tools.className = 'case-nav-tools';
    count.replaceWith(tools);
    tools.append(controls, count);
  }

  const setCaseLanguage = (language) => {
    const active = summary[language] ? language : 'en';
    brief.querySelectorAll('article').forEach((article, index) => {
      const content = summary[active][index];
      if (!content) return;
      article.querySelector('span').textContent = content[0];
      article.querySelector('p').textContent = content[1];
    });
    controls.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.caseLang === active));
    });
    brief.lang = active;
    try { localStorage.setItem('portfolio-case-language', active); } catch (_) {}
  };

  controls.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => setCaseLanguage(button.dataset.caseLang));
  });

  let initialLanguage = 'en';
  try { initialLanguage = localStorage.getItem('portfolio-case-language') || 'en'; } catch (_) {}
  setCaseLanguage(initialLanguage);
}
