$(document).ready(function () {
/* Global Variables*/
var breweries=[];
infowindow = new google.maps.InfoWindow();
var mainloc = {lat:38.92039, lng: -77.03856}
var map = new google.maps.Map(document.getElementById('gmap'), {zoom: 11, center: mainloc}); 
var zip=20009;   
var rating=0;
var offset = 0;
var breweries=[];
var radius=1609;

var firebaseConfig = {
    
    apiKey: "AIzaSyDE3_11naowktsLw-bEZxFSwOv8VawBMkc",
    authDomain: "hopinbrew.firebaseapp.com",
    databaseURL: "https://hopinbrew.firebaseio.com",
    projectId: "hopinbrew",
    storageBucket: "hopinbrew.appspot.com",
    messagingSenderId: "839591263082",
    appId: "1:839591263082:web:07ec0df0eea18972"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
     var database = firebase.database();

/* end GV */

/* Search Click*/
$(document).on ("click", "#search-btn", function (event)  { 
event.preventDefault();
$("#search-nav").empty();   
$("#results").empty();
breweries=[];
offset=0;
         
zip=$("#zip-select option:selected").attr("zip");
radius=$("#rad-select option:selected").attr("radius");
rating=$("#yelp-select option:selected").attr("rating");
console.log("Zip from search click is is" + zip)
console.log("Radisu selected from search click is" + radius)
console.log("Rating selected from search click is" + rating) 
console.log("offset when serch was clicked is " + offset)
   

map = new google.maps.Map(document.getElementById('gmap'), {zoom: 11, center: mainloc}); 

/* call function to do api call and determine number of pages for search results nav*/
getBrewPages(zip, radius, rating);

/* end Search click */    
});

/* Get number of pages to create based on filters */
function getBrewPages (zip, radius, rating) {
    breweries=[]
    var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" + zip + "&radius=" + radius + "&term=breweries&categories=breweries&sort_by=distance&limit=50",
            "method": "GET",
            "headers": {
              "Authorization": "Bearer 8D_mZteQabQeW-jEZAK4kU4o9h7PhhECcqPsritDt99eippSSN851BkePtOuCLpVShTshzeKUUKDiHj51cX4vJMN0YZY_tPNJVTsapTBgoWt0dErzhHH1psW0FYKXXYx",
            }
          }
    
    
          $.ajax(settings).then(function(response) {

            console.log(response)

          
            var brewPages=0;

            if (response.businesses.length === 0) {
              console.log("No Search results")
              $("#search-modal").modal("toggle");
            } else {

            for (i =0; i < response.businesses.length; i++) {

              if (response.businesses[i].rating >= rating) {
               breweries.push(response.businesses[i]);
              }
       
             } 
           

            }
        console.log("Breweries after filtering for rating is " + breweries.length); 
        
        if(breweries.length===0) {
          $("#search-modal").modal("toggle");
        } else {

          if(((breweries.length) % 10) === 0 ){

            brewPages=(breweries.length) / 10;
    
             } else {
            brewPages = Math.floor((breweries.length) / 10) + 1;
            
            }
    
        
        console.log("initial number of pages is " + brewPages)
       
    
        createNav(brewPages, offset);

        }

        
    
    /* end ajax request*/
    });


/* end get brew pages*/    
};


function createNav(brewPages, offset) {
$("#search-nav").empty();
console.log("number of pages is " + brewPages)
    
for (i=1; i <= brewPages; i++ ) {
console.log("page " + i);
        var navLi=$("<li>");
        navLi.addClass("page-link page-item");
        navLi.attr("value", offset);
        navLi.text(i);
        $("#search-nav").append(navLi);
        offset=parseInt(offset+10);

    }
offset=0;
createBrews(breweries, offset, brewPages);
/* end createNAv function*/
};



function createBrews(breweries, offset) { 
  console.log("breweries at beginning of loop is " + breweries)
    $("#results").empty();
    for (i=offset; i < (offset +10); i++) {
      
        if (breweries[i] !== undefined ) {
        var itemNum=parseInt(i);
        console.log("Item num at beg of loop is "+ itemNum)
    /*dom push*/
           var mediaDiv=$("<div>");
           mediaDiv.addClass("media");
           mediaDiv.attr("id", "media"+i);
           mediaDiv.attr("value", i);
    
           $("#results").append(mediaDiv);
    
    
           var mediaImg=$("<img>");
           mediaImg.attr("id", "media-image"+i);
           mediaImg.attr("src", breweries[i].image_url);
           mediaImg.addClass("d-flex align-self-start");
    
           $("#media"+i).append(mediaImg);
    
           var bodyDiv=$("<div>");
           bodyDiv.addClass("media-body pl-3");
           bodyDiv.attr("id", "media-body"+i);
    
           $("#media"+i).append(bodyDiv);
    
           var bodyHeadDiv=$("<div>");
           bodyHeadDiv.addClass("stats");
           bodyHeadDiv.attr("id", "head-div"+i);
    
           var barNameSpan=$("<span>");
           barNameSpan.attr("id", "bar-name"+i);
           itemNum=parseInt(itemNum + 1);
           barNameSpan.text(itemNum +  ". " + breweries[i].name);
     
           var barAdd1Div=$("<div>");
           barAdd1Div.attr("id", "bar-add-1"+i)
           barAdd1Div.addClass("address");
           barAdd1Div.text(breweries[i].location.display_address[0]);
    
           var barAdd2Div=$("<div>");
           barAdd2Div.attr("id", "bar-add-2" +i);
           barAdd2Div.addClass('address');
           barAdd2Div.text(breweries[i].location.city + " " + breweries[i].location.zip_code);
    
           var barPhDiv = $("<div>");
           barPhDiv.attr("id", "bar-phone"+i);
           barPhDiv.addClass("address");
           barPhDiv.text(breweries[i].display_phone);
    
            var barRatSpan=$("<span>");
           barRatSpan.attr("id", "bar-rat"+i);
           barRatSpan.text("Rating ");
           barRatSpan.addClass("rat-span");
           
    
           var barYelpWeb =$("<div>");
           barYelpWeb.attr("id", "yelp-web"+i);
           barYelpWeb.addClass("yelplink");
           barYelpWeb.html('<a target="_blank" href="' + breweries[i].url + '"> Yelp Website</a>');
    
            var barStarOuterDiv = $("<div>");
            barStarOuterDiv.addClass("stars-outer");
            barStarOuterDiv.attr("id", "stars-outer"+i);
    
            var barRat = parseInt(breweries[i].rating);
            var ratPerc = ((barRat/5) * 100);
    
            var barStarInnerDiv = $("<div>");
            barStarInnerDiv.addClass("stars-inner");
            barStarInnerDiv.attr("id", "stars-inner"+i);
            barStarInnerDiv.css("width", ratPerc+"%");
    
           $("#media-body"+i).append(bodyHeadDiv, barAdd1Div, barAdd2Div, barPhDiv, barYelpWeb);
           $("#head-div"+i).append(barNameSpan);
           $("#yelp-web"+i).append(barRatSpan);
           $("#bar-rat"+i).append(barStarOuterDiv);
           $("#stars-outer"+i).append(barStarInnerDiv);


           var loc = {lat: breweries[i].coordinates.latitude, lng: breweries[i].coordinates.longitude}
           var brewName = breweries[i].name;
           var brewAdd = breweries[i].location.address1 + " " + breweries[i].location.city + " " + breweries[i].location.zip_code;
           var brewPh = breweries[i].display_phone;
           var brewRat = breweries[i].rating;
           var label = (itemNum).toString();
           createMarker(loc, brewName, brewAdd, brewPh, label, brewRat);
   
   
   
           function createMarker(loc,brewName,brewAdd, brewPh, label, brewRat) { 
           
           var marker = new google.maps.Marker({position: loc, label: label , map: map, id:"marker"+i, animation:google.maps.Animation.DROP});
      
          
           google.maps.event.addListener(marker, 'click', function() {
               infowindow.setContent("<strong>"+ brewName +"</strong>"+ "<br/>" + brewAdd + "<br/>" + brewPh + "<br/>" + "Rated " + brewRat + " Stars");
               
               infowindow.open(map, this);
             });
        }
      /*end  loop*/     
    }
/* end if*/
} 
/* end createBrews*/    
};

$(document).on ("click", ".page-item", function (event){ 

event.preventDefault();

map = new google.maps.Map(document.getElementById('gmap'), {zoom: 11, center: mainloc}); 
offset=parseInt($(this).attr("value"));
    
console.log("offset clicked  for pag value is " + $(this).attr("value"));

console.log("offset is " + offset)

createBrews(breweries, offset)




/*end page nav click section*/    
});

/*Contact Form Processing */

        // Capture Button Click
$(document).on("click", "#join", function(event) {
 event.preventDefault();
    
          console.log ("Join clicked")
    
          // Capture user inputs and store them into variables
          var name = $("#name-input").val().trim();
          var email = $("#email-input").val().trim();
          var messages = $("#messages-input").val().trim();
          
          var newMember = {
              name: name,
              email: email,
              messages: messages,
              };
    
          database.ref().push(newMember);
          
          // Console log each of the user inputs to confirm we are receiving them
          console.log(name);
          console.log(email);
          console.log(messages);
          
                // Clear sessionStorage
          sessionStorage.clear();
    
          // Store all content into sessionStorage
          sessionStorage.setItem("name", name);
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("messages", messages);
    
          console.log ("Name is " + name);
          $("#form-name").text(name);
          $("#contact-modal").modal("toggle");
    
          $("#contact-form").trigger("reset");
    
     });

/* end ready doc*/    
});