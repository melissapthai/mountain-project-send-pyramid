const header =
  'Date,Route,Rating,Notes,URL,Pitches,Location,"Avg Stars","Your Stars",Style,"Lead Style","Route Type","Your Rating",Length,"Rating Code"\n';

export const happyPathData = `Date,Route,Rating,Notes,URL,Pitches,Location,"Avg Stars","Your Stars",Style,"Lead Style","Route Type","Your Rating",Length,"Rating Code"
2023-04-20,Some Sport Climb,5.11a,,,,,,,Lead,Onsight,Sport,,,
2023-04-20,Some Trad Climb,5.9,,,,,,,Lead,Redpoint,Trad,,,
2023-04-20,Some Boulder,V5,,,,,,,Send,,Boulder,,,`;

export const nonSendData = `Date,Route,Rating,Notes,URL,Pitches,Location,"Avg Stars","Your Stars",Style,"Lead Style","Route Type","Your Rating",Length,"Rating Code"
2022-11-22,Atman,5.10a,,,,,,,Lead,Redpoint,Trad,,,
2022-11-20,"Yaak Crack",5.11c,,,,,,,Lead,Fell/Hung,Sport,,,
2022-05-07,"Toadstool Sandwich",V4,,,,,,,,,Boulder,,,`;

export const multipleRouteTypesData = header.concat(
  `2019-08-24,"Zee Tree",5.7,,,,,,,Lead,Onsight,"Trad, Sport",,,`
);
