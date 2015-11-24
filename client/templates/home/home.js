/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function () {

});

Template.Home.onRendered(function () {

    //var stories = Stories.find({Name:'CPFXG265'});
    var stories = Stories.find({});
    var storiesArr = stories.fetch();
    console.log('stories size', storiesArr.length);
    console.log('stories:',storiesArr);
    var dates = _.pluck(storiesArr, 'date');
    var successes = _.pluck(storiesArr, 'Successful');
    var pendings = _.pluck(storiesArr, 'Pending');
    var notPerformed = _.pluck(storiesArr, 'Not Performed');
    var fails = _.pluck(storiesArr, 'Failed');
    console.log('dates', dates);
    console.log('successes', successes);
    console.log('pendings', pendings);
    console.log('notPerformed', notPerformed);
    console.log('fails', fails);

    var statuses = ['Successful', 'Pending', 'Failure', 'Not Performed'];


    var data = {
        labels: dates, //['Monday', 'Tuesday'],
        series: [
            successes,
            pendings,
            fails,
            notPerformed
        ]
    };
    var options = {
        fullWidth: true,
        chartPadding: {
            right: 40
        }
        // width: '700px',
        // height: '400px'
    };
    new Chartist.Line('.ct-chart', data, options);

    var legend = $('.ct-legend');

    $.each(statuses, function(i, val) {
        var listItem = $('<li />')
            .addClass('ct-series-' + i)
            .html('<strong>' + val + '</strong>')
            .appendTo(legend);
    });


});

Template.Home.onDestroyed(function () {
});
