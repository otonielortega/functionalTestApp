function createFileDateObject() {
    var fs = Npm.require("fs");
    var filesPath = '../../../../../private/htmlHistory';

    var filesFound = fs.readdirSync(filesPath);
   // console.log('files :', filesFound);

    var fileDates = [];
    filesFound.forEach(function (elem, index) {
        var dateString = elem.substr(9, 19);
       // console.log('date:', dateString);

        //var dateString = "2010-08-09 01:02:03";
        var reggie = /(\d{4})-(\d{2})-(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})/;
        var dateArray = reggie.exec(dateString);
        var dateObject = new Date(
            (+dateArray[1]),
            (+dateArray[2]) - 1, // Careful, month starts at 0!
            (+dateArray[3]),
            (+dateArray[4]),
            (+dateArray[5]),
            (+dateArray[6])
        );
        fileDates[index] = {elem, dateObject};
    });
    //console.log('dates :',fileDates);
    return fileDates;
}

Meteor.startup(function () {


    if (Meteor.isServer) {
        cheerio = Npm.require('cheerio');

        var fileDates = createFileDateObject();
       // console.log('file k/v array', fileDates);

        fileDates.forEach(function(key, index){

           // console.log("Getting a file.");
            var fileName = key.elem;
            var isFileProcessed = Stories.findOne({fileName:key.elem});
           // console.log('isFileProcessed:', isFileProcessed);
            if(isFileProcessed) return;


            var fileContents = Assets.getText('htmlHistory/'+ fileName);
            console.log("got the file");
            var $ = cheerio.load(fileContents);

            //console.log('filecontents size:' + fileContents.length);

            var tableArr = [];
            //console.log('num tables: ', $('table').length);
            $('table').each(function (i, elem) {
                tableArr[i] = $(this).text();
                console.log('table ' + i + ": found");


                //Get the column headers
                var headerTds = [];
                $(this).find('tr').eq(1).find('th').each(function (i, elem) {
                    headerTds[i] = $(this).text().trim();

                });
                console.log('headerTds:', headerTds.join(','));


                //Get each row and create objects with the column headers as the keys and td cells as values
                $(this).find('tr').each(function (i, elem) {
                    if (i < 2 || $(this).hasClass('totals')) {
                        return;
                    }
                    var rowTds = {};
                    $(this).find('td').each(function (i, elem) {
                        var headerTd = headerTds[i];
                        if (headerTd.indexOf("View") != -1) {
                            return;
                        }
                        if (headerTd.indexOf("Duration") != -1) {
                            headerTd = 'Duration';
                        }
                        rowTds[headerTd] = $(this).text().trim();

                    });
                    rowTds.fileName = key.elem;
                    rowTds.date = key.dateObject;

                    console.log('json string of row:', rowTds);


                    //Insert row into database
                    Meteor.call('storyInsert', rowTds, function (error, result) {
                        if (error) {
                            console.log(error.reason);
                            return error.reason;
                        }
                        if (result._id) {
                            console.log("story id inserted:" + result._id);
                        }
                    });

                });

            });

        });

        console.log('done parsing files');

    }
});

