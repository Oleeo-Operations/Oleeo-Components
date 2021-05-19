// Regex
const brTagRegex = /<br([^>]*)\/>/g;
const strongTagRegex = /<strong([^>]*)>/g;
const openH1TagRegex = /<h1([^>]*)>/g;
const openH2TagRegex = /<h2([^>]*)>/g;
const openH3TagRegex = /<h3([^>]*)>/g;
const openH4TagRegex = /<h4([^>]*)>/g;
const openH5TagRegex = /<h5([^>]*)>/g;
const openH6TagRegex = /<h6([^>]*)>/g;
const closeHTagRegex = /<\/h[1-6]([^>]*)>/g;
const ulTagRegex = /<(\/)?ul([^>]*)>/g;
const emptyATag = /<a href=""\/>/g
// Need two li regex so it does not target link tag
const liTagRegex = /<li>/g;
const liClassTagRegex = /<li( [^>]*)>/g;

// Replacement Strings
function hTagReplacementStrings(fontSize: number){
  return `<p style="font-size: ${fontSize}px"$1>`.concat('<strong>')
}
const closeHTagReplacementString = '</strong></p>';
const openLiTagReplacementString = '<p style="padding-left:20px">'.concat('• ');
const openLiClassTagReplacementString = '<p style="padding-left:20px"$1>'.concat('• ');

// Formats xml into P tags in order to be rendered in order
function formatXML(data: string){
    let formattedResponse = ''
        let brTags = data.replace(brTagRegex, '')
        let openStrongTags = brTags.replace(strongTagRegex, '');
        let closeStrongTags = openStrongTags.split('</strong>').join('');
        let openingH1Tag = closeStrongTags.replace(openH1TagRegex, hTagReplacementStrings(24));
        let openingH2Tag = openingH1Tag.replace(openH2TagRegex, hTagReplacementStrings(23));
        let openingH3Tag = openingH2Tag.replace(openH3TagRegex, hTagReplacementStrings(22));
        let openingH4Tag = openingH3Tag.replace(openH4TagRegex, hTagReplacementStrings(21));
        let openingH5Tag = openingH4Tag.replace(openH5TagRegex, hTagReplacementStrings(20));
        let openingH6Tag = openingH5Tag.replace(openH6TagRegex, hTagReplacementStrings(19));
        let closingHTag = openingH6Tag.replace(closeHTagRegex, closeHTagReplacementString);
        let ul = closingHTag.replace(ulTagRegex, '');
        let openingLi = ul.replace(liTagRegex, openLiTagReplacementString);
        let openingLiClass = openingLi.replace(liClassTagRegex, openLiClassTagReplacementString)
        let closingLi = openingLiClass.split('</li>').join('</p>');
        let emptyATags = closingLi.replace(emptyATag, '')
      // assign all changes to formattedResponse
      formattedResponse = emptyATags;
   return formattedResponse;
};

export default formatXML;