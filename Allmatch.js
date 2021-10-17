const request = require("request");
const cheerio = require("cheerio");

const scoreCardObj = require("./scorecard");

// get all matches
function getAllmatchlink(url){
    request(url,cs);

    function cs(error,response,html)
    {
        if(error)
{
    console.log(error);
}
else
{
    // console.log(html);
     getallLinks(html);

}
    }
}

// get all scorecard links
function getallLinks(html)
{
    let $ = cheerio.load(html);
   let scorecardelem =  $("a[data-hover='Scorecard']");

   for(let i=0;i<scorecardelem.length;i++)
   {
       let link = $(scorecardelem[i]).attr("href");
    //    console.log(link);

    let fullLink = "https://www.espncricinfo.com"+link;
     console.log(fullLink);


    scoreCardObj.gurl(fullLink);
   }

}


module.exports={
    gALmatches: getAllmatchlink
}
