// Catholic Sunday Lectionary (Roman Rite)
// Format per reading:
//   [display_ref, book_api_name, chapter, verse_start, verse_end]                (single chapter)
//   [display_ref, book_api_name, chapter, verse_start, verse_end, end_chapter]   (cross-chapter, e.g. Acts 12:24–13:5)
type R =
  | readonly [string, string, number, number, number]
  | readonly [string, string, number, number, number, number];

interface Entry {
  first: R;
  psalm: R;
  second?: R;
  gospel: R;
}

type Table = Record<string, Entry>;

// ─── YEAR A ──────────────────────────────────────────────────────────────────
export const YEAR_A: Table = {
  'advent-1':      { first: ['Isa 2:1-5','isaiah',2,1,5],       psalm: ['Ps 122:1-9','psalms',122,1,9],       second: ['Rom 13:11-14','romans',13,11,14],     gospel: ['Matt 24:37-44','matthew',24,37,44] },
  'advent-2':      { first: ['Isa 11:1-10','isaiah',11,1,10],    psalm: ['Ps 72:1-2,7-8,12-13','psalms',72,1,13],second: ['Rom 15:4-9','romans',15,4,9],        gospel: ['Matt 3:1-12','matthew',3,1,12] },
  'advent-3':      { first: ['Isa 35:1-6a,10','isaiah',35,1,10], psalm: ['Ps 146:6-10','psalms',146,6,10],      second: ['Jas 5:7-10','james',5,7,10],         gospel: ['Matt 11:2-11','matthew',11,2,11] },
  'advent-4':      { first: ['Isa 7:10-14','isaiah',7,10,14],    psalm: ['Ps 24:1-6','psalms',24,1,6],          second: ['Rom 1:1-7','romans',1,1,7],          gospel: ['Matt 1:18-24','matthew',1,18,24] },
  'holy-family':   { first: ['Sir 3:2-6,12-14','sirach',3,2,14], psalm: ['Ps 128:1-5','psalms',128,1,5],        second: ['Col 3:12-21','colossians',3,12,21],  gospel: ['Matt 2:13-15,19-23','matthew',2,13,23] },
  'mary-mother':   { first: ['Num 6:22-27','numbers',6,22,27],   psalm: ['Ps 67:2-3,5-6','psalms',67,2,6],     second: ['Gal 4:4-7','galatians',4,4,7],       gospel: ['Luke 2:16-21','luke',2,16,21] },
  'epiphany':      { first: ['Isa 60:1-6','isaiah',60,1,6],      psalm: ['Ps 72:1-2,7-8,10-13','psalms',72,1,13],second: ['Eph 3:2-3a,5-6','ephesians',3,2,6], gospel: ['Matt 2:1-12','matthew',2,1,12] },
  'baptism-lord':  { first: ['Isa 42:1-4,6-7','isaiah',42,1,7], psalm: ['Ps 29:1-4,9-10','psalms',29,1,10],   second: ['Acts 10:34-38','acts',10,34,38],      gospel: ['Matt 3:13-17','matthew',3,13,17] },
  'ot-2':          { first: ['Isa 49:3,5-6','isaiah',49,3,6],    psalm: ['Ps 40:2,4,7-10','psalms',40,2,10],   second: ['1 Cor 1:1-3','1+corinthians',1,1,3],  gospel: ['John 1:29-34','john',1,29,34] },
  'ot-3':          { first: ['Isa 8:23b-9:3','isaiah',8,23,9],   psalm: ['Ps 27:1,4,13-14','psalms',27,1,14],  second: ['1 Cor 1:10-13,17','1+corinthians',1,10,17], gospel: ['Matt 4:12-23','matthew',4,12,23] },
  'ot-4':          { first: ['Zeph 2:3;3:12-13','zephaniah',2,3,13],psalm: ['Ps 146:6-10','psalms',146,6,10],  second: ['1 Cor 1:26-31','1+corinthians',1,26,31], gospel: ['Matt 5:1-12a','matthew',5,1,12] },
  'ot-5':          { first: ['Isa 58:7-10','isaiah',58,7,10],    psalm: ['Ps 112:4-9','psalms',112,4,9],        second: ['1 Cor 2:1-5','1+corinthians',2,1,5], gospel: ['Matt 5:13-16','matthew',5,13,16] },
  'ot-6':          { first: ['Sir 15:15-20','sirach',15,15,20],  psalm: ['Ps 119:1-2,4-5,17-18','psalms',119,1,18],second: ['1 Cor 2:6-10','1+corinthians',2,6,10], gospel: ['Matt 5:17-37','matthew',5,17,37] },
  'ot-7':          { first: ['Lev 19:1-2,17-18','leviticus',19,1,18],psalm: ['Ps 103:1-4,8,10,12-13','psalms',103,1,13],second: ['1 Cor 3:16-23','1+corinthians',3,16,23], gospel: ['Matt 5:38-48','matthew',5,38,48] },
  'ot-8':          { first: ['Isa 49:14-15','isaiah',49,14,15],  psalm: ['Ps 62:2-3,6-9','psalms',62,2,9],     second: ['1 Cor 4:1-5','1+corinthians',4,1,5], gospel: ['Matt 6:24-34','matthew',6,24,34] },
  'ot-9':          { first: ['Deut 11:18,26-28','deuteronomy',11,18,28],psalm: ['Ps 31:2-4,17,25','psalms',31,2,25],second: ['Rom 3:21-25,28','romans',3,21,28], gospel: ['Matt 7:21-27','matthew',7,21,27] },
  'lent-1':        { first: ['Gen 2:7-9;3:1-7','genesis',2,7,7], psalm: ['Ps 51:3-6,12-14,17','psalms',51,3,17],second: ['Rom 5:12-19','romans',5,12,19],      gospel: ['Matt 4:1-11','matthew',4,1,11] },
  'lent-2':        { first: ['Gen 12:1-4a','genesis',12,1,4],    psalm: ['Ps 33:4-5,18-20,22','psalms',33,4,22],second: ['2 Tim 1:8b-10','2+timothy',1,8,10],  gospel: ['Matt 17:1-9','matthew',17,1,9] },
  'lent-3':        { first: ['Exod 17:3-7','exodus',17,3,7],     psalm: ['Ps 95:1-2,6-9','psalms',95,1,9],     second: ['Rom 5:1-2,5-8','romans',5,1,8],      gospel: ['John 4:5-42','john',4,5,42] },
  'lent-4':        { first: ['1 Sam 16:1b,6-7,10-13a','1+samuel',16,1,13],psalm: ['Ps 23:1-6','psalms',23,1,6],second: ['Eph 5:8-14','ephesians',5,8,14],     gospel: ['John 9:1-41','john',9,1,41] },
  'lent-5':        { first: ['Ezek 37:12-14','ezekiel',37,12,14],psalm: ['Ps 130:1-8','psalms',130,1,8],       second: ['Rom 8:8-11','romans',8,8,11],         gospel: ['John 11:1-45','john',11,1,45] },
  'palm-sunday':   { first: ['Isa 50:4-7','isaiah',50,4,7],      psalm: ['Ps 22:8-9,17-20,23-24','psalms',22,8,24],second: ['Phil 2:6-11','philippians',2,6,11], gospel: ['Matt 26:14-27:66','matthew',26,14,66,27] },
  'easter-1':      { first: ['Acts 10:34a,37-43','acts',10,34,43],psalm: ['Ps 118:1-2,16-17,22-23','psalms',118,1,23],second: ['Col 3:1-4','colossians',3,1,4], gospel: ['John 20:1-9','john',20,1,9] },
  'easter-2':      { first: ['Acts 2:42-47','acts',2,42,47],     psalm: ['Ps 118:2-4,13-15,22-24','psalms',118,2,24],second: ['1 Pet 1:3-9','1+peter',1,3,9], gospel: ['John 20:19-31','john',20,19,31] },
  'easter-3':      { first: ['Acts 2:14,22-33','acts',2,14,33],  psalm: ['Ps 16:1-2,5,7-11','psalms',16,1,11], second: ['1 Pet 1:17-21','1+peter',1,17,21],  gospel: ['Luke 24:13-35','luke',24,13,35] },
  'easter-4':      { first: ['Acts 2:14a,36-41','acts',2,14,41], psalm: ['Ps 118:1,8-9,21-23,26,28-29','psalms',118,1,29],second: ['1 Pet 2:20b-25','1+peter',2,20,25], gospel: ['John 10:1-10','john',10,1,10] },
  'easter-5':      { first: ['Acts 6:1-7','acts',6,1,7],         psalm: ['Ps 33:1-2,4-5,18-19','psalms',33,1,19],second: ['1 Pet 2:4-9','1+peter',2,4,9],    gospel: ['John 14:1-12','john',14,1,12] },
  'easter-6':      { first: ['Acts 8:5-8,14-17','acts',8,5,17],  psalm: ['Ps 66:1-7,16,20','psalms',66,1,20],  second: ['1 Pet 3:15-18','1+peter',3,15,18],  gospel: ['John 14:15-21','john',14,15,21] },
  'easter-7':      { first: ['Acts 1:12-14','acts',1,12,14],     psalm: ['Ps 27:1,4,7-8','psalms',27,1,8],     second: ['1 Pet 4:13-16','1+peter',4,13,16],  gospel: ['John 17:1-11a','john',17,1,11] },
  'pentecost':     { first: ['Acts 2:1-11','acts',2,1,11],        psalm: ['Ps 104:1,24,29-31,34','psalms',104,1,34],second: ['1 Cor 12:3b-7,12-13','1+corinthians',12,3,13], gospel: ['John 20:19-23','john',20,19,23] },
  'trinity':       { first: ['Exod 34:4b-6,8-9','exodus',34,4,9],psalm: ['Dan 3:52-55','daniel',3,52,55],      second: ['2 Cor 13:11-13','2+corinthians',13,11,13], gospel: ['John 3:16-18','john',3,16,18] },
  'corpus-christi':{ first: ['Deut 8:2-3,14b-16a','deuteronomy',8,2,16],psalm: ['Ps 147:12-15,19-20','psalms',147,12,20],second: ['1 Cor 10:16-17','1+corinthians',10,16,17], gospel: ['John 6:51-58','john',6,51,58] },
  'ot-10':         { first: ['Hos 6:3-6','hosea',6,3,6],          psalm: ['Ps 50:1,8,12-15','psalms',50,1,15],  second: ['Rom 4:18-25','romans',4,18,25],      gospel: ['Matt 9:9-13','matthew',9,9,13] },
  'ot-11':         { first: ['Exod 19:2-6a','exodus',19,2,6],    psalm: ['Ps 100:1-3,5','psalms',100,1,5],     second: ['Rom 5:6-11','romans',5,6,11],         gospel: ['Matt 9:36-10:8','matthew',9,36,8,10] },
  'ot-12':         { first: ['Jer 20:10-13','jeremiah',20,10,13], psalm: ['Ps 69:8-10,14,17,33-35','psalms',69,8,35],second: ['Rom 5:12-15','romans',5,12,15],  gospel: ['Matt 10:26-33','matthew',10,26,33] },
  'ot-13':         { first: ['2 Kings 4:8-11,14-16a','2+kings',4,8,16],psalm: ['Ps 89:2-3,16-19','psalms',89,2,19],second: ['Rom 6:3-4,8-11','romans',6,3,11], gospel: ['Matt 10:37-42','matthew',10,37,42] },
  'ot-14':         { first: ['Zech 9:9-10','zechariah',9,9,10],  psalm: ['Ps 145:1-2,8-11,13-14','psalms',145,1,14],second: ['Rom 8:9,11-13','romans',8,9,13], gospel: ['Matt 11:25-30','matthew',11,25,30] },
  'ot-15':         { first: ['Isa 55:10-11','isaiah',55,10,11],   psalm: ['Ps 65:10-14','psalms',65,10,14],     second: ['Rom 8:18-23','romans',8,18,23],      gospel: ['Matt 13:1-23','matthew',13,1,23] },
  'ot-16':         { first: ['Wis 12:13,16-19','wisdom+of+solomon',12,13,19],psalm: ['Ps 86:5-6,9-10,15-16','psalms',86,5,16],second: ['Rom 8:26-27','romans',8,26,27], gospel: ['Matt 13:24-43','matthew',13,24,43] },
  'ot-17':         { first: ['1 Kings 3:5,7-12','1+kings',3,5,12],psalm: ['Ps 119:57,72,76-77,127-130','psalms',119,57,130],second: ['Rom 8:28-30','romans',8,28,30], gospel: ['Matt 13:44-52','matthew',13,44,52] },
  'ot-18':         { first: ['Isa 55:1-3','isaiah',55,1,3],       psalm: ['Ps 145:8-9,15-18','psalms',145,8,18], second: ['Rom 8:35,37-39','romans',8,35,39],  gospel: ['Matt 14:13-21','matthew',14,13,21] },
  'ot-19':         { first: ['1 Kings 19:9a,11-13a','1+kings',19,9,13],psalm: ['Ps 85:9-14','psalms',85,9,14],second: ['Rom 9:1-5','romans',9,1,5],          gospel: ['Matt 14:22-33','matthew',14,22,33] },
  'ot-20':         { first: ['Isa 56:1,6-7','isaiah',56,1,7],     psalm: ['Ps 67:2-3,5-6,8','psalms',67,2,8],   second: ['Rom 11:13-15,29-32','romans',11,13,32], gospel: ['Matt 15:21-28','matthew',15,21,28] },
  'ot-21':         { first: ['Isa 22:19-23','isaiah',22,19,23],   psalm: ['Ps 138:1-3,6,8','psalms',138,1,8],   second: ['Rom 11:33-36','romans',11,33,36],    gospel: ['Matt 16:13-20','matthew',16,13,20] },
  'ot-22':         { first: ['Jer 20:7-9','jeremiah',20,7,9],     psalm: ['Ps 63:2-6,8-9','psalms',63,2,9],     second: ['Rom 12:1-2','romans',12,1,2],        gospel: ['Matt 16:21-27','matthew',16,21,27] },
  'ot-23':         { first: ['Ezek 33:7-9','ezekiel',33,7,9],     psalm: ['Ps 95:1-2,6-9','psalms',95,1,9],     second: ['Rom 13:8-10','romans',13,8,10],      gospel: ['Matt 18:15-20','matthew',18,15,20] },
  'ot-24':         { first: ['Sir 27:30-28:7','sirach',27,30,7,28], psalm: ['Ps 103:1-4,9-12','psalms',103,1,12], second: ['Rom 14:7-9','romans',14,7,9],        gospel: ['Matt 18:21-35','matthew',18,21,35] },
  'ot-25':         { first: ['Isa 55:6-9','isaiah',55,6,9],       psalm: ['Ps 145:2-3,8-9,17-18','psalms',145,2,18],second: ['Phil 1:20c-24,27a','philippians',1,20,27], gospel: ['Matt 20:1-16a','matthew',20,1,16] },
  'ot-26':         { first: ['Ezek 18:25-28','ezekiel',18,25,28], psalm: ['Ps 25:4-9','psalms',25,4,9],          second: ['Phil 2:1-11','philippians',2,1,11],  gospel: ['Matt 21:28-32','matthew',21,28,32] },
  'ot-27':         { first: ['Isa 5:1-7','isaiah',5,1,7],          psalm: ['Ps 80:9,12-16,19-20','psalms',80,9,20],second: ['Phil 4:6-9','philippians',4,6,9],  gospel: ['Matt 21:33-43','matthew',21,33,43] },
  'ot-28':         { first: ['Isa 25:6-10a','isaiah',25,6,10],    psalm: ['Ps 23:1-6','psalms',23,1,6],          second: ['Phil 4:12-14,19-20','philippians',4,12,20], gospel: ['Matt 22:1-14','matthew',22,1,14] },
  'ot-29':         { first: ['Isa 45:1,4-6','isaiah',45,1,6],     psalm: ['Ps 96:1,3-5,7-10','psalms',96,1,10], second: ['1 Thess 1:1-5b','1+thessalonians',1,1,5], gospel: ['Matt 22:15-21','matthew',22,15,21] },
  'ot-30':         { first: ['Exod 22:20-26','exodus',22,20,26],  psalm: ['Ps 18:2-4,47,51','psalms',18,2,51],  second: ['1 Thess 1:5c-10','1+thessalonians',1,5,10], gospel: ['Matt 22:34-40','matthew',22,34,40] },
  'ot-31':         { first: ['Mal 1:14b-2:2b,8-10','malachi',1,14,2], psalm: ['Ps 131:1-3','psalms',131,1,3],  second: ['1 Thess 2:7b-9,13','1+thessalonians',2,7,13], gospel: ['Matt 23:1-12','matthew',23,1,12] },
  'ot-32':         { first: ['Wis 6:12-16','wisdom+of+solomon',6,12,16],psalm: ['Ps 63:2-8','psalms',63,2,8],  second: ['1 Thess 4:13-18','1+thessalonians',4,13,18], gospel: ['Matt 25:1-13','matthew',25,1,13] },
  'ot-33':         { first: ['Prov 31:10-13,19-20,30-31','proverbs',31,10,31],psalm: ['Ps 128:1-5','psalms',128,1,5],second: ['1 Thess 5:1-6','1+thessalonians',5,1,6], gospel: ['Matt 25:14-30','matthew',25,14,30] },
  'christ-king':   { first: ['Ezek 34:11-12,15-17','ezekiel',34,11,17],psalm: ['Ps 23:1-3a,5-6','psalms',23,1,6],second: ['1 Cor 15:20-26,28','1+corinthians',15,20,28], gospel: ['Matt 25:31-46','matthew',25,31,46] },
};

// ─── YEAR B ──────────────────────────────────────────────────────────────────
export const YEAR_B: Table = {
  'advent-1':     { first: ['Isa 63:16b-17,19b;64:2-7','isaiah',63,16,7], psalm: ['Ps 80:2-3,15-16,18-19','psalms',80,2,19], second: ['1 Cor 1:3-9','1+corinthians',1,3,9],    gospel: ['Mark 13:33-37','mark',13,33,37] },
  'advent-2':     { first: ['Isa 40:1-5,9-11','isaiah',40,1,11],           psalm: ['Ps 85:9-14','psalms',85,9,14],            second: ['2 Pet 3:8-14','2+peter',3,8,14],        gospel: ['Mark 1:1-8','mark',1,1,8] },
  'advent-3':     { first: ['Isa 61:1-2a,10-11','isaiah',61,1,11],         psalm: ['Luke 1:46-54','luke',1,46,54],            second: ['1 Thess 5:16-24','1+thessalonians',5,16,24], gospel: ['John 1:6-8,19-28','john',1,6,28] },
  'advent-4':     { first: ['2 Sam 7:1-5,8b-12,14a,16','2+samuel',7,1,16],psalm: ['Ps 89:2-5,27,29','psalms',89,2,29],       second: ['Rom 16:25-27','romans',16,25,27],        gospel: ['Luke 1:26-38','luke',1,26,38] },
  'holy-family':  { first: ['Sir 3:2-6,12-14','sirach',3,2,14],            psalm: ['Ps 128:1-5','psalms',128,1,5],            second: ['Col 3:12-21','colossians',3,12,21],      gospel: ['Luke 2:22-40','luke',2,22,40] },
  'mary-mother':  { first: ['Num 6:22-27','numbers',6,22,27],              psalm: ['Ps 67:2-3,5-6','psalms',67,2,6],          second: ['Gal 4:4-7','galatians',4,4,7],          gospel: ['Luke 2:16-21','luke',2,16,21] },
  'epiphany':     { first: ['Isa 60:1-6','isaiah',60,1,6],                  psalm: ['Ps 72:1-2,7-8,10-13','psalms',72,1,13],  second: ['Eph 3:2-3a,5-6','ephesians',3,2,6],     gospel: ['Matt 2:1-12','matthew',2,1,12] },
  'baptism-lord': { first: ['Isa 55:1-11','isaiah',55,1,11],               psalm: ['Isa 12:2-6','isaiah',12,2,6],             second: ['1 John 5:1-9','1+john',5,1,9],          gospel: ['Mark 1:7-11','mark',1,7,11] },
  'lent-1':       { first: ['Gen 9:8-15','genesis',9,8,15],                psalm: ['Ps 25:4-9','psalms',25,4,9],              second: ['1 Pet 3:18-22','1+peter',3,18,22],      gospel: ['Mark 1:12-15','mark',1,12,15] },
  'lent-2':       { first: ['Gen 22:1-2,9a,10-13,15-18','genesis',22,1,18],psalm: ['Ps 116:10,15-19','psalms',116,10,19],     second: ['Rom 8:31b-34','romans',8,31,34],         gospel: ['Mark 9:2-10','mark',9,2,10] },
  'lent-3':       { first: ['Exod 20:1-17','exodus',20,1,17],              psalm: ['Ps 19:8-11','psalms',19,8,11],            second: ['1 Cor 1:22-25','1+corinthians',1,22,25], gospel: ['John 2:13-25','john',2,13,25] },
  'lent-4':       { first: ['2 Chr 36:14-16,19-23','2+chronicles',36,14,23],psalm: ['Ps 137:1-6','psalms',137,1,6],          second: ['Eph 2:4-10','ephesians',2,4,10],        gospel: ['John 3:14-21','john',3,14,21] },
  'lent-5':       { first: ['Jer 31:31-34','jeremiah',31,31,34],           psalm: ['Ps 51:3-4,12-15','psalms',51,3,15],       second: ['Heb 5:7-9','hebrews',5,7,9],            gospel: ['John 12:20-33','john',12,20,33] },
  'palm-sunday':  { first: ['Isa 50:4-7','isaiah',50,4,7],                 psalm: ['Ps 22:8-9,17-20,23-24','psalms',22,8,24], second: ['Phil 2:6-11','philippians',2,6,11],     gospel: ['Mark 14:1-15:47','mark',14,1,47,15] },
  'easter-1':     { first: ['Acts 10:34a,37-43','acts',10,34,43],          psalm: ['Ps 118:1-2,16-17,22-23','psalms',118,1,23],second: ['Col 3:1-4','colossians',3,1,4],        gospel: ['John 20:1-9','john',20,1,9] },
  'easter-2':     { first: ['Acts 4:32-35','acts',4,32,35],                psalm: ['Ps 118:2-4,13-15,22-24','psalms',118,2,24],second: ['1 John 5:1-6','1+john',5,1,6],        gospel: ['John 20:19-31','john',20,19,31] },
  'easter-3':     { first: ['Acts 3:13-15,17-19','acts',3,13,19],          psalm: ['Ps 4:2,4,7-9','psalms',4,2,9],           second: ['1 John 2:1-5a','1+john',2,1,5],        gospel: ['Luke 24:35-48','luke',24,35,48] },
  'easter-4':     { first: ['Acts 4:8-12','acts',4,8,12],                  psalm: ['Ps 118:1,8-9,21-23,26,28-29','psalms',118,1,29],second: ['1 John 3:1-2','1+john',3,1,2],  gospel: ['John 10:11-18','john',10,11,18] },
  'easter-5':     { first: ['Acts 9:26-31','acts',9,26,31],                psalm: ['Ps 22:26-28,30-32','psalms',22,26,32],    second: ['1 John 3:18-24','1+john',3,18,24],     gospel: ['John 15:1-8','john',15,1,8] },
  'easter-6':     { first: ['Acts 10:25-26,34-35,44-48','acts',10,25,48],  psalm: ['Ps 98:1-4','psalms',98,1,4],              second: ['1 John 4:7-10','1+john',4,7,10],       gospel: ['John 15:9-17','john',15,9,17] },
  'easter-7':     { first: ['Acts 1:15-17,20a,20c-26','acts',1,15,26],    psalm: ['Ps 103:1-2,11-12,19-20','psalms',103,1,20],second: ['1 John 4:11-16','1+john',4,11,16],    gospel: ['John 17:11b-19','john',17,11,19] },
  'pentecost':    { first: ['Acts 2:1-11','acts',2,1,11],                   psalm: ['Ps 104:1,24,29-31,34','psalms',104,1,34],second: ['1 Cor 12:3b-7,12-13','1+corinthians',12,3,13], gospel: ['John 20:19-23','john',20,19,23] },
  'trinity':      { first: ['Deut 4:32-34,39-40','deuteronomy',4,32,40],   psalm: ['Ps 33:4-6,9,18-20,22','psalms',33,4,22], second: ['Rom 8:14-17','romans',8,14,17],         gospel: ['Matt 28:16-20','matthew',28,16,20] },
  'corpus-christi':{ first: ['Exod 24:3-8','exodus',24,3,8],               psalm: ['Ps 116:12-13,15-18','psalms',116,12,18],  second: ['Heb 9:11-15','hebrews',9,11,15],       gospel: ['Mark 14:12-16,22-26','mark',14,12,26] },
  'christ-king':  { first: ['Dan 7:13-14','daniel',7,13,14],               psalm: ['Ps 93:1-2,5','psalms',93,1,5],            second: ['Rev 1:5-8','revelation',1,5,8],         gospel: ['John 18:33b-37','john',18,33,37] },
};

// ─── YEAR C ──────────────────────────────────────────────────────────────────
export const YEAR_C: Table = {
  'advent-1':     { first: ['Jer 33:14-16','jeremiah',33,14,16],            psalm: ['Ps 25:4-5,8-10,14','psalms',25,4,14],    second: ['1 Thess 3:12-4:2','1+thessalonians',3,12,2,4], gospel: ['Luke 21:25-28,34-36','luke',21,25,36] },
  'advent-2':     { first: ['Bar 5:1-9','baruch',5,1,9],                    psalm: ['Ps 126:1-6','psalms',126,1,6],            second: ['Phil 1:4-6,8-11','philippians',1,4,11],  gospel: ['Luke 3:1-6','luke',3,1,6] },
  'advent-3':     { first: ['Zeph 3:14-18a','zephaniah',3,14,18],           psalm: ['Isa 12:2-6','isaiah',12,2,6],             second: ['Phil 4:4-7','philippians',4,4,7],        gospel: ['Luke 3:10-18','luke',3,10,18] },
  'advent-4':     { first: ['Mic 5:1-4a','micah',5,1,4],                    psalm: ['Ps 80:2-3,15-16,18-19','psalms',80,2,19], second: ['Heb 10:5-10','hebrews',10,5,10],         gospel: ['Luke 1:39-45','luke',1,39,45] },
  'holy-family':  { first: ['Sir 3:2-6,12-14','sirach',3,2,14],             psalm: ['Ps 128:1-5','psalms',128,1,5],            second: ['Col 3:12-21','colossians',3,12,21],      gospel: ['Luke 2:41-52','luke',2,41,52] },
  'mary-mother':  { first: ['Num 6:22-27','numbers',6,22,27],               psalm: ['Ps 67:2-3,5-6,8','psalms',67,2,8],       second: ['Gal 4:4-7','galatians',4,4,7],          gospel: ['Luke 2:16-21','luke',2,16,21] },
  'epiphany':     { first: ['Isa 60:1-6','isaiah',60,1,6],                   psalm: ['Ps 72:1-2,7-8,10-13','psalms',72,1,13],  second: ['Eph 3:2-3a,5-6','ephesians',3,2,6],     gospel: ['Matt 2:1-12','matthew',2,1,12] },
  'baptism-lord': { first: ['Isa 40:1-5,9-11','isaiah',40,1,11],            psalm: ['Ps 104:1b-4,24-25,27-30','psalms',104,1,30],second: ['Titus 2:11-14;3:4-7','titus',2,11,3], gospel: ['Luke 3:15-16,21-22','luke',3,15,22] },
  'lent-1':       { first: ['Deut 26:4-10','deuteronomy',26,4,10],          psalm: ['Ps 91:1-2,10-15','psalms',91,1,15],      second: ['Rom 10:8-13','romans',10,8,13],          gospel: ['Luke 4:1-13','luke',4,1,13] },
  'lent-2':       { first: ['Gen 15:5-12,17-18','genesis',15,5,18],         psalm: ['Ps 27:1,7-9,13-14','psalms',27,1,14],    second: ['Phil 3:17-4:1','philippians',3,17,1,4],   gospel: ['Luke 9:28b-36','luke',9,28,36] },
  'lent-3':       { first: ['Exod 3:1-8a,13-15','exodus',3,1,15],           psalm: ['Ps 103:1-4,6-8,11','psalms',103,1,11],   second: ['1 Cor 10:1-6,10-12','1+corinthians',10,1,12], gospel: ['Luke 13:1-9','luke',13,1,9] },
  'lent-4':       { first: ['Josh 5:9a,10-12','joshua',5,9,12],             psalm: ['Ps 34:2-7','psalms',34,2,7],              second: ['2 Cor 5:17-21','2+corinthians',5,17,21], gospel: ['Luke 15:1-3,11-32','luke',15,1,32] },
  'lent-5':       { first: ['Isa 43:16-21','isaiah',43,16,21],              psalm: ['Ps 126:1-6','psalms',126,1,6],            second: ['Phil 3:8-14','philippians',3,8,14],     gospel: ['John 8:1-11','john',8,1,11] },
  'palm-sunday':  { first: ['Isa 50:4-7','isaiah',50,4,7],                  psalm: ['Ps 22:8-9,17-20,23-24','psalms',22,8,24], second: ['Phil 2:6-11','philippians',2,6,11],     gospel: ['Luke 22:14-23:56','luke',22,14,56,23] },
  'easter-1':     { first: ['Acts 10:34a,37-43','acts',10,34,43],           psalm: ['Ps 118:1-2,16-17,22-23','psalms',118,1,23],second: ['Col 3:1-4','colossians',3,1,4],        gospel: ['John 20:1-9','john',20,1,9] },
  'easter-2':     { first: ['Acts 5:12-16','acts',5,12,16],                  psalm: ['Ps 118:2-4,13-15,22-24','psalms',118,2,24],second: ['Rev 1:9-11a,12-13,17-19','revelation',1,9,19], gospel: ['John 20:19-31','john',20,19,31] },
  'easter-3':     { first: ['Acts 5:27b-32,40b-41','acts',5,27,41],         psalm: ['Ps 30:2,4-6,11-13','psalms',30,2,13],    second: ['Rev 5:11-14','revelation',5,11,14],     gospel: ['John 21:1-19','john',21,1,19] },
  'easter-4':     { first: ['Acts 13:14,43-52','acts',13,14,52],            psalm: ['Ps 100:1-3,5','psalms',100,1,5],          second: ['Rev 7:9,14b-17','revelation',7,9,17],   gospel: ['John 10:27-30','john',10,27,30] },
  'easter-5':     { first: ['Acts 14:21-27','acts',14,21,27],               psalm: ['Ps 145:8-13','psalms',145,8,13],          second: ['Rev 21:1-5a','revelation',21,1,5],      gospel: ['John 13:31-33a,34-35','john',13,31,35] },
  'easter-6':     { first: ['Acts 15:1-2,22-29','acts',15,1,29],            psalm: ['Ps 67:2-3,5-6,8','psalms',67,2,8],       second: ['Rev 21:10-14,22-23','revelation',21,10,23], gospel: ['John 14:23-29','john',14,23,29] },
  'easter-7':     { first: ['Acts 7:55-60','acts',7,55,60],                  psalm: ['Ps 97:1-2,6-7,9','psalms',97,1,9],       second: ['Rev 22:12-14,16-17,20','revelation',22,12,20], gospel: ['John 17:20-26','john',17,20,26] },
  'pentecost':    { first: ['Acts 2:1-11','acts',2,1,11],                    psalm: ['Ps 104:1,24,29-31,34','psalms',104,1,34],second: ['Rom 8:8-17','romans',8,8,17],           gospel: ['John 20:19-23','john',20,19,23] },
  'trinity':      { first: ['Prov 8:22-31','proverbs',8,22,31],             psalm: ['Ps 8:4-9','psalms',8,4,9],               second: ['Rom 5:1-5','romans',5,1,5],              gospel: ['John 16:12-15','john',16,12,15] },
  'corpus-christi':{ first: ['Gen 14:18-20','genesis',14,18,20],            psalm: ['Ps 110:1-4','psalms',110,1,4],            second: ['1 Cor 11:23-26','1+corinthians',11,23,26], gospel: ['Luke 9:11b-17','luke',9,11,17] },
  'christ-king':  { first: ['2 Sam 5:1-3','2+samuel',5,1,3],               psalm: ['Ps 122:1-5','psalms',122,1,5],            second: ['Col 1:12-20','colossians',1,12,20],      gospel: ['Luke 23:35-43','luke',23,35,43] },
};

export const LECTIONARY: Record<LiturgicalCycle, Table> = {
  A: YEAR_A,
  B: YEAR_B,
  C: YEAR_C,
};

export type LiturgicalCycle = 'A' | 'B' | 'C';

// ─── WEEKDAY LECTIONARY ──────────────────────────────────────────────────────
// Most weekday seasons (Easter, Lent, Advent, Christmas Octave, Holy Week)
// are FIXED — the same readings every year. Ordinary Time weekdays vary by
// Year I (odd years) or Year II (even years), reflected in the key suffix.
//
// Weekday entries typically have only first reading + psalm + gospel
// (no second reading).

export const WEEKDAYS: Table = {
  // ─── Holy Week weekdays ────────────────────────────────────────────────
  'holyweek-mon': { first: ['Isa 42:1-7','isaiah',42,1,7], psalm: ['Ps 27:1-3,13-14','psalms',27,1,14], gospel: ['John 12:1-11','john',12,1,11] },
  'holyweek-tue': { first: ['Isa 49:1-6','isaiah',49,1,6], psalm: ['Ps 71:1-6,15,17','psalms',71,1,17], gospel: ['John 13:21-33,36-38','john',13,21,38] },
  'holyweek-wed': { first: ['Isa 50:4-9a','isaiah',50,4,9], psalm: ['Ps 69:8-10,21-22,31,33-34','psalms',69,8,34], gospel: ['Matt 26:14-25','matthew',26,14,25] },
  'holy-thu':     { first: ['Exod 12:1-8,11-14','exodus',12,1,14], psalm: ['Ps 116:12-13,15-18','psalms',116,12,18], gospel: ['John 13:1-15','john',13,1,15] },
  'good-fri':     { first: ['Isa 52:13-53:12','isaiah',52,13,12,53], psalm: ['Ps 31:2,6,12-13,15-17,25','psalms',31,2,25], gospel: ['John 18:1-19:42','john',18,1,42,19] },
  'holy-sat':     { first: ['Gen 1:1-2:2','genesis',1,1,2,2], psalm: ['Ps 104:1-2,5-6,10,12-14,24,35','psalms',104,1,35], gospel: ['Mark 16:1-7','mark',16,1,7] },

  // ─── Easter Octave (Easter Mon - Sat) ──────────────────────────────────
  'easter-oct-mon': { first: ['Acts 2:14,22-33','acts',2,14,33], psalm: ['Ps 16:1-2,5,7-11','psalms',16,1,11], gospel: ['Matt 28:8-15','matthew',28,8,15] },
  'easter-oct-tue': { first: ['Acts 2:36-41','acts',2,36,41], psalm: ['Ps 33:4-5,18-22','psalms',33,4,22], gospel: ['John 20:11-18','john',20,11,18] },
  'easter-oct-wed': { first: ['Acts 3:1-10','acts',3,1,10], psalm: ['Ps 105:1-4,6-9','psalms',105,1,9], gospel: ['Luke 24:13-35','luke',24,13,35] },
  'easter-oct-thu': { first: ['Acts 3:11-26','acts',3,11,26], psalm: ['Ps 8:2,5-9','psalms',8,2,9], gospel: ['Luke 24:35-48','luke',24,35,48] },
  'easter-oct-fri': { first: ['Acts 4:1-12','acts',4,1,12], psalm: ['Ps 118:1-2,4,22-27','psalms',118,1,27], gospel: ['John 21:1-14','john',21,1,14] },
  'easter-oct-sat': { first: ['Acts 4:13-21','acts',4,13,21], psalm: ['Ps 118:1,14-21','psalms',118,1,21], gospel: ['Mark 16:9-15','mark',16,9,15] },

  // ─── Easter Week 2 ─────────────────────────────────────────────────────
  'easter-w2-mon': { first: ['Acts 4:23-31','acts',4,23,31], psalm: ['Ps 2:1-9','psalms',2,1,9], gospel: ['John 3:1-8','john',3,1,8] },
  'easter-w2-tue': { first: ['Acts 4:32-37','acts',4,32,37], psalm: ['Ps 93:1-2,5','psalms',93,1,5], gospel: ['John 3:7b-15','john',3,7,15] },
  'easter-w2-wed': { first: ['Acts 5:17-26','acts',5,17,26], psalm: ['Ps 34:2-9','psalms',34,2,9], gospel: ['John 3:16-21','john',3,16,21] },
  'easter-w2-thu': { first: ['Acts 5:27-33','acts',5,27,33], psalm: ['Ps 34:2,9,17-20','psalms',34,2,20], gospel: ['John 3:31-36','john',3,31,36] },
  'easter-w2-fri': { first: ['Acts 5:34-42','acts',5,34,42], psalm: ['Ps 27:1,4,13-14','psalms',27,1,14], gospel: ['John 6:1-15','john',6,1,15] },
  'easter-w2-sat': { first: ['Acts 6:1-7','acts',6,1,7], psalm: ['Ps 33:1-2,4-5,18-19','psalms',33,1,19], gospel: ['John 6:16-21','john',6,16,21] },

  // ─── Easter Week 3 ─────────────────────────────────────────────────────
  'easter-w3-mon': { first: ['Acts 6:8-15','acts',6,8,15], psalm: ['Ps 119:23-30','psalms',119,23,30], gospel: ['John 6:22-29','john',6,22,29] },
  'easter-w3-tue': { first: ['Acts 7:51-8:1a','acts',7,51,1,8], psalm: ['Ps 31:3-4,6-8,17,21','psalms',31,3,21], gospel: ['John 6:30-35','john',6,30,35] },
  'easter-w3-wed': { first: ['Acts 8:1b-8','acts',8,1,8], psalm: ['Ps 66:1-7','psalms',66,1,7], gospel: ['John 6:35-40','john',6,35,40] },
  'easter-w3-thu': { first: ['Acts 8:26-40','acts',8,26,40], psalm: ['Ps 66:8-9,16-17,20','psalms',66,8,20], gospel: ['John 6:44-51','john',6,44,51] },
  'easter-w3-fri': { first: ['Acts 9:1-20','acts',9,1,20], psalm: ['Ps 117:1-2','psalms',117,1,2], gospel: ['John 6:52-59','john',6,52,59] },
  'easter-w3-sat': { first: ['Acts 9:31-42','acts',9,31,42], psalm: ['Ps 116:12-17','psalms',116,12,17], gospel: ['John 6:60-69','john',6,60,69] },

  // ─── Easter Week 4 ─────────────────────────────────────────────────────
  'easter-w4-mon': { first: ['Acts 11:1-18','acts',11,1,18], psalm: ['Ps 42:2-3; 43:3-4','psalms',42,2,4], gospel: ['John 10:11-18','john',10,11,18] },
  'easter-w4-tue': { first: ['Acts 11:19-26','acts',11,19,26], psalm: ['Ps 87:1-7','psalms',87,1,7], gospel: ['John 10:22-30','john',10,22,30] },
  'easter-w4-wed': { first: ['Acts 12:24-13:5a','acts',12,24,5,13], psalm: ['Ps 67:2-3,5-6,8','psalms',67,2,8], gospel: ['John 12:44-50','john',12,44,50] },
  'easter-w4-thu': { first: ['Acts 13:13-25','acts',13,13,25], psalm: ['Ps 89:2-3,21-22,25,27','psalms',89,2,27], gospel: ['John 13:16-20','john',13,16,20] },
  'easter-w4-fri': { first: ['Acts 13:26-33','acts',13,26,33], psalm: ['Ps 2:6-11','psalms',2,6,11], gospel: ['John 14:1-6','john',14,1,6] },
  'easter-w4-sat': { first: ['Acts 13:44-52','acts',13,44,52], psalm: ['Ps 98:1-4','psalms',98,1,4], gospel: ['John 14:7-14','john',14,7,14] },

  // ─── Easter Week 5 ─────────────────────────────────────────────────────
  'easter-w5-mon': { first: ['Acts 14:5-18','acts',14,5,18], psalm: ['Ps 115:1-4,15-16','psalms',115,1,16], gospel: ['John 14:21-26','john',14,21,26] },
  'easter-w5-tue': { first: ['Acts 14:19-28','acts',14,19,28], psalm: ['Ps 145:10-13,21','psalms',145,10,21], gospel: ['John 14:27-31a','john',14,27,31] },
  'easter-w5-wed': { first: ['Acts 15:1-6','acts',15,1,6], psalm: ['Ps 122:1-5','psalms',122,1,5], gospel: ['John 15:1-8','john',15,1,8] },
  'easter-w5-thu': { first: ['Acts 15:7-21','acts',15,7,21], psalm: ['Ps 96:1-3,10','psalms',96,1,10], gospel: ['John 15:9-11','john',15,9,11] },
  'easter-w5-fri': { first: ['Acts 15:22-31','acts',15,22,31], psalm: ['Ps 57:8-12','psalms',57,8,12], gospel: ['John 15:12-17','john',15,12,17] },
  'easter-w5-sat': { first: ['Acts 16:1-10','acts',16,1,10], psalm: ['Ps 100:1-3,5','psalms',100,1,5], gospel: ['John 15:18-21','john',15,18,21] },

  // ─── Easter Week 6 ─────────────────────────────────────────────────────
  'easter-w6-mon': { first: ['Acts 16:11-15','acts',16,11,15], psalm: ['Ps 149:1-6,9','psalms',149,1,9], gospel: ['John 15:26-16:4a','john',15,26,4,16] },
  'easter-w6-tue': { first: ['Acts 16:22-34','acts',16,22,34], psalm: ['Ps 138:1-3,7-8','psalms',138,1,8], gospel: ['John 16:5-11','john',16,5,11] },
  'easter-w6-wed': { first: ['Acts 17:15,22-18:1','acts',17,15,18], psalm: ['Ps 148:1-2,11-14','psalms',148,1,14], gospel: ['John 16:12-15','john',16,12,15] },
  'easter-w6-thu': { first: ['Acts 18:1-8','acts',18,1,8], psalm: ['Ps 98:1-4','psalms',98,1,4], gospel: ['John 16:16-20','john',16,16,20] },
  'easter-w6-fri': { first: ['Acts 18:9-18','acts',18,9,18], psalm: ['Ps 47:2-7','psalms',47,2,7], gospel: ['John 16:20-23','john',16,20,23] },
  'easter-w6-sat': { first: ['Acts 18:23-28','acts',18,23,28], psalm: ['Ps 47:2-3,8-10','psalms',47,2,10], gospel: ['John 16:23b-28','john',16,23,28] },

  // ─── Easter Week 7 ─────────────────────────────────────────────────────
  'easter-w7-mon': { first: ['Acts 19:1-8','acts',19,1,8], psalm: ['Ps 68:2-7','psalms',68,2,7], gospel: ['John 16:29-33','john',16,29,33] },
  'easter-w7-tue': { first: ['Acts 20:17-27','acts',20,17,27], psalm: ['Ps 68:10-11,20-21','psalms',68,10,21], gospel: ['John 17:1-11a','john',17,1,11] },
  'easter-w7-wed': { first: ['Acts 20:28-38','acts',20,28,38], psalm: ['Ps 68:29-30,33-36','psalms',68,29,36], gospel: ['John 17:11b-19','john',17,11,19] },
  'easter-w7-thu': { first: ['Acts 22:30; 23:6-11','acts',22,30,23], psalm: ['Ps 16:1-2,5,7-11','psalms',16,1,11], gospel: ['John 17:20-26','john',17,20,26] },
  'easter-w7-fri': { first: ['Acts 25:13b-21','acts',25,13,21], psalm: ['Ps 103:1-2,11-12,19-20','psalms',103,1,20], gospel: ['John 21:15-19','john',21,15,19] },
  'easter-w7-sat': { first: ['Acts 28:16-20,30-31','acts',28,16,31], psalm: ['Ps 11:4-5,7','psalms',11,4,7], gospel: ['John 21:20-25','john',21,20,25] },

  // ─── Christmas Octave (Dec 26 - Dec 31) ────────────────────────────────
  'christmas-oct-dec26': { first: ['Acts 6:8-10; 7:54-59','acts',6,8,7], psalm: ['Ps 31:3-4,6,8,16-17','psalms',31,3,17], gospel: ['Matt 10:17-22','matthew',10,17,22] },
  'christmas-oct-dec27': { first: ['1 John 1:1-4','1+john',1,1,4], psalm: ['Ps 97:1-2,5-6,11-12','psalms',97,1,12], gospel: ['John 20:1a,2-8','john',20,1,8] },
  'christmas-oct-dec28': { first: ['1 John 1:5-2:2','1+john',1,5,2,2], psalm: ['Ps 124:2-5,7-8','psalms',124,2,8], gospel: ['Matt 2:13-18','matthew',2,13,18] },
  'christmas-oct-dec29': { first: ['1 John 2:3-11','1+john',2,3,11], psalm: ['Ps 96:1-3,5-6','psalms',96,1,6], gospel: ['Luke 2:22-35','luke',2,22,35] },
  'christmas-oct-dec30': { first: ['1 John 2:12-17','1+john',2,12,17], psalm: ['Ps 96:7-10','psalms',96,7,10], gospel: ['Luke 2:36-40','luke',2,36,40] },
  'christmas-oct-dec31': { first: ['1 John 2:18-21','1+john',2,18,21], psalm: ['Ps 96:1-2,11-13','psalms',96,1,13], gospel: ['John 1:1-18','john',1,1,18] },

  // ─── Days between Jan 2 and Epiphany ───────────────────────────────────
  'epiphany-pre-jan2': { first: ['1 John 2:22-28','1+john',2,22,28], psalm: ['Ps 98:1-4','psalms',98,1,4], gospel: ['John 1:19-28','john',1,19,28] },
  'epiphany-pre-jan3': { first: ['1 John 2:29-3:6','1+john',2,29,6,3], psalm: ['Ps 98:1,3-6','psalms',98,1,6], gospel: ['John 1:29-34','john',1,29,34] },
  'epiphany-pre-jan4': { first: ['1 John 3:7-10','1+john',3,7,10], psalm: ['Ps 98:1,7-9','psalms',98,1,9], gospel: ['John 1:35-42','john',1,35,42] },
  'epiphany-pre-jan5': { first: ['1 John 3:11-21','1+john',3,11,21], psalm: ['Ps 100:1-5','psalms',100,1,5], gospel: ['John 1:43-51','john',1,43,51] },
  'epiphany-pre-jan6': { first: ['1 John 5:5-13','1+john',5,5,13], psalm: ['Ps 147:12-15,19-20','psalms',147,12,20], gospel: ['Mark 1:7-11','mark',1,7,11] },
  'epiphany-pre-jan7': { first: ['1 John 5:14-21','1+john',5,14,21], psalm: ['Ps 149:1-6,9','psalms',149,1,9], gospel: ['John 2:1-11','john',2,1,11] },
  'epiphany-pre-jan8': { first: ['1 John 5:5-13','1+john',5,5,13], psalm: ['Ps 147:12-15,19-20','psalms',147,12,20], gospel: ['Luke 5:12-16','luke',5,12,16] },

  // ─── Days after Epiphany (before Baptism) ──────────────────────────────
  'epiphany-post-mon': { first: ['1 John 3:22-4:6','1+john',3,22,6,4], psalm: ['Ps 2:7-12','psalms',2,7,12], gospel: ['Matt 4:12-17,23-25','matthew',4,12,25] },
  'epiphany-post-tue': { first: ['1 John 4:7-10','1+john',4,7,10], psalm: ['Ps 72:1-4,7-8','psalms',72,1,8], gospel: ['Mark 6:34-44','mark',6,34,44] },
  'epiphany-post-wed': { first: ['1 John 4:11-18','1+john',4,11,18], psalm: ['Ps 72:1-2,10,12-13','psalms',72,1,13], gospel: ['Mark 6:45-52','mark',6,45,52] },
  'epiphany-post-thu': { first: ['1 John 4:19-5:4','1+john',4,19,4,5], psalm: ['Ps 72:1-2,14-15,17','psalms',72,1,17], gospel: ['Luke 4:14-22a','luke',4,14,22] },
  'epiphany-post-fri': { first: ['1 John 5:5-13','1+john',5,5,13], psalm: ['Ps 147:12-15,19-20','psalms',147,12,20], gospel: ['Luke 5:12-16','luke',5,12,16] },
  'epiphany-post-sat': { first: ['1 John 5:14-21','1+john',5,14,21], psalm: ['Ps 149:1-6,9','psalms',149,1,9], gospel: ['John 3:22-30','john',3,22,30] },

  // ─── Ash Wednesday + days after ────────────────────────────────────────
  'ash-wed': { first: ['Joel 2:12-18','joel',2,12,18], psalm: ['Ps 51:3-6,12-14,17','psalms',51,3,17], gospel: ['Matt 6:1-6,16-18','matthew',6,1,18] },
  'ash-thu': { first: ['Deut 30:15-20','deuteronomy',30,15,20], psalm: ['Ps 1:1-4,6','psalms',1,1,6], gospel: ['Luke 9:22-25','luke',9,22,25] },
  'ash-fri': { first: ['Isa 58:1-9a','isaiah',58,1,9], psalm: ['Ps 51:3-6,18-19','psalms',51,3,19], gospel: ['Matt 9:14-15','matthew',9,14,15] },
  'ash-sat': { first: ['Isa 58:9b-14','isaiah',58,9,14], psalm: ['Ps 86:1-6','psalms',86,1,6], gospel: ['Luke 5:27-32','luke',5,27,32] },

  // ─── Lent Week 1 ───────────────────────────────────────────────────────
  'lent-w1-mon': { first: ['Lev 19:1-2,11-18','leviticus',19,1,18], psalm: ['Ps 19:8-10,15','psalms',19,8,15], gospel: ['Matt 25:31-46','matthew',25,31,46] },
  'lent-w1-tue': { first: ['Isa 55:10-11','isaiah',55,10,11], psalm: ['Ps 34:4-7,16-19','psalms',34,4,19], gospel: ['Matt 6:7-15','matthew',6,7,15] },
  'lent-w1-wed': { first: ['Jonah 3:1-10','jonah',3,1,10], psalm: ['Ps 51:3-4,12-13,18-19','psalms',51,3,19], gospel: ['Luke 11:29-32','luke',11,29,32] },
  'lent-w1-thu': { first: ['Esth 14:1,3-5,12-14','esther',14,1,14], psalm: ['Ps 138:1-3,7-8','psalms',138,1,8], gospel: ['Matt 7:7-12','matthew',7,7,12] },
  'lent-w1-fri': { first: ['Ezek 18:21-28','ezekiel',18,21,28], psalm: ['Ps 130:1-8','psalms',130,1,8], gospel: ['Matt 5:20-26','matthew',5,20,26] },
  'lent-w1-sat': { first: ['Deut 26:16-19','deuteronomy',26,16,19], psalm: ['Ps 119:1-2,4-5,7-8','psalms',119,1,8], gospel: ['Matt 5:43-48','matthew',5,43,48] },

  // ─── Lent Week 2 ───────────────────────────────────────────────────────
  'lent-w2-mon': { first: ['Dan 9:4b-10','daniel',9,4,10], psalm: ['Ps 79:8-9,11,13','psalms',79,8,13], gospel: ['Luke 6:36-38','luke',6,36,38] },
  'lent-w2-tue': { first: ['Isa 1:10,16-20','isaiah',1,10,20], psalm: ['Ps 50:8-9,16-17,21,23','psalms',50,8,23], gospel: ['Matt 23:1-12','matthew',23,1,12] },
  'lent-w2-wed': { first: ['Jer 18:18-20','jeremiah',18,18,20], psalm: ['Ps 31:5-6,14-16','psalms',31,5,16], gospel: ['Matt 20:17-28','matthew',20,17,28] },
  'lent-w2-thu': { first: ['Jer 17:5-10','jeremiah',17,5,10], psalm: ['Ps 1:1-4,6','psalms',1,1,6], gospel: ['Luke 16:19-31','luke',16,19,31] },
  'lent-w2-fri': { first: ['Gen 37:3-4,12-13a,17b-28','genesis',37,3,28], psalm: ['Ps 105:16-21','psalms',105,16,21], gospel: ['Matt 21:33-43,45-46','matthew',21,33,46] },
  'lent-w2-sat': { first: ['Mic 7:14-15,18-20','micah',7,14,20], psalm: ['Ps 103:1-4,9-12','psalms',103,1,12], gospel: ['Luke 15:1-3,11-32','luke',15,1,32] },

  // ─── Lent Week 3 ───────────────────────────────────────────────────────
  'lent-w3-mon': { first: ['2 Kgs 5:1-15a','2+kings',5,1,15], psalm: ['Ps 42:2-3; 43:3-4','psalms',42,2,4], gospel: ['Luke 4:24-30','luke',4,24,30] },
  'lent-w3-tue': { first: ['Dan 3:25,34-43','daniel',3,25,43], psalm: ['Ps 25:4-9','psalms',25,4,9], gospel: ['Matt 18:21-35','matthew',18,21,35] },
  'lent-w3-wed': { first: ['Deut 4:1,5-9','deuteronomy',4,1,9], psalm: ['Ps 147:12-13,15-16,19-20','psalms',147,12,20], gospel: ['Matt 5:17-19','matthew',5,17,19] },
  'lent-w3-thu': { first: ['Jer 7:23-28','jeremiah',7,23,28], psalm: ['Ps 95:1-2,6-9','psalms',95,1,9], gospel: ['Luke 11:14-23','luke',11,14,23] },
  'lent-w3-fri': { first: ['Hos 14:2-10','hosea',14,2,10], psalm: ['Ps 81:6-11,14,17','psalms',81,6,17], gospel: ['Mark 12:28-34','mark',12,28,34] },
  'lent-w3-sat': { first: ['Hos 6:1-6','hosea',6,1,6], psalm: ['Ps 51:3-4,18-21','psalms',51,3,21], gospel: ['Luke 18:9-14','luke',18,9,14] },

  // ─── Lent Week 4 ───────────────────────────────────────────────────────
  'lent-w4-mon': { first: ['Isa 65:17-21','isaiah',65,17,21], psalm: ['Ps 30:2,4-6,11-13','psalms',30,2,13], gospel: ['John 4:43-54','john',4,43,54] },
  'lent-w4-tue': { first: ['Ezek 47:1-9,12','ezekiel',47,1,12], psalm: ['Ps 46:2-3,5-6,8-9','psalms',46,2,9], gospel: ['John 5:1-16','john',5,1,16] },
  'lent-w4-wed': { first: ['Isa 49:8-15','isaiah',49,8,15], psalm: ['Ps 145:8-9,13-14,17-18','psalms',145,8,18], gospel: ['John 5:17-30','john',5,17,30] },
  'lent-w4-thu': { first: ['Exod 32:7-14','exodus',32,7,14], psalm: ['Ps 106:19-23','psalms',106,19,23], gospel: ['John 5:31-47','john',5,31,47] },
  'lent-w4-fri': { first: ['Wis 2:1a,12-22','wisdom+of+solomon',2,1,22], psalm: ['Ps 34:17-21,23','psalms',34,17,23], gospel: ['John 7:1-2,10,25-30','john',7,1,30] },
  'lent-w4-sat': { first: ['Jer 11:18-20','jeremiah',11,18,20], psalm: ['Ps 7:2-3,9-12','psalms',7,2,12], gospel: ['John 7:40-53','john',7,40,53] },

  // ─── Lent Week 5 ───────────────────────────────────────────────────────
  'lent-w5-mon': { first: ['Dan 13:1-9,15-17,19-30,33-62','daniel',13,1,62], psalm: ['Ps 23:1-6','psalms',23,1,6], gospel: ['John 8:1-11','john',8,1,11] },
  'lent-w5-tue': { first: ['Num 21:4-9','numbers',21,4,9], psalm: ['Ps 102:2-3,16-21','psalms',102,2,21], gospel: ['John 8:21-30','john',8,21,30] },
  'lent-w5-wed': { first: ['Dan 3:14-20,91-92,95','daniel',3,14,95], psalm: ['Dan 3:52-56','daniel',3,52,56], gospel: ['John 8:31-42','john',8,31,42] },
  'lent-w5-thu': { first: ['Gen 17:3-9','genesis',17,3,9], psalm: ['Ps 105:4-9','psalms',105,4,9], gospel: ['John 8:51-59','john',8,51,59] },
  'lent-w5-fri': { first: ['Jer 20:10-13','jeremiah',20,10,13], psalm: ['Ps 18:2-7','psalms',18,2,7], gospel: ['John 10:31-42','john',10,31,42] },
  'lent-w5-sat': { first: ['Ezek 37:21-28','ezekiel',37,21,28], psalm: ['Jer 31:10-13','jeremiah',31,10,13], gospel: ['John 11:45-56','john',11,45,56] },

  // ─── Late Advent (Dec 17-24) ───────────────────────────────────────────
  'advent-late-dec17': { first: ['Gen 49:2,8-10','genesis',49,2,10], psalm: ['Ps 72:1-4,7-8,17','psalms',72,1,17], gospel: ['Matt 1:1-17','matthew',1,1,17] },
  'advent-late-dec18': { first: ['Jer 23:5-8','jeremiah',23,5,8], psalm: ['Ps 72:1-2,12-13,18-19','psalms',72,1,19], gospel: ['Matt 1:18-25','matthew',1,18,25] },
  'advent-late-dec19': { first: ['Judg 13:2-7,24-25a','judges',13,2,25], psalm: ['Ps 71:3-6,16-17','psalms',71,3,17], gospel: ['Luke 1:5-25','luke',1,5,25] },
  'advent-late-dec20': { first: ['Isa 7:10-14','isaiah',7,10,14], psalm: ['Ps 24:1-6','psalms',24,1,6], gospel: ['Luke 1:26-38','luke',1,26,38] },
  'advent-late-dec21': { first: ['Song 2:8-14','song+of+solomon',2,8,14], psalm: ['Ps 33:2-3,11-12,20-21','psalms',33,2,21], gospel: ['Luke 1:39-45','luke',1,39,45] },
  'advent-late-dec22': { first: ['1 Sam 1:24-28','1+samuel',1,24,28], psalm: ['1 Sam 2:1,4-8','1+samuel',2,1,8], gospel: ['Luke 1:46-56','luke',1,46,56] },
  'advent-late-dec23': { first: ['Mal 3:1-4,23-24','malachi',3,1,24], psalm: ['Ps 25:4-5,8-10,14','psalms',25,4,14], gospel: ['Luke 1:57-66','luke',1,57,66] },
  'advent-late-dec24': { first: ['2 Sam 7:1-5,8b-12,14a,16','2+samuel',7,1,16], psalm: ['Ps 89:2-5,27,29','psalms',89,2,29], gospel: ['Luke 1:67-79','luke',1,67,79] },

  // ─── Advent Week 1 ─────────────────────────────────────────────────────
  'advent-w1-mon': { first: ['Isa 4:2-6','isaiah',4,2,6], psalm: ['Ps 122:1-9','psalms',122,1,9], gospel: ['Matt 8:5-11','matthew',8,5,11] },
  'advent-w1-tue': { first: ['Isa 11:1-10','isaiah',11,1,10], psalm: ['Ps 72:1-2,7-8,12-13,17','psalms',72,1,17], gospel: ['Luke 10:21-24','luke',10,21,24] },
  'advent-w1-wed': { first: ['Isa 25:6-10a','isaiah',25,6,10], psalm: ['Ps 23:1-6','psalms',23,1,6], gospel: ['Matt 15:29-37','matthew',15,29,37] },
  'advent-w1-thu': { first: ['Isa 26:1-6','isaiah',26,1,6], psalm: ['Ps 118:1,8-9,19-21,25-27','psalms',118,1,27], gospel: ['Matt 7:21,24-27','matthew',7,21,27] },
  'advent-w1-fri': { first: ['Isa 29:17-24','isaiah',29,17,24], psalm: ['Ps 27:1,4,13-14','psalms',27,1,14], gospel: ['Matt 9:27-31','matthew',9,27,31] },
  'advent-w1-sat': { first: ['Isa 30:19-21,23-26','isaiah',30,19,26], psalm: ['Ps 147:1-6','psalms',147,1,6], gospel: ['Matt 9:35-10:1,5a,6-8','matthew',9,35,8,10] },

  // ─── Advent Week 2 ─────────────────────────────────────────────────────
  'advent-w2-mon': { first: ['Isa 35:1-10','isaiah',35,1,10], psalm: ['Ps 85:9-14','psalms',85,9,14], gospel: ['Luke 5:17-26','luke',5,17,26] },
  'advent-w2-tue': { first: ['Isa 40:1-11','isaiah',40,1,11], psalm: ['Ps 96:1-3,10-13','psalms',96,1,13], gospel: ['Matt 18:12-14','matthew',18,12,14] },
  'advent-w2-wed': { first: ['Isa 40:25-31','isaiah',40,25,31], psalm: ['Ps 103:1-4,8,10','psalms',103,1,10], gospel: ['Matt 11:28-30','matthew',11,28,30] },
  'advent-w2-thu': { first: ['Isa 41:13-20','isaiah',41,13,20], psalm: ['Ps 145:1,9-13','psalms',145,1,13], gospel: ['Matt 11:11-15','matthew',11,11,15] },
  'advent-w2-fri': { first: ['Isa 48:17-19','isaiah',48,17,19], psalm: ['Ps 1:1-4,6','psalms',1,1,6], gospel: ['Matt 11:16-19','matthew',11,16,19] },
  'advent-w2-sat': { first: ['Sir 48:1-4,9-11','sirach',48,1,11], psalm: ['Ps 80:2-3,15-16,18-19','psalms',80,2,19], gospel: ['Matt 17:9a,10-13','matthew',17,9,13] },

  // ─── Advent Week 3 ─────────────────────────────────────────────────────
  'advent-w3-mon': { first: ['Num 24:2-7,15-17a','numbers',24,2,17], psalm: ['Ps 25:4-9','psalms',25,4,9], gospel: ['Matt 21:23-27','matthew',21,23,27] },
  'advent-w3-tue': { first: ['Zeph 3:1-2,9-13','zephaniah',3,1,13], psalm: ['Ps 34:2-3,6-7,17-19,23','psalms',34,2,23], gospel: ['Matt 21:28-32','matthew',21,28,32] },
  'advent-w3-wed': { first: ['Isa 45:6c-8,18,21c-25','isaiah',45,6,25], psalm: ['Ps 85:9-14','psalms',85,9,14], gospel: ['Luke 7:18b-23','luke',7,18,23] },
  'advent-w3-thu': { first: ['Isa 54:1-10','isaiah',54,1,10], psalm: ['Ps 30:2,4-6,11-13','psalms',30,2,13], gospel: ['Luke 7:24-30','luke',7,24,30] },
  'advent-w3-fri': { first: ['Isa 56:1-3a,6-8','isaiah',56,1,8], psalm: ['Ps 67:2-3,5,7-8','psalms',67,2,8], gospel: ['John 5:33-36','john',5,33,36] },

  // ─── Ordinary Time Year II — Week 8 (post-Pentecost in 2026) ───────────
  'ot-w8-mon-II': { first: ['1 Pet 1:3-9','1+peter',1,3,9], psalm: ['Ps 111:1-2,5-6,9-10','psalms',111,1,10], gospel: ['Mark 10:17-27','mark',10,17,27] },
  'ot-w8-tue-II': { first: ['1 Pet 1:10-16','1+peter',1,10,16], psalm: ['Ps 98:1-4','psalms',98,1,4], gospel: ['Mark 10:28-31','mark',10,28,31] },
  'ot-w8-wed-II': { first: ['1 Pet 1:18-25','1+peter',1,18,25], psalm: ['Ps 147:12-15,19-20','psalms',147,12,20], gospel: ['Mark 10:32-45','mark',10,32,45] },
  'ot-w8-thu-II': { first: ['1 Pet 2:2-5,9-12','1+peter',2,2,12], psalm: ['Ps 100:2-5','psalms',100,2,5], gospel: ['Mark 10:46-52','mark',10,46,52] },
  'ot-w8-fri-II': { first: ['1 Pet 4:7-13','1+peter',4,7,13], psalm: ['Ps 96:10-13','psalms',96,10,13], gospel: ['Mark 11:11-26','mark',11,11,26] },
  'ot-w8-sat-II': { first: ['Jude 17,20b-25','jude',1,17,25], psalm: ['Ps 63:2-6','psalms',63,2,6], gospel: ['Mark 11:27-33','mark',11,27,33] },

  // ─── Ordinary Time Year II — Week 9 ────────────────────────────────────
  'ot-w9-mon-II': { first: ['2 Pet 1:2-7','2+peter',1,2,7], psalm: ['Ps 91:1-2,14-16','psalms',91,1,16], gospel: ['Mark 12:1-12','mark',12,1,12] },
  'ot-w9-tue-II': { first: ['2 Pet 3:12-15a,17-18','2+peter',3,12,18], psalm: ['Ps 90:2-4,10,14,16','psalms',90,2,16], gospel: ['Mark 12:13-17','mark',12,13,17] },
  'ot-w9-wed-II': { first: ['2 Tim 1:1-3,6-12','2+timothy',1,1,12], psalm: ['Ps 123:1-2','psalms',123,1,2], gospel: ['Mark 12:18-27','mark',12,18,27] },
  'ot-w9-thu-II': { first: ['2 Tim 2:8-15','2+timothy',2,8,15], psalm: ['Ps 25:4-5,8-10,14','psalms',25,4,14], gospel: ['Mark 12:28-34','mark',12,28,34] },
  'ot-w9-fri-II': { first: ['2 Tim 3:10-17','2+timothy',3,10,17], psalm: ['Ps 119:157,160-161,165-166,168','psalms',119,157,168], gospel: ['Mark 12:35-37','mark',12,35,37] },
  'ot-w9-sat-II': { first: ['2 Tim 4:1-8','2+timothy',4,1,8], psalm: ['Ps 71:8-9,14-17,22','psalms',71,8,22], gospel: ['Mark 12:38-44','mark',12,38,44] },

  // ─── Ordinary Time Year II — Week 10 ───────────────────────────────────
  'ot-w10-mon-II': { first: ['1 Kgs 17:1-6','1+kings',17,1,6], psalm: ['Ps 121:1-8','psalms',121,1,8], gospel: ['Matt 5:1-12','matthew',5,1,12] },
  'ot-w10-tue-II': { first: ['1 Kgs 17:7-16','1+kings',17,7,16], psalm: ['Ps 4:2-5,7-8','psalms',4,2,8], gospel: ['Matt 5:13-16','matthew',5,13,16] },
  'ot-w10-wed-II': { first: ['1 Kgs 18:20-39','1+kings',18,20,39], psalm: ['Ps 16:1-2,4-5,8,11','psalms',16,1,11], gospel: ['Matt 5:17-19','matthew',5,17,19] },
  'ot-w10-thu-II': { first: ['1 Kgs 18:41-46','1+kings',18,41,46], psalm: ['Ps 65:10-13','psalms',65,10,13], gospel: ['Matt 5:20-26','matthew',5,20,26] },
  'ot-w10-fri-II': { first: ['1 Kgs 19:9a,11-16','1+kings',19,9,16], psalm: ['Ps 27:7-9,13-14','psalms',27,7,14], gospel: ['Matt 5:27-32','matthew',5,27,32] },
  'ot-w10-sat-II': { first: ['1 Kgs 19:19-21','1+kings',19,19,21], psalm: ['Ps 16:1-2,5,7-10','psalms',16,1,10], gospel: ['Matt 5:33-37','matthew',5,33,37] },

  // ─── Ordinary Time Year II — Week 11 ───────────────────────────────────
  'ot-w11-mon-II': { first: ['1 Kgs 21:1-16','1+kings',21,1,16], psalm: ['Ps 5:2-3,5-7','psalms',5,2,7], gospel: ['Matt 5:38-42','matthew',5,38,42] },
  'ot-w11-tue-II': { first: ['1 Kgs 21:17-29','1+kings',21,17,29], psalm: ['Ps 51:3-6,11,16','psalms',51,3,16], gospel: ['Matt 5:43-48','matthew',5,43,48] },
  'ot-w11-wed-II': { first: ['2 Kgs 2:1,6-14','2+kings',2,1,14], psalm: ['Ps 31:20-21,24','psalms',31,20,24], gospel: ['Matt 6:1-6,16-18','matthew',6,1,18] },
  'ot-w11-thu-II': { first: ['Sir 48:1-14','sirach',48,1,14], psalm: ['Ps 97:1-7','psalms',97,1,7], gospel: ['Matt 6:7-15','matthew',6,7,15] },
  'ot-w11-fri-II': { first: ['2 Kgs 11:1-4,9-18,20','2+kings',11,1,20], psalm: ['Ps 132:11-14,17-18','psalms',132,11,18], gospel: ['Matt 6:19-23','matthew',6,19,23] },
  'ot-w11-sat-II': { first: ['2 Chr 24:17-25','2+chronicles',24,17,25], psalm: ['Ps 89:4-5,29-34','psalms',89,4,34], gospel: ['Matt 6:24-34','matthew',6,24,34] },

  // ─── Ordinary Time Year II — Week 12 ───────────────────────────────────
  'ot-w12-mon-II': { first: ['2 Kgs 17:5-8,13-15a,18','2+kings',17,5,18], psalm: ['Ps 60:3-5,12-13','psalms',60,3,13], gospel: ['Matt 7:1-5','matthew',7,1,5] },
  'ot-w12-tue-II': { first: ['2 Kgs 19:9b-11,14-21,31-35a,36','2+kings',19,9,36], psalm: ['Ps 48:2-4,10-11','psalms',48,2,11], gospel: ['Matt 7:6,12-14','matthew',7,6,14] },
  'ot-w12-wed-II': { first: ['2 Kgs 22:8-13; 23:1-3','2+kings',22,8,23], psalm: ['Ps 119:33-37,40','psalms',119,33,40], gospel: ['Matt 7:15-20','matthew',7,15,20] },
  'ot-w12-thu-II': { first: ['2 Kgs 24:8-17','2+kings',24,8,17], psalm: ['Ps 79:1-5,8-9','psalms',79,1,9], gospel: ['Matt 7:21-29','matthew',7,21,29] },
  'ot-w12-fri-II': { first: ['2 Kgs 25:1-12','2+kings',25,1,12], psalm: ['Ps 137:1-6','psalms',137,1,6], gospel: ['Matt 8:1-4','matthew',8,1,4] },
  'ot-w12-sat-II': { first: ['Lam 2:2,10-14,18-19','lamentations',2,2,19], psalm: ['Ps 74:1-7,20-21','psalms',74,1,21], gospel: ['Matt 8:5-17','matthew',8,5,17] },

  // ─── Ordinary Time Year II — Week 13 ───────────────────────────────────
  'ot-w13-mon-II': { first: ['Amos 2:6-10,13-16','amos',2,6,16], psalm: ['Ps 50:16-23','psalms',50,16,23], gospel: ['Matt 8:18-22','matthew',8,18,22] },
  'ot-w13-tue-II': { first: ['Amos 3:1-8; 4:11-12','amos',3,1,4], psalm: ['Ps 5:4-8','psalms',5,4,8], gospel: ['Matt 8:23-27','matthew',8,23,27] },
  'ot-w13-wed-II': { first: ['Amos 5:14-15,21-24','amos',5,14,24], psalm: ['Ps 50:7-13,16-17','psalms',50,7,17], gospel: ['Matt 8:28-34','matthew',8,28,34] },
  'ot-w13-thu-II': { first: ['Amos 7:10-17','amos',7,10,17], psalm: ['Ps 19:8-11','psalms',19,8,11], gospel: ['Matt 9:1-8','matthew',9,1,8] },
  'ot-w13-fri-II': { first: ['Amos 8:4-6,9-12','amos',8,4,12], psalm: ['Ps 119:2,10,20,30,40,131','psalms',119,2,131], gospel: ['Matt 9:9-13','matthew',9,9,13] },
  'ot-w13-sat-II': { first: ['Amos 9:11-15','amos',9,11,15], psalm: ['Ps 85:9-14','psalms',85,9,14], gospel: ['Matt 9:14-17','matthew',9,14,17] },

  // ─── Ordinary Time Year II — Week 14 ───────────────────────────────────
  'ot-w14-mon-II': { first: ['Hos 2:16,17b-18,21-22','hosea',2,16,22], psalm: ['Ps 145:2-9','psalms',145,2,9], gospel: ['Matt 9:18-26','matthew',9,18,26] },
  'ot-w14-tue-II': { first: ['Hos 8:4-7,11-13','hosea',8,4,13], psalm: ['Ps 115:3-10','psalms',115,3,10], gospel: ['Matt 9:32-38','matthew',9,32,38] },
  'ot-w14-wed-II': { first: ['Hos 10:1-3,7-8,12','hosea',10,1,12], psalm: ['Ps 105:2-7','psalms',105,2,7], gospel: ['Matt 10:1-7','matthew',10,1,7] },
  'ot-w14-thu-II': { first: ['Hos 11:1-4,8c-9','hosea',11,1,9], psalm: ['Ps 80:2-3,15-16','psalms',80,2,16], gospel: ['Matt 10:7-15','matthew',10,7,15] },
  'ot-w14-fri-II': { first: ['Hos 14:2-10','hosea',14,2,10], psalm: ['Ps 51:3-4,8-9,12-14,17','psalms',51,3,17], gospel: ['Matt 10:16-23','matthew',10,16,23] },
  'ot-w14-sat-II': { first: ['Isa 6:1-8','isaiah',6,1,8], psalm: ['Ps 93:1-2,5','psalms',93,1,5], gospel: ['Matt 10:24-33','matthew',10,24,33] },

  // ─── Ordinary Time Year II — Week 15 ───────────────────────────────────
  'ot-w15-mon-II': { first: ['Isa 1:10-17','isaiah',1,10,17], psalm: ['Ps 50:8-9,16-17,21,23','psalms',50,8,23], gospel: ['Matt 10:34-11:1','matthew',10,34,1,11] },
  'ot-w15-tue-II': { first: ['Isa 7:1-9','isaiah',7,1,9], psalm: ['Ps 48:2-8','psalms',48,2,8], gospel: ['Matt 11:20-24','matthew',11,20,24] },
  'ot-w15-wed-II': { first: ['Isa 10:5-7,13b-16','isaiah',10,5,16], psalm: ['Ps 94:5-10,14-15','psalms',94,5,15], gospel: ['Matt 11:25-27','matthew',11,25,27] },
  'ot-w15-thu-II': { first: ['Isa 26:7-9,12,16-19','isaiah',26,7,19], psalm: ['Ps 102:13-21','psalms',102,13,21], gospel: ['Matt 11:28-30','matthew',11,28,30] },
  'ot-w15-fri-II': { first: ['Isa 38:1-6,21-22,7-8','isaiah',38,1,22], psalm: ['Isa 38:10-12,16','isaiah',38,10,16], gospel: ['Matt 12:1-8','matthew',12,1,8] },
  'ot-w15-sat-II': { first: ['Mic 2:1-5','micah',2,1,5], psalm: ['Ps 10:1-4,7-8,14','psalms',10,1,14], gospel: ['Matt 12:14-21','matthew',12,14,21] },

  // ─── Ordinary Time Year II — Week 16 ───────────────────────────────────
  'ot-w16-mon-II': { first: ['Mic 6:1-4,6-8','micah',6,1,8], psalm: ['Ps 50:5-6,8-9,16-17,21,23','psalms',50,5,23], gospel: ['Matt 12:38-42','matthew',12,38,42] },
  'ot-w16-tue-II': { first: ['Mic 7:14-15,18-20','micah',7,14,20], psalm: ['Ps 85:2-8','psalms',85,2,8], gospel: ['Matt 12:46-50','matthew',12,46,50] },
  'ot-w16-wed-II': { first: ['Jer 1:1,4-10','jeremiah',1,1,10], psalm: ['Ps 71:1-6,15,17','psalms',71,1,17], gospel: ['Matt 13:1-9','matthew',13,1,9] },
  'ot-w16-thu-II': { first: ['Jer 2:1-3,7-8,12-13','jeremiah',2,1,13], psalm: ['Ps 36:6-11','psalms',36,6,11], gospel: ['Matt 13:10-17','matthew',13,10,17] },
  'ot-w16-fri-II': { first: ['Jer 3:14-17','jeremiah',3,14,17], psalm: ['Jer 31:10-13','jeremiah',31,10,13], gospel: ['Matt 13:18-23','matthew',13,18,23] },
  'ot-w16-sat-II': { first: ['Jer 7:1-11','jeremiah',7,1,11], psalm: ['Ps 84:3-6,8,11','psalms',84,3,11], gospel: ['Matt 13:24-30','matthew',13,24,30] },

  // ─── Ordinary Time Year II — Week 17 ───────────────────────────────────
  'ot-w17-mon-II': { first: ['Jer 13:1-11','jeremiah',13,1,11], psalm: ['Deut 32:18-21','deuteronomy',32,18,21], gospel: ['Matt 13:31-35','matthew',13,31,35] },
  'ot-w17-tue-II': { first: ['Jer 14:17-22','jeremiah',14,17,22], psalm: ['Ps 79:8-9,11,13','psalms',79,8,13], gospel: ['Matt 13:36-43','matthew',13,36,43] },
  'ot-w17-wed-II': { first: ['Jer 15:10,16-21','jeremiah',15,10,21], psalm: ['Ps 59:2-4,10-11,17-18','psalms',59,2,18], gospel: ['Matt 13:44-46','matthew',13,44,46] },
  'ot-w17-thu-II': { first: ['Jer 18:1-6','jeremiah',18,1,6], psalm: ['Ps 146:1-6','psalms',146,1,6], gospel: ['Matt 13:47-53','matthew',13,47,53] },
  'ot-w17-fri-II': { first: ['Jer 26:1-9','jeremiah',26,1,9], psalm: ['Ps 69:5,8-10,14','psalms',69,5,14], gospel: ['Matt 13:54-58','matthew',13,54,58] },
  'ot-w17-sat-II': { first: ['Jer 26:11-16,24','jeremiah',26,11,24], psalm: ['Ps 69:15-16,30-31,33-34','psalms',69,15,34], gospel: ['Matt 14:1-12','matthew',14,1,12] },
};
