
document.getElementById("button").addEventListener("click", changeColor);

function changeColor() {
  var newRed = Math.floor((Math.random() * 255));
  var newGreen = Math.floor((Math.random() * 255));
  var newBlue = Math.floor((Math.random() * 255));

  var myColor = new Color(newRed, newGreen, newBlue);

  document.getElementById("body").style.backgroundColor = myColor.hex;
  document.getElementById("color").innerHTML = "<h3>Current Color:</h3><p>" + myColor.hex + "</p>"
}

function Color(red, green, blue) {

  this.Parse = function(value) {
    var output = "";
    if (value <= 16)
      output = "0" + value.toString(16);
    else if (value >= 255)
      output = "ff";
    else
      output = value.toString(16);

    return output;
  };

  this.red = red;
  this.green = green;
  this.blue = blue;
  this.hex = "#" + this.Parse(red) + this.Parse(green) + this.Parse(blue);
}
