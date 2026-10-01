// The four service pages: /services/facials, /lashes, /brows, /waxing.
// Services and prices come from the Services page data (lib/services-data.mjs), never typed here.
// All other wording uses only facts already on the site (Services page, blog articles, Contact).
import { parseServices } from './services-data.mjs';

export const SERVICE_SLUGS = ['facials', 'lashes', 'brows', 'waxing'];

const CATEGORY = { facials: 'Facials', waxing: 'Waxing' };
const NAMES = {
  facials: ['Full Face Rehab', 'Facial Bundle', 'Dermaplaning', 'LED Light Therapy', 'High Frequency'],
  lashes: ['Lash Lift', 'Lash Tint', 'Classic Extensions', 'Classic Fill', 'Hybrid Extensions', 'Hybrid Fill', 'Volume Extensions', 'Volume Fill'],
  brows: ['Brow Lamination', 'Brow Shaping', 'Brow Tint'],
  waxing: [],
};

// Each answer is a function of `p(name)`, which returns the live price of a service as "$90".
export const SERVICE_PAGES = {
  facials: {
    path: '/services/facials',
    keyword: 'facials in Buckeye, AZ',
    h1: 'Facials in Buckeye, AZ',
    intro: [
      'Heaven Sent Beauty offers facials in Buckeye, AZ, from a Customized Facial tailored to your skin to hydrating, acne, anti-aging, dermaplaning and specialty facials. Every facial uses professional, botanically-based Skin Script Rx products and is given by Jayslyn Tramp, a licensed esthetician, one client at a time.',
      'Not sure which to choose? A Customized Facial is a good place to start. It is tailored to your skin\'s unique needs, so you do not have to pick a category in advance.',
    ],
    expect: 'Every visit begins with a quiet conversation about your skin and your goals. Then comes a facial tailored to you, with no rushing and no stopwatch. You leave with a simple way to carry your results home, and an open door whenever you are ready to return. A Customized Facial is 60 minutes, a Men\'s Facial is 45 minutes, and an Express Facial is 35 minutes.',
    faqs: [
      { q: 'Which facial should I book first?', a: () => 'A Customized Facial is a good place to start. It is tailored to your skin\'s unique needs, so you do not have to choose a category in advance. Every visit begins with a conversation about your skin and your goals.' },
      { q: 'How long does a facial take?', a: () => 'A Customized Facial is 60 minutes, a Men\'s Facial is 45 minutes, and an Express Facial is 35 minutes. Jayslyn sees one client at a time, so there is no rushing.' },
      { q: 'How much does a facial cost?', a: (p) => `The Customized, Hydrating, Acne and Anti-Aging facials are ${p('Customized Facial')} each. The Dermaplaning Facial is ${p('Dermaplaning Facial')}, the Express Facial is ${p('Express Facial')}, the Men's Facial is ${p("Men's Facial")} and the Back Facial is ${p('Back Facial')}. Three Customized Facials, four weeks apart, are ${p('Facial Bundle')} as the Facial Bundle.` },
      { q: 'How should I prepare for a facial?', a: () => 'Arrive with minimal makeup if you can, and pause retinol or exfoliating acids the day before. Keep sun exposure light in the days beforehand, since sunburned skin is more sensitive. Come with an idea of what you would like to focus on.' },
      { q: 'Will dermaplaning make my hair grow back thicker?', a: () => 'No. Fine facial hair removed at the surface grows back the same way it was before. Dermaplaning does not change the hair or the follicle. It exfoliates dead skin cells and peach fuzz for smoother, brighter-looking skin.' },
      { q: 'Is dermaplaning right for me?', a: () => 'It suits many skin types, but tell Jayslyn beforehand if you have active breakouts, irritated or sunburned skin, or very sensitive skin. You will talk it through at your consultation, and she will tell you honestly whether it is a good fit today.' },
    ],
  },
  lashes: {
    path: '/services/lashes',
    keyword: 'lash extensions in Buckeye, AZ',
    h1: 'Lash Extensions in Buckeye, AZ',
    intro: [
      'Heaven Sent Beauty offers lash extensions in Buckeye, AZ, along with lash lifts and lash tints. Choose classic, hybrid or volume extensions with matching fills, or keep your own lashes with a natural lash lift. Every appointment is with Jayslyn Tramp, a licensed esthetician, one client at a time.',
      'Classic extensions give elegant, natural-looking fullness. Hybrid blends classic and volume lashes for a textured look. Volume gives dramatic, fluffy lashes with maximum volume.',
    ],
    expect: 'Every lash appointment starts with a quiet conversation about your natural lashes, your lifestyle and the look you want. Every set is shaped around your own lash pattern, at a pace that never feels rushed. Extensions need fills to stay full, and each style has its own fill.',
    faqs: [
      { q: 'Should I get a lash lift or lash extensions?', a: () => 'A lash lift works with the lashes you already have, adding a natural curl and lift. Extensions add new lashes to your own for more fullness, length and drama. Tell Jayslyn the look you want and how your mornings usually go, and she can help you choose.' },
      { q: 'What is the difference between classic and hybrid lash extensions?', a: () => 'Classic extensions apply one extension to each natural lash for a clean, natural enhancement. Hybrid extensions blend classic and volume techniques for extra texture and fullness. Neither is right or wrong, and the amount of texture can be tailored to you.' },
      { q: 'What is a lash fill?', a: () => 'Extensions grow out along with your natural lashes. A fill refreshes and maintains your set by filling in gaps and replacing extensions that have grown out. If too much time passes, or a large part of the set has grown out, a fresh full set may be recommended instead.' },
      { q: 'How do I care for my lash extensions?', a: () => 'Avoid oil-based cleansers and makeup removers near the lash line. Brush your lashes gently with a clean spoolie, avoid rubbing or pulling them, and keep up with your scheduled fills rather than waiting until the set is very sparse.' },
      { q: 'How much do lash services cost?', a: (p) => `A Lash Lift is ${p('Lash Lift')} and a Lash Tint is ${p('Lash Tint')}. Classic extensions are ${p('Classic Extensions')}, hybrid ${p('Hybrid Extensions')} and volume ${p('Volume Extensions')}. Fills are ${p('Classic Fill')} for classic, ${p('Hybrid Fill')} for hybrid and ${p('Volume Fill')} for volume.` },
      { q: 'What should I tell you before my first lash appointment?', a: () => 'Let Jayslyn know if you have sensitive eyes or any allergies before you start. Your first visit also covers your goals and your natural lash line, so you can decide together which style fits you best.' },
    ],
  },
  brows: {
    path: '/services/brows',
    keyword: 'brow lamination in Buckeye, AZ',
    h1: 'Brow Lamination in Buckeye, AZ',
    intro: [
      'Heaven Sent Beauty offers brow lamination in Buckeye, AZ, plus brow shaping and brow tinting, with a licensed esthetician, one client at a time. Lamination is a semi-permanent treatment that sets your brow hairs in a lifted, brushed-up direction for fuller, fluffier, perfectly groomed-looking brows.',
      'Shaping is precision grooming that frames your face, and a tint adds color and fullness for natural, longer-lasting brows. Lamination is often combined with either one.',
    ],
    expect: 'You start with a quiet conversation about the look you want, so your brows are shaped around your face rather than a template. Jayslyn Tramp, a licensed esthetician, sees one client at a time, so there is no rushing. You leave with a simple way to care for your results at home.',
    faqs: [
      { q: 'What is brow lamination?', a: () => 'Brow lamination is a semi-permanent treatment that sets your brow hairs in a lifted, brushed-up direction. The result is fuller, fluffier, perfectly groomed-looking brows with less styling each morning. It works with the brows you already have.' },
      { q: 'Who is brow lamination good for?', a: () => 'It can be a good fit if your brow hairs grow in different directions, if your brows look sparse or flat and you want more fullness, or if you want a polished look that is low effort each day.' },
      { q: 'How long does brow lamination last?', a: () => 'The shape holds for weeks, not forever. As your brows grow, the hairs slowly return to their natural direction. If you would like more depth between visits, a brow tint can be added at your next appointment.' },
      { q: 'How do I care for my brows after lamination?', a: () => 'Keep your brows dry for the first 24 hours, avoiding steam, sweat and swimming. Avoid touching, brushing or picking at the hairs while they settle, and skip makeup or brow products on the area for the first day.' },
      { q: 'What is the difference between brow shaping and brow tint?', a: (p) => `Brow shaping is precision grooming that gives your brows a clear, tidy outline. A brow tint adds color and fullness without changing the shape. Shaping is ${p('Brow Shaping')} and a tint is ${p('Brow Tint')}, and they work well together in one visit.` },
      { q: 'How much does brow lamination cost?', a: (p) => `Brow Lamination is ${p('Brow Lamination')}. The Full Face Rehab package, ${p('Full Face Rehab')}, pairs a Dermaplaning Facial, Brow Lamination and a brow wax. Tell Jayslyn beforehand if you have sensitive skin, allergies or a recent skin treatment near your brows.` },
    ],
  },
  waxing: {
    path: '/services/waxing',
    keyword: 'waxing in Buckeye, AZ',
    h1: 'Waxing in Buckeye, AZ',
    intro: [
      'Heaven Sent Beauty offers gentle waxing in Buckeye, AZ: lip, underarm, full arm, bikini and Brazilian waxing. Each service removes unwanted hair while leaving your skin soft and smooth. Your appointment is with a licensed esthetician, one client at a time, so it is never rushed and never shared with anyone else in the room.',
    ],
    expect: 'Before we begin, we talk through what you want and answer any questions, especially if this is your first time. The wax is applied and removed in small, careful sections, and we pace the session to keep you comfortable throughout. Afterward we walk you through simple aftercare so your skin stays smooth and calm.',
    faqs: [
      { q: 'What is the difference between a bikini wax and a Brazilian wax?', a: () => 'A bikini wax removes hair along the edges of your bikini line, the areas that would show outside a swimsuit. A Brazilian is more thorough, removing hair from the front, back and everything in between, and it typically takes a bit more time.' },
      { q: 'How long should my hair be before waxing?', a: () => 'Hair should have a little length to it, generally about a quarter inch, so the wax can grip properly. Gently exfoliating a day or two beforehand can help the process go smoothly.' },
      { q: 'How should I prepare for a waxing appointment?', a: () => 'Let your hair grow to about a quarter inch and gently exfoliate a day or two beforehand. Avoid sun exposure or heavy activity right before your appointment. If you are unsure which service to book, mention your goals when you book.' },
      { q: 'What will my skin feel like afterward?', a: () => 'Skin may feel a little sensitive for a short while, which is normal. We walk you through simple aftercare so your skin stays smooth and calm.' },
      { q: 'How much does waxing cost?', a: (p) => `A Lip Wax is ${p('Lip Wax')}, an Underarm Wax is ${p('Underarm Wax')} and a Full Arm Wax is ${p('Full Arm Wax')}. A Bikini Wax is ${p('Bikini Wax')} and a Brazilian Wax is ${p('Brazilian Wax')}.` },
    ],
  },
};

/** Everything a service page needs, with prices and answers resolved from the live Services data. */
export function servicePageModel(slug) {
  const def = SERVICE_PAGES[slug];
  if (!def) return null;
  const cats = parseServices();
  const all = cats.flatMap((c) => c.items);
  const byName = (n) => all.find((i) => i.name === n);
  const p = (n) => {
    const item = byName(n);
    if (!item || !item.price) throw new Error(`service-pages: "${n}" has no price on the Services page`);
    return `$${item.price}`;
  };
  const fromCategory = CATEGORY[slug] ? cats.find((c) => c.category === CATEGORY[slug]).items : [];
  const named = NAMES[slug].map((n) => {
    const item = byName(n);
    if (!item) throw new Error(`service-pages: "${n}" not found on the Services page`);
    return item;
  });
  const items = [...fromCategory, ...named];
  return {
    slug,
    path: def.path,
    keyword: def.keyword,
    h1: def.h1,
    intro: def.intro,
    expect: def.expect,
    items,
    faqs: def.faqs.map((f) => ({ q: f.q, a: f.a(p) })),
  };
}
