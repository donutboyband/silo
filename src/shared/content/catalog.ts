export const label = {
  /** The main name: the big title, page titles, About. */
  name: 'Myco',
  contact: 'casey@silorecording.com',
  year: '2026',
};

/**
 * The About panel (opens from the SILO title). PLACEHOLDER copy: swap in the
 * real manifesto and team. House style: no em dashes in site copy.
 */
export const about = {
  summary: [
    'Myco is four things that share one roof. A recording studio, label and residency. A traveling music collective. Tools for the people who make records. And a label for small, fun music software.',
    'No silo is the home base. Each one stands on its own, and together they make Myco.',
  ],
  team: [
    { name: 'Casey Bruce', role: 'Role TBD', bio: 'A line or two about Casey goes here.' },
    { name: 'Name TBD', role: 'Role TBD', bio: 'A line or two about the second founder goes here.' },
  ],
};

/** The scrolling strip under the Silo title. Change the text to post news. */
export const banner = {
  text: 'DeCamp Issue 0.1 · Kalamazoo, MI · 2026 · Read the one-sheet',
  url: '/decamp/one-sheet/',
};

/** The four silos. Each key has a [data-pillar] colour in src/styles/silo.css
 * and a mark at public/silo/marks/<key>.svg. */
export type PillarKey = 'recording' | 'decamp' | 'creators' | 'label';

/** The names the social accounts go by. */
export type AccountName = 'Silo' | 'DeCamp' | 'Willow';

export interface Account {
  name: AccountName;
  /** Colour key: a pillar key, or 'all' for Silo itself (white). */
  key: PillarKey | 'all';
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
  /** For DeCamp issues: the year it happens, e.g. '2026'. */
  year?: string;
  /** For places (DeCamp issues): puts a dot on the map. [latitude, longitude] */
  at?: [number, number];
  /** For Sandbox's projects: the toy it's drawn as in the sandbox. */
  toy?: 'house' | 'record';
  /** Which side of its dot the map label sits on (default right). */
  labelSide?: 'left' | 'right' | 'above' | 'below';
}

export interface Pillar {
  name: string;
  key: PillarKey;
  /** General description, shown at the top when the silo opens. */
  desc: string;
  /** Which accounts in `social` this silo's Instagram / X icons point to. */
  socialName: AccountName;
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
    items: [
      {
        no: '0.1',
        year: '2026',
        name: 'Kalamazoo, MI',
        at: [42.2917, -85.5872],
        labelSide: 'right',
        desc: 'Issue 0.1, 2026. DeCamp is a traveling music collective: twice a year we rent a house somewhere with a sound, set up a mobile studio, and write and record a four-song EP in a week. Each issue is a limited vinyl pressing plus a print zine about the city, its studios, venues and the people making music there.',
        url: 'https://decamp.co',
      },
    ],
  },
  {
    name: 'Platforms',
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
    name: 'Sandbox',
    key: 'label',
    socialName: 'Silo',
    desc: 'Music toys for fun and experimentation.',
    items: [
      {
        no: '1',
        name: 'Linernotes',
        toy: 'record',
        desc: 'The liner notes streaming forgot.',
        url: 'https://sleeve-smoky.vercel.app/',
      },
      {
        no: '2',
        name: 'Maison',
        toy: 'house',
        desc: 'A filter house toy.',
        url: 'https://playmaison.app',
      },
    ],
  },
];

/** The DeCamp one-sheet (/decamp/one-sheet/): what inspired it, and its own Substack. */
export const decamp = {
  references: [
    { name: 'Unknown Mortal Orchestra: IC Series' },
    { name: 'Record Magazine', url: 'https://record-magazine.com/' },
    { name: 'WM Brown', url: 'https://wmbrownproject.com/magazine' },
    { name: 'Daybreak', url: 'https://www.daybreakpub.com/' },
    { name: 'Born Rival', url: 'https://bornrival.com/products/born-rival-magazine-volume-01' },
    { name: 'Electronic Sound', url: 'https://www.electronicsound.co.uk/' },
    { name: 'Heartbeat (Broccoli)', url: 'https://broccolimag.com/products/heartbeat-magazine-music-sound-emotion' },
  ] as { name: string; url?: string }[],
  /** Leave out until it exists; it shows unlinked. */
  substack: undefined as string | undefined,
};
