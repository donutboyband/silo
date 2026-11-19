export const label = {
  contact: 'casey@silorecording.com',
  year: '2026',
};

/**
 * The About panel (opens from the SILO title). PLACEHOLDER copy: swap in the
 * real manifesto and team. House style: no em dashes in site copy.
 */
export const about = {
  summary: [
    'Silo is four things that share one roof. A recording studio, label and residency. A traveling music collective. Tools for the people who make records. And a label for small, fun music software.',
    'No silo is the home base. Each one stands on its own, and together they make Silo.',
  ],
  team: [
    { name: 'Casey Bruce', role: 'Role TBD', bio: 'A line or two about Casey goes here.' },
    { name: 'Name TBD', role: 'Role TBD', bio: 'A line or two about the second founder goes here.' },
  ],
};

/** The scrolling strip under the Silo title. Change the text to post news. */
export const banner = {
  text: 'DeCamp Issue 0.1 · Kalamazoo, MI · 2026 · Read the one-sheet',
  url: '/decamp',
};

export interface Account {
  name: string;
  /** Colour key: a pillar key, or 'all' for Silo itself (white). */
  key: string;
  handle?: string;
  /** Leave out until the account exists; it shows as "soon", unlinked. */
  url?: string;
}

/** Social accounts in the top-right dropdowns. Placeholders for now. */
export const social: { instagram: Account[]; twitter: Account[] } = {
  instagram: [
    { name: 'Silo', key: 'all' },
    { name: 'DeCamp', key: 'decamp' },
    { name: 'Willow', key: 'creators' },
  ],
  twitter: [
    { name: 'Silo', key: 'all' },
    { name: 'DeCamp', key: 'decamp' },
    { name: 'Willow', key: 'creators' },
  ],
};

export interface Item {
  no: string;
  name: string;
  desc: string;
  url?: string;
  /** Not out yet: rendered dim, not linked. */
  soon?: boolean;
  /** For places (DeCamp issues): puts a dot on the map. [latitude, longitude] */
  at?: [number, number];
  /** Which side of its dot the map label sits on (default right). */
  labelSide?: 'left' | 'right' | 'above' | 'below';
}

export interface Pillar {
  name: string;
  /** Matches a [data-pillar] colour rule in index.astro. */
  key: string;
  /** General description, shown at the top when the silo opens. */
  desc: string;
  /** Which accounts in `social` this silo's Instagram / X icons point to. */
  socialName: string;
  /** Optional page for the pillar itself, linked from inside the open silo. */
  url?: string;
  urlLabel?: string;
  items: Item[];
}

export const pillars: Pillar[] = [
  {
    name: 'Silo Recording',
    key: 'recording',
    socialName: 'Silo',
    desc: 'A recording studio, a record label, and an artist residency.',
    items: [
      {
        no: '1',
        name: 'The Studio',
        desc: 'A recording studio. Write to book time.',
        url: `mailto:${label.contact}?subject=Studio`,
      },
      {
        no: '2',
        name: 'The Label',
        desc: 'Records released by Silo.',
        url: `mailto:${label.contact}?subject=Label`,
      },
      {
        no: '3',
        name: 'Artist Residency',
        desc: 'Artists come to stay and make a record.',
        url: `mailto:${label.contact}?subject=Residency`,
      },
    ],
  },
  {
    name: 'DeCamp',
    key: 'decamp',
    socialName: 'DeCamp',
    desc: 'A traveling music collective. A new location every issue, two issues a year: a four-song EP on vinyl and a print zine about the place.',
    url: '/decamp',
    urlLabel: 'Read the one-sheet',
    items: [
      {
        no: '0.1',
        name: 'Kalamazoo, MI',
        at: [42.2917, -85.5872],
        labelSide: 'left',
        desc: 'Issue 0.1, 2026. DeCamp is a traveling music collective: twice a year we rent a house somewhere with a sound, set up a mobile studio, and write and record a four-song EP in a week. Each issue is a limited vinyl pressing plus a print zine about the city, its studios, venues and the people making music there.',
        url: 'https://decamp.co',
      },
      {
        no: '01',
        name: 'Asheville, NC',
        at: [35.5951, -82.5515],
        labelSide: 'left',
        desc: 'Issue 01, 2027. The next DeCamp residency: a week in Asheville, a four-song EP recorded on location, and a zine on the city’s music.',
        soon: true,
      },
      {
        no: '02',
        name: 'Catskill, NY',
        at: [42.2173, -73.8646],
        labelSide: 'above',
        desc: 'Issue 02, 2028. A week in the Catskills, a four-song EP recorded on location, and a zine on the place and its music.',
        soon: true,
      },
    ],
  },
  {
    name: 'Tools for Creators',
    key: 'creators',
    socialName: 'Willow',
    desc: 'Software for independent artists and the people they make records with.',
    items: [
      {
        no: '1',
        name: 'Willow',
        desc: 'A marketplace where independent artists pay for producers, engineers, session players, mastering, cover art and promo with points in the song instead of cash. Points sit in escrow until the work is approved, then Willow distributes the song and pays every collaborator their share of the royalties automatically.',
        url: 'https://willow.fm',
      },
      {
        no: '2',
        name: 'Song Seed',
        desc: 'One unreleased song every Monday, then the story of how it was made, a day at a time: the interview, the room, the credits, the session photos and every version from voice memo to master. You live with it for five days before anyone else hears it.',
        url: 'https://drop.willow.fm',
      },
    ],
  },
  {
    name: 'Software Label',
    key: 'label',
    socialName: 'Silo',
    desc: 'Small pieces of music software, released like records.',
    items: [
      {
        no: '1',
        name: 'Sleeve',
        desc: 'The liner notes streaming forgot.',
        url: 'https://sleeve-smoky.vercel.app/',
      },
      {
        no: '2',
        name: 'Maison',
        desc: 'A filter house toy.',
        url: 'https://playmaison.app',
      },
    ],
  },
];
