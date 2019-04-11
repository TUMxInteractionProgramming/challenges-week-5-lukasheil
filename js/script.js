/* start the external action and say hello */
console.log("App is alive");


/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

var channels = [yummy, sevencontinents, killerapp, firstpersononmars, octoberfest];

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}


// toggle (show/hide) the emojis menu

function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
}

/* #10 adding emojis with this function and calling function in the body onload event */
function loadEmojis() {
    var emojis = require('emojis-list');
    $('#emojis').empty();
    for (emoji in emojis) {
        $('#emojis').append(emojis[emoji] + " ");
    }
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var text = ($('#message').val());

    // #10 Checking if message is empty
    if (text.length == 0) {
        //exit if no text
        alert("Please enter some text");
        return;
    }

    // #10 New Variable message, when text is not empty
    var message = new Message(text);

    // #10 pushing new message to current channel array
    currentChannel.messages.push(message);

    // #10 increasing message count +1 
    currentChannel.messageCount+=1;

    // #8 convenient message append with jQuery:
    $('#messages').append(createMessageElement(message));

    // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 clear the message input
    $('#message').val('');
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message md-whiteframe-2dp'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent materialButton">+5 min.</button>' +
        '</div>';
}


function listChannels(criterion) {
    //  #8 channel onload

     console.log("listChannels wurde aufgerufen");
     console.log("Channels array"+ channels[0])

    // #10 sorting channels by criterion
     channels.sort(criterion);

    // #10 avoids duplicating list when clicking tab bar buttons
    $('#channels ul').empty();

    // #10 appends channels from array
     var i;
     for (i = 0; i < channels.length; i++) { 
         $('#channels ul').append(createChannelElement(channels[i]));
         console.log("i is"+ channels[i].name);
     }

}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);
        
    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}

// #10 Compare Functions

function compareTrending(channelA, channelB) {
    return channelB.messageCount - channelA.messageCount;
}

function compareNew(channelA, channelB) {
    return channelB.createdOn - channelA.createdOn;
}

function compareFavorites(channelA, channelB) {
    return channelA.starred ? -1 : 1;
}

// #10 new function for "create new channel"-Mode

function initCreationMode() {
   //#10 swapping  right app-bar
   $('#app-bar-messages').hide();
   $('#app-bar-create').addClass('show');

   //#10 clearing messages in  container
   $('#messages').empty();

   //#10 swapping send and create button
   $('#sendButton').hide();
   $('#button-create').show();
}


// #10 function to end "create new channel"-mode

function abortCreationMode() {
   //#10 abort restores previously selected channel
   $('#app-bar-messages').show();
   $('#app-bar-create').removeClass('show');
   $('#button-create').hide();
   $('#sendButton').show();
}