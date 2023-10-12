const Sentiment = require('sentiment');
var sentiment = new Sentiment();

export async function analyze(userInput: string) {
  let sentimentResult = sentiment.analyze(userInput);
  console.log(sentimentResult);
  return sentimentResult;
}
