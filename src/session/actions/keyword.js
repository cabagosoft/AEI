export const createKeyword = text => {
   const arrangementKeywords = [];

   const arrangementWords = text.match(/("[^"]+"|[^"\s]+)/g);

   arrangementWords.forEach(word => {
      let summaryWord = "";

      word.split("").forEach(lyrics => {
         summaryWord += lyrics;
         arrangementKeywords.push(summaryWord.toLowerCase());
      });
   });

   let summaryLyrics = "";
   text.split("").forEach(lyrics => {
      summaryLyrics += lyrics;
      arrangementKeywords.push(summaryLyrics);
   });

   return arrangementKeywords;
};   