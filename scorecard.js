const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

// url
const request = require("request");
const cheerio = require("cheerio");

const path = require("path");
const fs=require("fs");
const xlsx = require("xlsx");

function gallurl(url)
{
    request(url,cb);
}


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
     extractmatchdetail(html);

}
}

// req:  venue date opponent result runs balls fours sizes sr 
function extractmatchdetail(html)
{

    // create team folder->player folder->add detail like..run balls fours etc
 
    // venue data  result ..common
    // venue date........ .event .description
    // result..   .event.status - text


    let $ = cheerio.load(html);
    let descElem = $(".match-header-info.match-info-MATCH .description");
    let result = $(".event .status-text");
    let stringarr = (descElem.text()).split(",");
    let venue=stringarr[1].trim();
    let date=stringarr[2].trim();
    result=result.text();
    // console.log(venue,date);
    // console.log(result.text());

    let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
    let htmlString="";
    for(let i=0;i<innings.length;i++)
    {
        // html+=$(innings[i]).html(); //store html part

        // team opp
    let teamName = $(innings[i]).find("h5").text();
    teamName=teamName.split("INNINGS")[0].trim();
    let oppIdx = i==0?1:0;

    let oppName = $(innings[oppIdx]).find("h5").text();
    oppName = oppName.split("INNINGS")[0].trim();

    let cInning = $(innings[i]);

    console.log(`${venue} | ${date} | ${teamName} | ${oppName} | ${result}`);
    let allRows = cInning.find(".table.batsman tbody tr");

    for (let j = 0; j < allRows.length; j++) {
        let allCols = $(allRows[j]).find("td");
        let isWorthy = $(allCols[0]).hasClass("batsman-cell");
        if (isWorthy == true) {
            // console.log(allCols.text());
            //       Player  runs balls fours sixes sr 
            let playerName = $(allCols[0]).text().trim();
            let runs = $(allCols[2]).text().trim();
            let balls = $(allCols[3]).text().trim();
            let fours = $(allCols[5]).text().trim();
            let sixes = $(allCols[6]).text().trim();
            let sr = $(allCols[7]).text().trim();
             console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
             console.log("---------------------------------");
        
             processplayer(teamName,playerName,runs,balls,fours,sixes,sr,oppName,venue,date,result);
            }
    }

// player run balls fours sixes sr

    }
    // console.log(html);

}


function processplayer(teamName,playerName,runs,balls,fours,sixes,sr,oppName,venue,date,result)
{
      let teampath = path.join(__dirname,"ipl",teamName);
      createdir(teampath);

      let filepath = path.join(teampath,playerName+ ".xlsx");
     let content = exelreader(filepath,playerName);
     let playerObj = {
         teamName,
         playerName,
         runs,balls,fours,sixes,sr,oppName,venue,date,result
     }

     content.push(playerObj);
     excelWriter(filepath,content,playerName);
}


function createdir(fpath)
{
    if(fs.existsSync(fpath)==false)
    {
        fs.mkdirSync(fpath);
    }
}

function excelWriter(filepath,json,sheetname)
{
let newWB = xlsx.utils.book_new();

// // json data->excel format convert
let newWS = xlsx.utils.json_to_sheet(json);

// // newb , ws , sheet name
xlsx.utils.book_append_sheet(newWB,newWS,sheetname);
// // filepath

xlsx.writeFile(newWB,filepath);

}



// read file
// wrkbook get

function exelreader(filepath,sheetname)
{
    // file path not exist
    if(fs.existsSync(filepath)==false)
    {
        return [];
    }

let wb = xlsx.readFile(filepath);
// sheet get
let exceldata = wb.Sheets[sheetname];
// sheet data get
let ans = xlsx.utils.sheet_to_json(exceldata);

// console.log(ans);
return ans;
}



module.exports={
    gurl: gallurl
}
