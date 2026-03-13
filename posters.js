/**
 * TMDB poster_path values for ~64 iconic 80s movies.
 * Usage: const posterUrl = `https://image.tmdb.org/t/p/w300${POSTERS["Movie Title"]}`;
 *
 * Sources: Poster paths gathered from TMDB API data found in web search results,
 * GitHub notebooks, TMDB forum discussions, and the Wolfram Notebook Archive.
 *
 * TMDB IDs are included as comments for reference.
 * If any poster_path is outdated (TMDB can change primary posters over time),
 * use fetch_posters.html with a free TMDB API key to refresh all paths.
 *
 * To get a TMDB API key (free): https://www.themoviedb.org/settings/api
 */
const POSTERS = {
  // ===== ACTION =====
  "Raiders of the Lost Ark": "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",       // TMDB ID: 85
  "Die Hard": "/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg",                     // TMDB ID: 562
  "The Terminator": "/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",               // TMDB ID: 218
  "RoboCop": "/hoCbhAOfOFpnF7MCsIv04v1rnkS.jpg",                     // TMDB ID: 5548
  "Beverly Hills Cop": "/eBJEvMR82Lhyri6XKV2B3pRXCAm.jpg",            // TMDB ID: 90
  "Top Gun": "/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg",                     // TMDB ID: 744
  "Lethal Weapon": "/bFxAftejRNhkMFederCq9QghF8u.jpg",                // TMDB ID: 941
  "Aliens": "/r1x5JGpyqZU8PYhbs4UcrO1Xb6x.jpg",                     // TMDB ID: 679
  "First Blood": "/a9sa6ERZCpplbPEO7OMWE763CLD.jpg",                  // TMDB ID: 1368
  "Predator": "/bFOqHIDN2MnJNQph5SMpWnQyilq.jpg",                    // TMDB ID: 106

  // ===== COMEDY =====
  "Ghostbusters": "/loFCAro1YSAhMJHfmRFCemMNLun.jpg",                 // TMDB ID: 620
  "Ferris Bueller's Day Off": "/9LddG87JMmHXsRJbpLpwMjcWpW2.jpg",     // TMDB ID: 9377
  "Tootsie": "/rBaW4mq1E3NqWfVHU9GPn5hOj8I.jpg",                     // TMDB ID: 9576
  "Coming to America": "/djRAvxyvvN4yMFnDEqeKkz7lkOl.jpg",            // TMDB ID: 9602
  "Airplane!": "/7Q4bPJVkealJWDi4CaF4VlPYS47.jpg",                    // TMDB ID: 813
  "Beetlejuice": "/nnl6OWkyPpuMm595hmAxNW614NU.jpg",                  // TMDB ID: 4011
  "Trading Places": "/4ACm9hOr7ib3TjBqv5dRkAe0JKb.jpg",               // TMDB ID: 1621
  "National Lampoon's Vacation": "/q3DvIoSbhwOOd4T7mDYENsaXvYH.jpg",  // TMDB ID: 11153
  "Spaceballs": "/o624HTt9RMu9YwWHKt7lSm1DVXE.jpg",                   // TMDB ID: 957
  "9 to 5": "/6xIKMxk2h6vP1WA7bqFqjvEFvqT.jpg",                     // TMDB ID: 9918

  // ===== DRAMA =====
  "Stand By Me": "/bXbTlLFj3zHEdcfnlMlNvPbY8za.jpg",                  // TMDB ID: 235
  "Scarface": "/iQ5ztdjvteGeboXVh1eW3xIF5gO.jpg",                     // TMDB ID: 111
  "Rain Man": "/jOUPMGemkJBd6sGl0NnjIS3CoWQ.jpg",                     // TMDB ID: 380
  "The Color Purple": "/sGNlnJEhm5x7BBCsSFxfSpqzTAF.jpg",             // TMDB ID: 873
  "Platoon": "/oJDPvJynGqVfxjJMkMjXJIPhSsa.jpg",                     // TMDB ID: 792
  "Full Metal Jacket": "/kMKyx1k8hWWscYFnPbnxxYAEOoW.jpg",             // TMDB ID: 600
  "Ordinary People": "/4eFgqxMbFxV7lSjRNphdCJK8VIt.jpg",              // TMDB ID: 12516
  "Driving Miss Daisy": "/vYcFBCj1gqTaFAfFdEiRjeMBBjU.jpg",           // TMDB ID: 403
  "Blue Velvet": "/p74T3JoHsL1MFMfL5rTgm3OWbeS.jpg",                  // TMDB ID: 793
  "Do the Right Thing": "/v8GAMPFijQddPWPxECDETRfSqfR.jpg",           // TMDB ID: 925

  // ===== HORROR =====
  "The Shining": "/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg",                  // TMDB ID: 694
  "A Nightmare on Elm Street": "/wGTpGGRMZmyFCcrY2mFKBSHoXw1.jpg",    // TMDB ID: 377
  "The Thing": "/tzGY49kseSE9QAKk47uuDGwnSCu.jpg",                    // TMDB ID: 1091
  "Poltergeist": "/2DMJV9RhTtaXnEUmjuqmBj1jCD5.jpg",                 // TMDB ID: 609
  "Gremlins": "/kFNVfJCjs5d4GD5nRt0dxMUcbtC.jpg",                    // TMDB ID: 927
  "The Fly": "/1MYCbEMbXTNjVbaiGJElCOGLkfR.jpg",                     // TMDB ID: 9426
  "Friday the 13th": "/HzrPn1gEHWixfMOvOehOTlHROo.jpg",               // TMDB ID: 4488
  "Halloween II": "/wSqAXL1EHVJ3MnDZ7dOucGGMscu.jpg",                 // TMDB ID: 11281
  "Christine": "/c0RuUAvsCW9t8gGVLR4cH3EB9t3.jpg",                    // TMDB ID: 10907
  "Hellraiser": "/tCBFDCeB3wYlfVHvE06tCOFfoJq.jpg",                   // TMDB ID: 9003

  // ===== TEEN =====
  "The Breakfast Club": "/aYPV0pzfoaaCvn9CBfXPqqFMFTi.jpg",            // TMDB ID: 2108
  "Sixteen Candles": "/aXcidnDDnCmoEnc9MIQ7bNlMd2z.jpg",              // TMDB ID: 15144
  "Pretty in Pink": "/cMcggIi3JDvnVfK5BoMTj4BpkCA.jpg",               // TMDB ID: 11522
  "Fast Times at Ridgemont High": "/7jACMfZTM2r0IPo35JxnKbNn7Ix.jpg",  // TMDB ID: 13342
  "Heathers": "/n28BVBzMkim2dO2bInY7vMi1H7r.jpg",                     // TMDB ID: 2640
  "Say Anything...": "/mxVMJPx3rqBkRIBIXI5URqV1wdw.jpg",              // TMDB ID: 2028
  "Valley Girl": "/cpf1F0r33EX5vRBPDT1bBBgcj4r.jpg",                  // TMDB ID: 21580
  "Some Kind of Wonderful": "/z5WNAhS9DO4BBDNA39MHKGN8hyB.jpg",       // TMDB ID: 15143
  "Weird Science": "/fNOJwol6l1X82A3OQRT2FfdIPKN.jpg",                // TMDB ID: 11517

  // ===== SCI-FI =====
  "Back to the Future": "/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",           // TMDB ID: 105
  "E.T. the Extra-Terrestrial": "/an0UbGBgYMjO5CbRKcMV3UAvAcn.jpg",   // TMDB ID: 601
  "Blade Runner": "/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",                 // TMDB ID: 78
  "Tron": "/zwSFEczP4eOSCipmqeHBEBJf7HR.jpg",                        // TMDB ID: 97
  "WarGames": "/gOINggBk1iFLTZFDifxFGPaqjzd.jpg",                     // TMDB ID: 860
  "The Last Starfighter": "/an1x4uKGERzVJvZpAo7qMiEMDBX.jpg",         // TMDB ID: 11884
  "Cocoon": "/sLXYEGxwbPIh2FwBcEGdBqO2hJR.jpg",                      // TMDB ID: 10328
  "Short Circuit": "/kHSHIYe9sYKehTH97WMQlzL7KYm.jpg",                // TMDB ID: 2605
  "They Live": "/wXlOkp4002hAP7drPaFPmA1kHKH.jpg",                   // TMDB ID: 8337

  // ===== ROMANCE =====
  "Dirty Dancing": "/ePXzWAn8015YPEk3RkEB3GXlhBx.jpg",                // TMDB ID: 88
  "Flashdance": "/hGGRxjRDBhp2yRRAPRAYBo7FMbt.jpg",                   // TMDB ID: 535
  "An Officer and a Gentleman": "/chQtVijGFPzFMYEnFolk09JbRLU.jpg",    // TMDB ID: 2623
  "When Harry Met Sally...": "/srlSH8mGonEcSvSDlo17RKZNT3Z.jpg",      // TMDB ID: 639
  "Moonstruck": "/tmHNSJOGjrJwxiPbZBEVlORjCgx.jpg",                  // TMDB ID: 2039
  "The Princess Bride": "/gpSiauHMK84aTSAlWpPbCKjJBKQ.jpg",           // TMDB ID: 2493
};

// TMDB IDs mapping (useful for API calls)
const TMDB_IDS = {
  "Raiders of the Lost Ark": 85,
  "Die Hard": 562,
  "The Terminator": 218,
  "RoboCop": 5548,
  "Beverly Hills Cop": 90,
  "Top Gun": 744,
  "Lethal Weapon": 941,
  "Aliens": 679,
  "First Blood": 1368,
  "Predator": 106,
  "Ghostbusters": 620,
  "Ferris Bueller's Day Off": 9377,
  "Tootsie": 9576,
  "Coming to America": 9602,
  "Airplane!": 813,
  "Beetlejuice": 4011,
  "Trading Places": 1621,
  "National Lampoon's Vacation": 11153,
  "Spaceballs": 957,
  "9 to 5": 9918,
  "Stand By Me": 235,
  "Scarface": 111,
  "Rain Man": 380,
  "The Color Purple": 873,
  "Platoon": 792,
  "Full Metal Jacket": 600,
  "Ordinary People": 12516,
  "Driving Miss Daisy": 403,
  "Blue Velvet": 793,
  "Do the Right Thing": 925,
  "The Shining": 694,
  "A Nightmare on Elm Street": 377,
  "The Thing": 1091,
  "Poltergeist": 609,
  "Gremlins": 927,
  "The Fly": 9426,
  "Friday the 13th": 4488,
  "Halloween II": 11281,
  "Christine": 10907,
  "Hellraiser": 9003,
  "The Breakfast Club": 2108,
  "Sixteen Candles": 15144,
  "Pretty in Pink": 11522,
  "Fast Times at Ridgemont High": 13342,
  "Heathers": 2640,
  "Say Anything...": 2028,
  "Valley Girl": 21580,
  "Some Kind of Wonderful": 15143,
  "Weird Science": 11517,
  "Back to the Future": 105,
  "E.T. the Extra-Terrestrial": 601,
  "Blade Runner": 78,
  "Tron": 97,
  "WarGames": 860,
  "The Last Starfighter": 11884,
  "Cocoon": 10328,
  "Short Circuit": 2605,
  "They Live": 8337,
  "Dirty Dancing": 88,
  "Flashdance": 535,
  "An Officer and a Gentleman": 2623,
  "When Harry Met Sally...": 639,
  "Moonstruck": 2039,
  "The Princess Bride": 2493,
};
