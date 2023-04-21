const header =
  'Date,Route,Rating,Notes,URL,Pitches,Location,"Avg Stars","Your Stars",Style,"Lead Style","Route Type","Your Rating",Length,"Rating Code"\n';

export const happyPathData =
  header.concat(`2023-04-20,Some Sport Climb,5.11a,,,,,,,Lead,Onsight,Sport,,,
2023-04-20,Some Trad Climb,5.9,,,,,,,Lead,Redpoint,Trad,,,
2023-04-20,Some Boulder,V5,,,,,,,Send,,Boulder,,,`);

export const nonSendData =
  header.concat(`2022-11-22,Atman,5.10a,,,,,,,Lead,Redpoint,Trad,,,
2022-11-20,"Yaak Crack",5.11c,,,,,,,Lead,Fell/Hung,Sport,,,
2022-05-07,"Toadstool Sandwich",V4,,,,,,,,,Boulder,,,`);

export const sportTradData = header.concat(
  `2019-08-24,"Zee Tree",5.7,,,,,,,Lead,Onsight,"Trad, Sport",,,`
);

export const sportTrData = header.concat(
  `2022-09-16,"Wide is Love",5.10b,,,,,,,Lead,Onsight,"Sport, TR",,,`
);

export const duplicateData =
  header.concat(`2022-04-09,"Lunatic Fringe",5.10c,,,,,,,Lead,,Trad,,,
2021-07-24,"Bombs over Tokyo",5.10c,,,,,,,Lead,Onsight,Trad,,,
2022-04-10,"Lunatic Fringe",5.10c,,,,,,,Lead,Redpoint,Trad,,,
2022-04-02,"Lunatic Fringe",5.10c,,,,,,,TR,,Trad,,,
2021-07-24,"Bombs over Tokyo",5.10c,,,,,,,Lead,Redpoint,Trad,,,
2019-09-01,"Shangri La",5.11a,,,,,,,Lead,Redpoint,Sport,,,
2019-09-01,"Shangri La",5.11a,,,,,,,Lead,Redpoint,Sport,,,`);

export const plumbersCrackData = header.concat(
  `2023-04-21,"Plumbers Crack (North side chimney)","5.8 V0 R",,,,,,,Flash,,Boulder,,,`
);
