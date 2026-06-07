-- Insert Cambridge Cycling Tour voyage
INSERT INTO "Voyages" (
    "Name", "Brief", "Description", "Vacancy",
    "StartDate", "EndDate", "LastBidDate",
    "MinPrice", "MaxPrice", "Currency",
    "FixedPrice", "Auction", "PublicOnMap",
    "ProfileImage", "ProfileImageThumbnail",
    "UserId", "VehicleId", "VehicleImage", "VehicleName", "VehicleType",
    "CreatedAt", "Confirmed", "IsDeleted", "PlaceType"
)
VALUES (
    'Cambridge Colleges Tour',
    '4-day cycling tour visiting all 31 Cambridge colleges by bike.',
    'A self-guided 4-day cycling tour of all 31 Cambridge colleges. Each day covers a geographic cluster — Day 1: the historic river core, Day 2: Trumpington Street and east side, Day 3: west and northwest, Day 4: north, far east and outliers including Girton.',
    1,
    '2026-06-01 09:00:00', '2026-06-04 18:00:00', '2026-05-25 23:59:59',
    0, 0, 'GBP',
    false, false, true,
    '', '',
    '703904d7-d3aa-4577-99ff-4b6d9962b841', NULL, '', 'Walk', 4,
    NOW(), true, false, 0
);

-- Insert waypoints (uses the voyage just created)
WITH new_voyage AS (
    SELECT "Id" FROM "Voyages"
    WHERE "UserId" = '703904d7-d3aa-4577-99ff-4b6d9962b841'
    ORDER BY "CreatedAt" DESC
    LIMIT 1
)
INSERT INTO "Waypoints" ("Latitude", "Longitude", "Title", "Description", "ProfileImage", "Order", "VoyageId", "UserId")
SELECT lat, lng, title, description, '', ord, new_voyage."Id", '703904d7-d3aa-4577-99ff-4b6d9962b841'
FROM new_voyage, (VALUES
    (52.2049, 0.1166, 'King''s College',       'Iconic chapel, biggest crowds, get it done early',1),
    (52.2044, 0.1149, 'Clare College',          'Beautiful bridge over the Cam',2),
    (52.2051, 0.1152, 'Trinity Hall',           'Tiny lane, very hidden gem',3),
    (52.2053, 0.1181, 'Gonville & Caius',       'Gate of Honour — Stephen Hawking''s college',4),
    (52.2058, 0.1169, 'Trinity College',        'Largest college, Great Court — allow extra time here',5),
    (52.2082, 0.1170, 'St John''s College',     'Bridge of Sighs — right next to Trinity',6),
    (52.2103, 0.1154, 'Magdalene College',      'Northernmost of the river colleges',7),
    (52.2031, 0.1134, 'Queens'' College',       'Mathematical Bridge — head south to finish day 1',8),
    (52.2003, 0.1190, 'Peterhouse',             'Oldest college in Cambridge (1284)',9),
    (52.2019, 0.1183, 'Pembroke College',       'Free entry, beautiful gardens',10),
    (52.2028, 0.1167, 'Corpus Christi',         'Parker Library has medieval manuscripts',11),
    (52.2033, 0.1175, 'St Catharine''s',        'Right next to Corpus — grand symmetrical courtyard',12),
    (52.2000, 0.1242, 'Downing College',        'Neoclassical — very different feel, wide open lawns',13),
    (52.2036, 0.1244, 'Emmanuel College',       'Beautiful pond garden — Harvard connection',14),
    (52.2050, 0.1215, 'Christ''s College',      'Darwin''s college',15),
    (52.2017, 0.1127, 'Darwin College',         'Graduate-only college on a river island',16),
    (52.1994, 0.1094, 'Newnham College',        'Beautiful gardens, famous women''s college',17),
    (52.2008, 0.1056, 'Selwyn College',         'Quiet and charming, often overlooked',18),
    (52.2029, 0.0995, 'Wolfson College',        'Modern with Asian-influenced architecture, Chinese lions',19),
    (52.2059, 0.1025, 'Robinson College',       'Distinctive red brick, modern chapel with coloured glass',20),
    (52.2100, 0.0997, 'Clare Hall',             'Tiny postgrad college, very relaxed vibe',21),
    (52.2107, 0.1036, 'Churchill College',      'Brutalist, duck pond at entrance',22),
    (52.2152, 0.1020, 'Fitzwilliam College',    'Modern, next door to Churchill',23),
    (52.2128, 0.1071, 'St Edmund''s College',   'Catholic foundation, mixed architecture',24),
    (52.2131, 0.1080, 'Lucy Cavendish',         'Small, quiet, garden college',25),
    (52.2120, 0.1048, 'Murray Edwards',         'Iconic modernist dome, great women''s art collection',26),
    (52.2087, 0.1193, 'Jesus College',          'Large grounds, horse sculpture, free entry',27),
    (52.2073, 0.1208, 'Sidney Sussex',          'Oliver Cromwell buried here',28),
    (52.1988, 0.1315, 'Hughes Hall',            'Near Mill Road — mature students college',29),
    (52.1865, 0.1398, 'Homerton College',       'Furthest south — massive grounds, apple trees and ducks',30),
    (52.2274, 0.0837, 'Girton College',         '3km northwest of centre — longest ride of the trip, swimming pool on site', 31)
) AS v(lat, lng, title, description, ord);
