export const label = {
  contact: 'casey@silorecording.com',
  year: '2026',
};

export interface Item {
  no: string;
  name: string;
  desc: string;
  url?: string;
  /** Not out yet: rendered dim, not linked. */
  soon?: boolean;
}

export interface Pillar {
  name: string;
  /** Matches a [data-pillar] colour rule in index.astro. */
  key: string;
  items: Item[];
}

export const pillars: Pillar[] = [
  {
    name: 'Silo Recording',
    key: 'recording',
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
    items: [
      {
        no: '0.1',
        name: 'Kalamazoo, MI',
        desc: 'Issue 0.1, 2026. DeCamp is a traveling music collective: twice a year we rent a house somewhere with a sound, set up a mobile studio, and write and record a four-song EP in a week. Each issue is a limited vinyl pressing plus a print zine about the city, its studios, venues and the people making music there.',
        url: 'https://decamp.co',
      },
      {
        no: '01',
        name: 'Asheville, NC',
        desc: 'Issue 01, 2027. The next DeCamp residency: a week in Asheville, a four-song EP recorded on location, and a zine on the city’s music.',
        soon: true,
      },
      {
        no: '02',
        name: 'Catskill, NY',
        desc: 'Issue 02, 2028. A week in the Catskills, a four-song EP recorded on location, and a zine on the place and its music.',
        soon: true,
      },
    ],
  },
  {
    name: 'Tools for Creators',
    key: 'creators',
    items: [
      {
        no: '1',
        name: 'Willow',
        desc: 'A marketplace where independent artists pay for producers, engineers, session players, mastering, cover art and promo with points in the song instead of cash. Points sit in escrow until the work is approved, then Willow distributes the song and pays every collaborator their share of the royalties automatically.',
        url: 'https://willow.fm',
      },
      {
        no: '2',
        name: 'Willow Drop',
        desc: 'One unreleased song every Monday, then the story of how it was made, a day at a time: the interview, the room, the credits, the session photos and every version from voice memo to master. You live with it for five days before anyone else hears it.',
        url: 'https://drop.willow.fm',
      },
    ],
  },
  {
    name: 'Software Label',
    key: 'label',
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
