export interface Prayer {
  id: string;
  title: string;
  text: string;
}

export const OPENING_PRAYERS: Prayer[] = [
  {
    id: 'come-holy-spirit',
    title: 'Come, Holy Spirit',
    text: `Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.

Send forth your Spirit and they shall be created,
and you shall renew the face of the earth.

O God, who has taught the hearts of the faithful by the light of the Holy Spirit, grant that by the gift of the same Spirit we may be always truly wise and ever rejoice in his consolation. Through Christ our Lord. Amen.`,
  },
  {
    id: 'lectio-invocation',
    title: 'Lectio Divina Invocation',
    text: `Lord, open my eyes that I may see the wonders of your Word.
Open my ears that I may hear your voice speaking to me now.
Open my heart that I may receive what you desire to give me.

Speak, Lord, for your servant is listening.
— 1 Samuel 3:9`,
  },
  {
    id: 'veni-creator',
    title: 'Veni, Creator Spiritus',
    text: `Come, Creator Spirit, visit the souls of your people;
fill with heavenly grace the hearts which you have made.

You are called the Comforter, the gift of God Most High,
the living spring, the fire of love, the soul's anointing from above.

Grant that through you we may know the Father and the Son,
and that you, the Spirit of them both, may be our faith for evermore. Amen.`,
  },
  {
    id: 'augustine',
    title: 'Prayer of St. Augustine',
    text: `You have made us for yourself, O Lord,
and our heart is restless until it finds its rest in you.

Grant me, O Lord, to know and understand
which is first: to call on you or to praise you?
And, again, to know you or to call on you?

For who can call on you not knowing you?
Let me seek you, Lord, in calling on you,
and call on you in believing in you. Amen.`,
  },
];

export const CLOSING_AFFIRMATIONS = [
  'Amen. Go in peace, and may the Word of God dwell in you richly.',
  'Amen. Go in peace to love and serve the Lord.',
  'Amen. May the peace of Christ guard your heart and mind today.',
  'Amen. Go forth; the Word has been sown in good soil.',
];
