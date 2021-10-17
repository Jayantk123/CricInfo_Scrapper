const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
// url
const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const allMatchObj = require("./Allmatch");

const iplpath = path.join(__dirname,"ipl");
createdir(iplpath);
request(url,cb);

// homepage
function cb(error,response,html)
{
if(error)
{
    console.log(error);
}
else
{
    // console.log(html);
     extractLink(html);

}
}

// extract all matches link
function extractLink(html)
{
    let $ = cheerio.load(html);  //parse html
    let anchorel = $("a[data-hover='View All Results']");
    let link = anchorel.attr("href");

    // console.log(link);
    let fullLink = "https://www.espncricinfo.com"+link;
     console.log(fullLink);

     allMatchObj.gALmatches(fullLink);

}


function createdir(fpath)
{
    if(fs.existsSync(fpath)==false)
    {
        fs.mkdirSync(fpath);
    }
}


