  console.log("Hello, fox. It's been a while.");
  var aryCommanders = [];
  var scryResults;

  setTimeout(getScryResults, 1000);

  /**************************
  == Functions start here! ==
  **************************/

  function getRandCard() {

    var intRandom = 0;
    var output = aryCommanders[intRandom];

    let msgTotal = `Selected from ${aryCommanders.length} possible Commanders...`;
    console.log(msgTotal);
    document.getElementById("cardContain").innerHTML = "<h3>" + msgTotal + "</h3>";

    if (aryCommanders.length > 1)
    {
      intRandom = Math.floor(Math.random() * aryCommanders.length);
      output = aryCommanders[intRandom];
      aryCommanders.splice(intRandom, 1)
    }
    // End of If (Check that there's more than one Commander available)

    console.log("Randomly selected index is " + intRandom);
    console.log("Result: " + output.name);

    fillCard(output);
  }
  // End of getRandCard function

  function fillCard(inCard) {

    let cardTemplate = `<h1>${inCard.name}</h1>` +
      `<ul>` +
      `<li><a href="${inCard.scryfall_uri}">Scryfall</a></li>` +
      `<li><a href="${inCard.related_uris.edhrec}">EDHREC</a></li>` +
      `<li><a href="${inCard.purchase_uris.tcgplayer}">TCG Player</a></li>` +
      `<li>My Guess at Price: ${inCard.prices.usd}</li>` +
      `</ul>` +
      `<button onclick="getRandCard()">You want a different one!?</button><br>`;
    // End of cardTemplate (base)

    if (typeof inCard.card_faces != "undefined")
    {
      for (var i = 0; i < inCard.card_faces.length; i++)
      {
        cardTemplate += `<img src="${inCard.card_faces[i].image_uris.small}">`;
      }
      // End of For loop
    }
    // End of If
    else
    {
      cardTemplate += `<img src="${inCard.image_uris.small}">`;
    }
    // End of If/Else (There's more than one card face)
    // End of More Than One Face catch

    document.getElementById("cardContain").innerHTML += cardTemplate;
    document.getElementById("cardContain").style.display = "block";
    document.getElementById("formContain").style.display = "block";
  }
  // End of fillCard function

  function getAPIcall() {
    let output = `https://api.scryfall.com/cards/search?q=`;
    output += `is%3Acommander`;

    let params = new URLSearchParams(location.search);

    let priceUSD = Number(params.get(`priceUSD`));
    if(typeof priceUSD === "number" && priceUSD >= 0.50)
    {
      console.log("Price check is: Less than $" + priceUSD);
      output += `+usd<${priceUSD}`;
    }
    // End of Price Check

    let partner = params.get("partner");
    var colorSearch = "+color>%3D"
    if (partner == "yes")
    {
      output += `+oracle%3Apartner`;
      colorSearch= `+commander%3A`;
    }
    else if (partner == "no")
      output += `+-oracle%3Apartner`;
    // End of Partner Check

    let colors = params.getAll("colors");
    if (colors.length > 0)
    {
      output += colorSearch;
      for (var i = 0; i < colors.length; i++)
      {
          output += colors[i];
      }
      // End of For loop
    }
    // End of Color Check

    console.log("Current API call is: " + output);
    return output;
  }

  function getScryResults(urlScryfall = getAPIcall()) {
    console.log("Current API call: " + urlScryfall);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {

      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        scryResults = JSON.parse(this.responseText);
        console.log("Call successful! Scryfall reports " + scryResults.total_cards + " total commanders.");

        aryCommanders = aryCommanders.concat(scryResults.data);

        document.getElementById("msgLoading").innerHTML = "Loaded " + aryCommanders.length + " out of " + scryResults.total_cards + " possible commanders...";
        console.log("Page appended, checking the next...");

        if (typeof scryResults.next_page != "undefined") {
          console.log("There's another page after this one!");
          getScryResults(scryResults.next_page);
        } else {
          document.getElementById("msgLoading").style.display = "none";
          getRandCard();
        }

      }
      // End of If (ready!)
      else {
        console.log("Failed to call!");
      }
      // End of Else
    };
    // End of onreadystatchange function re-write

    console.log("Attempting API call...");

    xmlHttp.open("GET", urlScryfall, true); // true for asynchronous
    xmlHttp.send();
  }
  // End of GetAllCards function
